let currentPost = null;
let reportedPosts = JSON.parse(localStorage.getItem('reportedPosts') || '[]');

const urlParams = new URLSearchParams(window.location.search);
const postId = parseInt(urlParams.get('id'));

const translations = {
    en: {
        loading: 'Loading...', postNotFound: 'Post not found', goBackHome: 'Go back home',
        writeComment: 'Write a comment...', postComment: 'Post Comment',
        noComments: 'No comments yet. Be the first to comment',
        comments: 'Comments', likes: 'Likes',
        reportPost: 'Report Post', reportTitle: 'Report Post', reportPlaceholder: 'Describe the issue...',
        submit: 'Submit Report', edit: 'Edit', delete: 'Delete',
        editPost: 'Edit your post:', postUpdated: 'Post updated',
        deleteConfirm: 'Delete this post?', postDeleted: 'Post deleted',
        loginRequired: 'Login required'
    },
    ar: {
        loading: 'جاري التحميل...', postNotFound: 'المنشور غير موجود', goBackHome: 'العودة إلى الرئيسية',
        writeComment: 'اكتب تعليقاً...', postComment: 'نشر تعليق',
        noComments: 'لا توجد تعليقات بعد. كن أول من يعلق',
        comments: 'تعليقات', likes: 'إعجاب',
        reportPost: 'الإبلاغ عن المنشور', reportTitle: 'الإبلاغ عن منشور', reportPlaceholder: 'صف المشكلة...',
        submit: 'إرسال البلاغ', edit: 'تعديل', delete: 'حذف',
        editPost: 'تعديل المنشور:', postUpdated: 'تم تحديث المنشور',
        deleteConfirm: 'حذف هذا المنشور؟', postDeleted: 'تم حذف المنشور',
        loginRequired: 'تسجيل الدخول مطلوب'
    }
};

function showToast(message, type) {
    const el = document.querySelector('.notification-toast');
    if (el) el.remove();
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    const colors = { success: '#4CAF50', error: '#f44336', info: '#2196F3' };
    toast.style.background = colors[type] || colors.success;
    toast.style.color = 'white';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function updateLanguage() {
    const t = translations[currentLanguage];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) el.textContent = t[key];
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    loadPost();
    document.getElementById('submitReportPostBtn')?.addEventListener('click', submitPostReport);
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.post-menu')) {
        document.querySelectorAll('.menu-dropdown.show').forEach(menu => menu.classList.remove('show'));
    }
});

document.addEventListener('languageChanged', () => {
    updateLanguage();
    if (currentPost) renderPost();
});

async function loadPost() {
    try {
        const response = await fetch('/api/posts');
        const allPosts = await response.json();
        currentPost = allPosts.find(p => p.id === postId);
        if (currentPost) {
            const commentsRes = await fetch(`/api/posts/${postId}/comments`);
            currentPost.comments = await commentsRes.json();
        }
        renderPost();
    } catch (err) {
        console.error('Error loading post:', err);
        document.getElementById('postContainer').innerHTML = `<div style="text-align:center;padding:40px;">${translations[currentLanguage].postNotFound} <a href="index.html">${translations[currentLanguage].goBackHome}</a></div>`;
    }
}

function renderPost() {
    const container = document.getElementById('postContainer');
    const t = translations[currentLanguage];

    if (!currentPost) {
        container.innerHTML = `<div style="text-align:center;padding:40px;">${t.postNotFound} <a href="index.html">${t.goBackHome}</a></div>`;
        return;
    }

    const user = globalCurrentUser;
    const currentUserName = user ? (user.displayName || user.username) : null;
    const userLiked = currentUserName && Array.isArray(currentPost.likedBy) && currentPost.likedBy.includes(currentUserName);
    const isCurrentUser = user && (currentPost.userId === user.id || currentPost.author === currentUserName);

    // Update Page Title and Heading
    const snippet = currentPost.text ? currentPost.text.slice(0, 60) : 'Discussion Thread';
    document.title = `${snippet} - Loppo`;

    let mediaHtml = '';
    if (currentPost.image) mediaHtml = `<img src="${escapeHtml(currentPost.image)}" class="post-image" alt="Discussion image shared by ${escapeHtml(currentPost.author)}">`;
    else if (currentPost.video) mediaHtml = `<video src="${escapeHtml(currentPost.video)}" class="post-video" controls></video>`;

    const comments = currentPost.comments || [];
    const commentsHtml = comments.length === 0
        ? `<div class="empty-comments">${t.noComments}</div>`
        : comments.map(c => `
            <div class="comment" data-comment-id="${c.id}">
                <div class="comment-header">
                    <span class="comment-author">${escapeHtml(c.author)}</span>
                    <span class="comment-time">${c.time}</span>
                </div>
                <div class="comment-text">${escapeHtml(c.text)}</div>
            </div>`).join('');

    let menuHtml = isCurrentUser
        ? `<div class="post-menu"><button class="menu-btn" onclick="toggleMenu(this)">•••</button>
            <div class="menu-dropdown">
                <button onclick="editPost()">${t.edit}</button>
                <button onclick="deletePost()" class="delete-btn">${t.delete}</button>
            </div></div>`
        : `<div class="post-menu"><button class="menu-btn" onclick="toggleMenu(this)">•••</button>
            <div class="menu-dropdown">
                <button onclick="openReportPostModal()" class="report-post-btn">${t.reportPost}</button>
            </div></div>`;

    container.innerHTML = `
        <h1 class="page-main-heading">${escapeHtml(snippet)}</h1>
        <div class="post-header">
            <div class="post-user-info">
                <div class="post-avatar">${(currentPost.author || 'U').charAt(0).toUpperCase()}</div>
                <div>
                    <div class="post-author">${escapeHtml(currentPost.author)}</div>
                    <div class="post-time">${currentPost.time}</div>
                </div>
            </div>
            ${menuHtml}
        </div>
        <div class="post-text">${escapeHtml(currentPost.text)}</div>
        ${mediaHtml}
        <div class="post-stats">
            <span id="likeBtn" class="like-btn ${userLiked ? 'liked' : ''}" onclick="toggleLike()">
                <span id="likeCount">${currentPost.likes || 0}</span> ${t.likes}
            </span>
            <span>${comments.length} ${t.comments}</span>
            <button type="button" class="btn-pill btn-pill-outline" style="margin-left:auto;padding:4px 12px;font-size:0.8rem;" onclick="if(typeof openShareModal==='function'){openShareModal({title:'Loppo Discussion', text:'${escapeHtml(snippet)}', url:window.location.href});}else{navigator.clipboard.writeText(window.location.href);showToast('Link copied!','success');}">🔗 Share</button>
        </div>
        <div class="comments-section">
            <h3>${t.comments} (${comments.length})</h3>
            <div id="commentsList">${commentsHtml}</div>
            <div class="add-comment">
                <textarea id="newComment" rows="3" placeholder="${t.writeComment}"></textarea>
                <button class="btn-primary" onclick="addComment()">${t.postComment}</button>
            </div>
        </div>`;
}

