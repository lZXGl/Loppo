async function init() {
    if (!globalCurrentUser) {
        try {
            const res = await fetch('/api/user');
            if (!res.ok) { window.location.href = 'login.html'; return; }
        } catch (e) { window.location.href = 'login.html'; return; }
    }
    updateProfileUI();
    loadUserPosts();
}

function updateProfileUI() {
    const user = globalCurrentUser;
    if (!user) return;

    const elements = {
        'displayName': user.displayName || user.username || 'User',
        'userBio': user.bio || 'No bio yet.',
        'sideBio': user.bio || 'This is your public profile.',
        'userKarma': user.karma || 0
    };
    Object.entries(elements).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    });

    const avatar = document.getElementById('profileAvatar');
    if (avatar && user.avatar) {
        avatar.src = user.avatar;
        avatar.style.display = 'block';
    }

    const cover = document.getElementById('coverDisplay');
    if (cover && user.coverPhoto) {
        cover.style.backgroundImage = `url(${user.coverPhoto})`;
        cover.style.backgroundSize = 'cover';
        cover.style.backgroundPosition = 'center';
    }

    const postPreview = document.getElementById('post-avatar-preview');
    if (postPreview && user.avatar) postPreview.src = user.avatar;
}

async function updateProfile(data) {
    try {
        const res = await fetch('/api/user/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            showNotification('Profile updated successfully', 'success');
            if (typeof loadUserContext === 'function') {
                await loadUserContext();
                updateProfileUI();
            }
        } else {
            showNotification('Failed to update profile', 'error');
        }
    } catch (err) { showNotification('Network error', 'error'); }
}

async function uploadAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => { await updateProfile({ avatar: e.target.result }); };
        reader.readAsDataURL(file);
    }
}

async function uploadCover(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => { await updateProfile({ coverPhoto: e.target.result }); };
        reader.readAsDataURL(file);
    }
}

async function editBio() {
    const currentBio = document.getElementById('userBio').textContent;
    const newBio = prompt('Enter your new bio:', currentBio);
    if (newBio !== null) {
        await updateProfile({ bio: newBio });
    }
}

async function loadUserPosts() {
    const container = document.getElementById('userPostsContainer');
    if (!container) return;

    try {
        const res = await fetch('/api/posts');
        const allPosts = await res.json();
        const user = globalCurrentUser;
        if (!user) return;

        const myPosts = allPosts.filter(p => p.userId === user.id);
        if (myPosts.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:40px;">No posts yet. Share something on the home feed!</p>';
            return;
        }

        container.innerHTML = myPosts.map(p => {
            let mediaHtml = '';
            if (p.image) mediaHtml = `<img src="${escapeHtml(p.image)}" class="post-image" style="max-width:100%;border-radius:12px;margin-top:10px;cursor:pointer;" onclick="viewFullMedia('image', '${escapeHtml(p.image)}')">`;
            else if (p.video) mediaHtml = `<video src="${escapeHtml(p.video)}" class="post-video" controls style="max-width:100%;border-radius:12px;margin-top:10px;"></video>`;

            return `
                <div class="post" style="background:var(--nav-bg);border:1px solid var(--border);border-radius:12px;padding:15px;margin-bottom:15px;">
                    <div class="post-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                        <div style="font-weight:700;color:var(--text);">${escapeHtml(p.author)}</div>
                        <div style="font-size:0.75em;color:var(--text-muted);">${p.time || ''}</div>
                    </div>
                    <div class="post-content">
                        <p style="margin:0;color:var(--text);">${escapeHtml(p.text)}</p>
                        ${mediaHtml}
                    </div>
                    <div class="post-actions" style="margin-top:12px;display:flex;gap:15px;color:var(--text-muted);font-size:0.9em;">
                        <span>Likes: ${p.likes || 0}</span>
                        <span>Comments: ${p.commentCount || 0}</span>
                    </div>
                </div>`;
        }).join('');
    } catch (err) {
        console.error('Error loading user posts:', err);
        container.innerHTML = 'Error loading posts.';
    }
}

function viewFullMedia(type, src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    if (modal && modalImg) {
        modalImg.src = src;
        modal.classList.add('active');
    }
}

document.addEventListener('userContextLoaded', () => init());
if (typeof globalCurrentUser !== 'undefined' && globalCurrentUser !== null) init();
