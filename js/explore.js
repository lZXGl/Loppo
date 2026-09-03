let currentCategory = 'All';
let searchTerm = '';
let usersData = [];
let friendsList = JSON.parse(localStorage.getItem('friendsList') || '[]');
let blockedUsers = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
let reportedUsers = JSON.parse(localStorage.getItem('reportedUsers') || '[]');
let currentReportUserId = null;
let currentBlockUserId = null;

const translations = {
    en: {
        exploreTitle: 'Discover Users', exploreDesc: 'Connect with people who share your interests',
        suggestedTitle: 'Suggested Topics', searchPlaceholder: 'Search users by name...',
        emptyState: 'No users found',
        tech: 'Technology', gaming: 'Gaming', webdev: 'WebDev', ai: 'AI', design: 'Design', dataScience: 'Data Science',
        follow: 'Follow', following: 'Following', followers: 'followers'
    },
    ar: {
        exploreTitle: 'اكتشف المستخدمين', exploreDesc: 'تواصل مع الأشخاص الذين يشاركونك اهتماماتك',
        suggestedTitle: 'المواضيع المقترحة', searchPlaceholder: 'ابحث عن مستخدمين بالاسم...',
        emptyState: 'لم يتم العثور على مستخدمين',
        tech: 'تقنية', gaming: 'ألعاب', webdev: 'تطوير ويب', ai: 'ذكاء اصطناعي', design: 'تصميم', dataScience: 'علوم بيانات',
        follow: 'متابعة', following: 'متابع', followers: 'متابع'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    loadUsers();
    document.getElementById('confirmReportBtn')?.addEventListener('click', submitReport);
    document.getElementById('confirmBlockBtn')?.addEventListener('click', confirmBlock);
});

document.addEventListener('languageChanged', () => {
    updateLanguage();
    renderUsers();
});

function updateLanguage() {
    const t = translations[currentLanguage];
    const ids = ['exploreTitle', 'exploreDesc', 'suggestedTitle', 'catTech', 'catGaming', 'catWebDev', 'catAI', 'catDesign', 'catDataScience'];
    const keys = ['exploreTitle', 'exploreDesc', 'suggestedTitle', 'tech', 'gaming', 'webdev', 'ai', 'design', 'dataScience'];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = t[keys[i]];
    });
    const searchInput = document.getElementById('search-users');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;
}

async function loadUsers() {
    try {
        const res = await fetch('/api/users');
        if (res.ok) {
            usersData = await res.json();
            // Check follow status for each user
            if (globalCurrentUser) {
                for (const user of usersData) {
                    try {
                        const fRes = await fetch(`/api/follows/${user.id}`);
                        if (fRes.ok) {
                            const data = await fRes.json();
                            if (data.following && !friendsList.some(f => f.id === user.id)) {
                                friendsList.push({ id: user.id, name: user.displayName || user.username, username: user.username });
                            }
                        }
                    } catch (e) {}
                }
                localStorage.setItem('friendsList', JSON.stringify(friendsList));
            }
            handleSearchParam();
            renderUsers();
        }
    } catch (err) { console.error('Error loading users:', err); }
}

function handleSearchParam() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
        searchTerm = q.toLowerCase();
        const input = document.getElementById('search-users');
        if (input) input.value = q;
    }
}

function filterUsers() {
    const input = document.getElementById('search-users');
    searchTerm = input.value.toLowerCase();
    renderUsers();
}

function filterByCategory(category) {
    currentCategory = category;
    renderUsers();
}

function getFilteredUsers() {
    let filtered = usersData.filter(user => !isUserBlocked(user.id));
    if (currentCategory !== 'All') {
        filtered = filtered.filter(user => user.category === currentCategory);
    }
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(user =>
            (user.displayName || '').toLowerCase().includes(term) ||
            (user.username || '').toLowerCase().includes(term) ||
            (user.bio || '').toLowerCase().includes(term)
        );
    }
    return filtered;
}

