let currentFilter = 'all';

const translations = {
    en: {
        notifTitle: 'Notifications', markAllBtn: 'Mark all as read',
        emptyTitle: 'No notifications', emptyDesc: 'When you get notifications, they will appear here.',
        statusNew: 'New', statusSeen: 'Seen',
        filterAll: 'All Notifications', filterUnread: 'Unread', filterRead: 'Read',
        allRead: 'All notifications are already read', markedRead: 'All notifications marked as read',
        markedOne: 'Notification marked as read'
    },
    ar: {
        notifTitle: 'الإشعارات', markAllBtn: 'تحديد الكل كمقروء',
        emptyTitle: 'لا توجد إشعارات', emptyDesc: 'عندما تتلقى إشعارات، ستظهر هنا.',
        statusNew: 'جديد', statusSeen: 'مقروء',
        filterAll: 'جميع الإشعارات', filterUnread: 'غير مقروء', filterRead: 'مقروء',
        allRead: 'جميع الإشعارات مقروءة بالفعل', markedRead: 'تم تحديد الكل كمقروء',
        markedOne: 'تم تحديد الإشعار كمقروء'
    }
};

let notifications = [];

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    fetchNotifications();
});

document.addEventListener('languageChanged', () => {
    updateLanguage();
    renderNotifs();
});

document.addEventListener('userContextLoaded', () => {
    fetchNotifications();
});

function updateLanguage() {
    const t = translations[currentLanguage];
    const ids = ['notifTitle', 'markAllBtn', 'emptyTitle'];
    const keys = ['notifTitle', 'markAllBtn', 'emptyTitle'];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = t[keys[i]];
    });
    const emptyDesc = document.querySelector('#notifEmpty p');
    if (emptyDesc) emptyDesc.textContent = t.emptyDesc;
    const filterBtns = document.querySelectorAll('.sidebar-list li');
    if (filterBtns[0]) filterBtns[0].textContent = t.filterAll;
    if (filterBtns[1]) filterBtns[1].textContent = t.filterUnread;
    if (filterBtns[2]) filterBtns[2].textContent = t.filterRead;
}

async function fetchNotifications() {
    try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
            notifications = await res.json();
            renderNotifs();
        }
    } catch (e) {
        console.log('Error fetching notifications', e);
    }
}

function filterNotifications(notifs) {
    if (currentFilter === 'unread') return notifs.filter(n => !n.isRead);
    if (currentFilter === 'read') return notifs.filter(n => n.isRead);
    return notifs;
}

function renderNotifs() {
    const filtered = filterNotifications(notifications);
    const list = document.getElementById('notifList');
    const empty = document.getElementById('notifEmpty');
    const t = translations[currentLanguage];

    list.innerHTML = '';
    if (filtered.length === 0) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';

    filtered.forEach(n => {
        const li = document.createElement('li');
        li.className = 'notif-item ' + (n.isRead ? '' : 'unread');
        li.tabIndex = 0;
        li.setAttribute('role', 'button');
        li.innerHTML = `
            <div class="notif-content">
                <div class="notif-text">${escapeHtml(n.message)}</div>
                <span class="notif-time">${escapeHtml(n.createdAt || '')}</span>
            </div>
            <div class="notif-status ${n.isRead ? 'seen' : ''}">${n.isRead ? t.statusSeen : t.statusNew}</div>`;

        const markOne = async () => {
            if (n.isRead) return;
            try {
                await fetch(`/api/notifications/${n.id}/read`, { method: 'POST' });
                n.isRead = 1;
                renderNotifs();
                showNotification(t.markedOne, 'info');
            } catch (e) {}
        };
        li.addEventListener('click', markOne);
        li.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); markOne(); } });
        list.appendChild(li);
    });
}

async function markAllAsRead() {
    const t = translations[currentLanguage];
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) { showNotification(t.allRead, 'info'); return; }
    try {
        await fetch('/api/notifications/read-all', { method: 'POST' });
        notifications.forEach(n => n.isRead = 1);
        renderNotifs();
        showNotification(t.markedRead, 'success');
    } catch (e) {}
}

function filterType(type) {
    currentFilter = type;
    renderNotifs();
}
