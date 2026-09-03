let friendsList = [];
let currentChatUser = null;

const translations = {
    en: {
        friendsTitle: 'Friends', friendsDesc: 'People you follow and chat with',
        emptyTitle: 'No friends yet', emptyDesc: 'Follow people from the Explore page to see them here', emptyBtn: 'Explore Users',
        chatPlaceholder: 'Type a message...', unfollow: 'Unfollow', chat: 'Chat',
        removeFriendConfirm: 'Remove this friend?', friendRemoved: 'Friend removed',
        noUsers: 'No users to chat with yet.'
    },
    ar: {
        friendsTitle: 'الأصدقاء', friendsDesc: 'الأشخاص الذين تتابعهم وتتواصل معهم',
        emptyTitle: 'لا يوجد أصدقاء بعد', emptyDesc: 'تابع أشخاصا من صفحة الاستكشاف لتراهم هنا', emptyBtn: 'استكشف المستخدمين',
        chatPlaceholder: 'اكتب رسالة...', unfollow: 'إلغاء المتابعة', chat: 'محادثة',
        removeFriendConfirm: 'إزالة هذا الصديق', friendRemoved: 'تم إزالة الصديق',
        noUsers: 'لا يوجد مستخدمين للمحادثة بعد.'
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    updateLanguage();
    await loadFriends();
    document.getElementById('chatSendBtn')?.addEventListener('click', sendMessage);
    document.getElementById('chatInput')?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
});

document.addEventListener('languageChanged', () => {
    updateLanguage();
    renderFriends();
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeChat(); });

function updateLanguage() {
    const t = translations[currentLanguage];
    ['friendsTitle', 'friendsDesc'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = t[id];
    });
    const chatInput = document.getElementById('chatInput');
    if (chatInput) chatInput.placeholder = t.chatPlaceholder;
}

async function loadFriends() {
    if (globalCurrentUser) {
        try {
            const res = await fetch(`/api/users/${globalCurrentUser.id}/following`);
            if (res.ok) {
                const following = await res.json();
                friendsList = following.map(u => ({
                    id: u.id,
                    name: u.displayName || u.username,
                    username: u.username,
                    avatar: u.avatar,
                    bio: ''
                }));
                saveFriends();
                renderFriends();
                return;
            }
        } catch (e) {}
    }

    const saved = localStorage.getItem('friendsList');
    if (saved) {
        friendsList = JSON.parse(saved);
    }
    renderFriends();
}

function saveFriends() {
    localStorage.setItem('friendsList', JSON.stringify(friendsList));
}

async function unfollowFriend(id) {
    const t = translations[currentLanguage];
    if (!confirm(t.removeFriendConfirm)) return;
    try {
        const res = await fetch(`/api/users/${id}/follow`, { method: 'POST' });
        if (res.ok) {
            friendsList = friendsList.filter(f => f.id !== id);
            saveFriends();
            renderFriends();
            showNotification(t.friendRemoved, 'info');
        }
    } catch (e) { console.error('Unfollow error:', e); }
}

async function openChat(userId, userName) {
    currentChatUser = { id: userId, name: userName };
    const modal = document.getElementById('chatModal');
    document.getElementById('chatTitle').innerHTML = 'Chat with ' + escapeHtml(userName);
    modal.classList.add('active');

    const messagesDiv = document.getElementById('chatMessages');
    messagesDiv.innerHTML = '<div class="loading-comments">Loading messages...</div>';

    try {
        const res = await fetch(`/api/messages/${userId}`);
        const messages = await res.json();
        if (messages.length === 0) {
            messagesDiv.innerHTML = `<div class="chat-message received">Start chatting with ${escapeHtml(userName)}</div>`;
        } else {
            const currentUserId = globalCurrentUser?.id;
            messagesDiv.innerHTML = messages.map(m =>
                `<div class="chat-message ${m.senderId === currentUserId ? 'sent' : 'received'}">${escapeHtml(m.text)}</div>`
            ).join('');
        }
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (e) {
        messagesDiv.innerHTML = '<div class="chat-message received">Error loading messages</div>';
    }

    document.getElementById('chatInput').value = '';
    document.getElementById('chatInput').focus();
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message || !currentChatUser) return;

    const messagesDiv = document.getElementById('chatMessages');
    const currentUserId = globalCurrentUser?.id;

    try {
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ receiverId: currentChatUser.id, text: message })
        });

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message sent';
        msgDiv.textContent = message;
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        input.value = '';
    } catch (e) { console.error('Send message error:', e); }
}

function closeChat() {
    document.getElementById('chatModal')?.classList.remove('active');
    currentChatUser = null;
}

function renderFriends() {
    const container = document.getElementById('friendsList');
    const t = translations[currentLanguage];

    if (!friendsList || friendsList.length === 0) {
        container.innerHTML = `
            <div class="empty-friends">
                <h3>${t.emptyTitle}</h3>
                <p>${t.emptyDesc}</p>
                <button class="btn-primary" onclick="location.href='explore.html'">${t.emptyBtn} →</button>
            </div>`;
        return;
    }

    container.innerHTML = friendsList.map(friend => `
        <div class="friend-card">
            <div class="friend-info">
                <div class="friend-avatar">${friend.name.charAt(0).toUpperCase()}</div>
                <div class="friend-details">
                    <h3>${escapeHtml(friend.name)}</h3>
                    <p>${escapeHtml(friend.bio || friend.username || 'Friend')}</p>
                </div>
            </div>
            <div class="friend-actions">
                <button class="btn-chat" onclick="openChat(${friend.id}, '${escapeHtml(friend.name)}')">💬 ${t.chat}</button>
                <button class="btn-unfollow" onclick="unfollowFriend(${friend.id})">${t.unfollow}</button>
            </div>
        </div>`).join('');
}