function renderUsers() {
    const container = document.getElementById('users-list');
    const filtered = getFilteredUsers();
    const t = translations[currentLanguage];
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state">${t.emptyState}</div>`;
        return;
    }

    container.innerHTML = filtered.map(user => `
        <div class="user-card">
            <div class="user-info">
                <h3>${escapeHtml(user.displayName || user.username)} <span style="color:var(--text-muted);font-size:0.85em;">@${escapeHtml(user.username)}</span></h3>
                <p>${escapeHtml(user.bio || '')}</p>
                <div class="user-stats">
                    <span>👥 ${t.followers}: ${user.karma || 0}</span>
                </div>
            </div>
            <div class="user-actions">
                <button class="btn-follow ${isFollowing(user.id) ? 'following' : ''}" onclick="toggleFollow(${user.id})">
                    ${isFollowing(user.id) ? t.following : t.follow}
                </button>
                <button class="btn-report" onclick="openReportModal(${user.id}, '${escapeHtml(user.displayName || user.username)}')">Report</button>
                <button class="btn-block" onclick="openBlockModal(${user.id}, '${escapeHtml(user.displayName || user.username)}')">Block</button>
            </div>
        </div>`).join('');
}

async function toggleFollow(userId) {
    try {
        const res = await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            const user = usersData.find(u => u.id === userId);
            if (data.following) {
                friendsList.push({ id: userId, name: user?.displayName || user?.username, username: user?.username });
                showNotification(`You followed ${user?.displayName || user?.username}`, 'success');
            } else {
                friendsList = friendsList.filter(f => f.id !== userId);
                showNotification(`You unfollowed ${user?.displayName || user?.username}`, 'info');
            }
            localStorage.setItem('friendsList', JSON.stringify(friendsList));
            renderUsers();
        }
    } catch (e) { console.error('Follow error:', e); }
}

function isFollowing(userId) {
    return friendsList.some(f => f.id === userId);
}

function isUserBlocked(userId) {
    return blockedUsers.some(u => u.id === userId);
}

function saveBlockedUsers() { localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers)); }
function saveReportedUsers() { localStorage.setItem('reportedUsers', JSON.stringify(reportedUsers)); }

function openReportModal(userId, userName) {
    currentReportUserId = userId;
    document.getElementById('reportUserName').textContent = userName;
    document.getElementById('reportModal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('reportReason').value = '';
}

function closeReportModal() {
    document.getElementById('reportModal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
    currentReportUserId = null;
}

function submitReport() {
    if (!currentReportUserId) return;
    const reason = document.getElementById('reportReason').value.trim();
    const user = usersData.find(u => u.id === currentReportUserId);
    if (!reportedUsers.some(u => u.id === currentReportUserId)) {
        reportedUsers.push({ id: currentReportUserId, name: user?.displayName || 'Unknown', reason: reason || 'No reason provided', time: new Date().toLocaleString() });
        saveReportedUsers();
        showNotification('Thank you for reporting', 'success');
    } else {
        showNotification('You have already reported this user', 'info');
    }
    closeReportModal();
}

function openBlockModal(userId, userName) {
    currentBlockUserId = userId;
    document.getElementById('blockUserName').textContent = userName;
    document.getElementById('blockModal').classList.add('active');
    document.getElementById('modalOverlay').classList.add('active');
}

function closeBlockModal() {
    document.getElementById('blockModal').classList.remove('active');
    document.getElementById('modalOverlay').classList.remove('active');
    currentBlockUserId = null;
}

function confirmBlock() {
    if (!currentBlockUserId) return;
    const user = usersData.find(u => u.id === currentBlockUserId);
    if (!blockedUsers.some(u => u.id === currentBlockUserId)) {
        blockedUsers.push({ id: currentBlockUserId, name: user?.displayName || 'Unknown', time: new Date().toLocaleString() });
        saveBlockedUsers();
        showNotification((user?.displayName || 'User') + ' has been blocked', 'info');
        friendsList = friendsList.filter(f => f.id !== currentBlockUserId);
        localStorage.setItem('friendsList', JSON.stringify(friendsList));
        renderUsers();
    } else {
        showNotification('User is already blocked', 'info');
    }
    closeBlockModal();
}

function closeAllModals() { closeReportModal(); closeBlockModal(); }