async function toggleLike() {
    if (!currentPost) return;
    try {
        const res = await fetch(`/api/posts/${currentPost.id}/like`, { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            currentPost.likes = data.likes;
            const likeBtn = document.getElementById('likeBtn');
            const likeCount = document.getElementById('likeCount');
            if (likeCount) likeCount.textContent = data.likes;
            if (likeBtn) likeBtn.classList.toggle('liked', data.userLiked);
        } else {
            showToast(translations[currentLanguage].loginRequired, 'error');
        }
    } catch (err) { console.error('Error toggling like:', err); }
}

async function editPost() {
    const t = translations[currentLanguage];
    const newText = prompt(t.editPost, currentPost.text || '');
    if (newText && newText.trim()) {
        try {
            const res = await fetch(`/api/posts/${currentPost.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText.trim() })
            });
            if (res.ok) {
                currentPost.text = newText.trim();
                renderPost();
                showToast(t.postUpdated, 'success');
            }
        } catch (err) { console.error('Error editing post:', err); }
    }
}

async function deletePost() {
    const t = translations[currentLanguage];
    if (!confirm(t.deleteConfirm)) return;
    try {
        const res = await fetch(`/api/posts/${currentPost.id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast(t.postDeleted, 'success');
            setTimeout(() => window.location.href = 'index.html', 500);
        }
    } catch (err) { console.error('Error deleting post:', err); }
}

function toggleMenu(btn) {
    const dropdown = btn.nextElementSibling;
    document.querySelectorAll('.menu-dropdown.show').forEach(menu => {
        if (menu !== dropdown) menu.classList.remove('show');
    });
    dropdown.classList.toggle('show');
}

async function addComment() {
    const textarea = document.getElementById('newComment');
    const commentText = textarea.value.trim();
    if (!commentText) return;
    try {
        const res = await fetch(`/api/posts/${currentPost.id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: commentText })
        });
        if (res.ok) {
            textarea.value = '';
            const commentsRes = await fetch(`/api/posts/${currentPost.id}/comments`);
            currentPost.comments = await commentsRes.json();
            renderPost();
        } else {
            showToast(translations[currentLanguage].loginRequired, 'error');
        }
    } catch (err) { console.error('Error adding comment:', err); }
}

function openReportPostModal() {
    document.getElementById('reportPostModal')?.classList.add('active');
    document.getElementById('modalOverlay')?.classList.add('active');
}

function closeReportPostModal() {
    document.getElementById('reportPostModal')?.classList.remove('active');
    document.getElementById('modalOverlay')?.classList.remove('active');
}

function submitPostReport() {
    if (!currentPost) return;
    const reason = document.getElementById('reportPostReason')?.value.trim();
    if (!reportedPosts.some(r => r.id === currentPost.id)) {
        reportedPosts.push({
            id: currentPost.id, title: (currentPost.text || '').substring(0, 50),
            author: currentPost.author, reason: reason || 'No reason provided',
            time: new Date().toLocaleString()
        });
        localStorage.setItem('reportedPosts', JSON.stringify(reportedPosts));
        showToast('Post reported. Our team will review it.', 'success');
    } else {
        showToast('You have already reported this post', 'info');
    }
    closeReportPostModal();
}
