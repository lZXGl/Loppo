const translations = {
    en: {
        adminTitle: 'Admin Dashboard',
        statUsers: 'Total Users', statPosts: 'Active Posts',
        tableTitle: 'All Users', tableTitlePosts: 'All Posts',
        thUser: 'User', thEmail: 'Email', thRole: 'Role', thAction: 'Actions',
        thAuthor: 'Author', thText: 'Text', thTime: 'Time',
        deleteUser: 'Delete', deletePost: 'Delete',
        userDeleted: 'User deleted', postDeleted: 'Post deleted',
        confirmDelete: 'Are you sure?',
        loading: 'Loading...', noUsers: 'No users found', noPosts: 'No posts found',
        manageUsers: 'Manage Users', managePosts: 'Manage Posts'
    },
    ar: {
        adminTitle: 'لوحة تحكم المشرف',
        statUsers: 'إجمالي المستخدمين', statPosts: 'المنشورات النشطة',
        tableTitle: 'جميع المستخدمين', tableTitlePosts: 'جميع المنشورات',
        thUser: 'المستخدم', thEmail: 'البريد', thRole: 'الدور', thAction: 'الإجراءات',
        thAuthor: 'الكاتب', thText: 'النص', thTime: 'الوقت',
        deleteUser: 'حذف', deletePost: 'حذف',
        userDeleted: 'تم حذف المستخدم', postDeleted: 'تم حذف المنشور',
        confirmDelete: 'هل أنت متأكد؟',
        loading: 'جاري التحميل...', noUsers: 'لا يوجد مستخدمين', noPosts: 'لا توجد منشورات',
        manageUsers: 'إدارة المستخدمين', managePosts: 'إدارة المنشورات'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    loadStats();
    loadUsers();
    loadPosts();
});

document.addEventListener('languageChanged', () => {
    updateLanguage();
});

function updateLanguage() {
    const t = translations[currentLanguage];
    const ids = ['adminTitle', 'statUsers', 'statPosts', 'tableTitle', 'tableTitlePosts',
        'thUser', 'thEmail', 'thRole', 'thAction', 'thAuthor', 'thText', 'thTime'];
    const keys = ['adminTitle', 'statUsers', 'statPosts', 'tableTitle', 'tableTitlePosts',
        'thUser', 'thEmail', 'thRole', 'thAction', 'thAuthor', 'thText', 'thTime'];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = t[keys[i]];
    });
}

async function loadStats() {
    try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
            const data = await res.json();
            document.getElementById('userCount').textContent = data.userCount || 0;
            document.getElementById('postCount').textContent = data.postCount || 0;
        }
    } catch (e) { console.error('Error loading stats:', e); }
}

async function loadUsers() {
    try {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
            const users = await res.json();
            const tbody = document.querySelector('#usersTable tbody');
            const t = translations[currentLanguage];
            if (!users.length) { tbody.innerHTML = `<tr><td colspan="4">${t.noUsers}</td></tr>`; return; }
            tbody.innerHTML = users.map(u => `
                <tr>
                    <td>${escapeHtml(u.displayName || u.username)}</td>
                    <td>${escapeHtml(u.email)}</td>
                    <td>${u.isAdmin ? 'Admin' : 'User'}</td>
                    <td><button class="btn-danger" onclick="deleteUser(${u.id})">${t.deleteUser}</button></td>
                </tr>`).join('');
        }
    } catch (e) { console.error('Error loading users:', e); }
}

async function loadPosts() {
    try {
        const res = await fetch('/api/posts/all');
        if (res.ok) {
            const posts = await res.json();
            const tbody = document.querySelector('#postsTable tbody');
            const t = translations[currentLanguage];
            if (!posts.length) { tbody.innerHTML = `<tr><td colspan="4">${t.noPosts}</td></tr>`; return; }
            tbody.innerHTML = posts.map(p => `
                <tr>
                    <td>${escapeHtml(p.author)}</td>
                    <td>${escapeHtml((p.text || '').substring(0, 50))}${(p.text || '').length > 50 ? '...' : ''}</td>
                    <td>${p.time || ''}</td>
                    <td><button class="btn-danger" onclick="deletePost(${p.id})">${t.deletePost}</button></td>
                </tr>`).join('');
        }
    } catch (e) { console.error('Error loading posts:', e); }
}

async function deleteUser(id) {
    const t = translations[currentLanguage];
    if (!confirm(t.confirmDelete)) return;
    try {
        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showNotification(t.userDeleted, 'success');
            loadUsers();
            loadStats();
        }
    } catch (e) { console.error('Error deleting user:', e); }
}

async function deletePost(id) {
    const t = translations[currentLanguage];
    if (!confirm(t.confirmDelete)) return;
    try {
        const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showNotification(t.postDeleted, 'success');
            loadPosts();
            loadStats();
        }
    } catch (e) { console.error('Error deleting post:', e); }
}
