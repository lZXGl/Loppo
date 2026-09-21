// loppo-ui.js
// Native Web Components for Loppo DRY De-duplication

class LoppoHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header class="loppo-header" role="banner">
            <div class="header-container">
                <button class="hamburger-btn" id="mobileMenuBtn" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="sidebarLoppo">
                    <span></span><span></span><span></span>
                </button>
                <a href="index.html" class="brand-logo" aria-label="Loppo Home">
                    <div class="brand-icon">L</div>
                    <span class="brand-title">Loppo</span>
                </a>
                <form class="search-form" id="globalSearchForm" role="search" onsubmit="return false;">
                    <div class="search-input-wrapper">
                        <span class="search-icon-svg" aria-hidden="true">🔍</span>
                        <input type="search" id="globalSearchInput" class="search-field" placeholder="Search posts, topics, discussions..." aria-label="Search posts and topics">
                    </div>
                </form>
                <div class="header-actions">
                    <div class="theme-picker-group" title="Choose Accent Color" role="radiogroup" aria-label="Accent Color Palette">
                        <button type="button" class="accent-dot active" data-color="#0f766e" style="background:#0f766e;" aria-label="Teal Accent"></button>
                        <button type="button" class="accent-dot" data-color="#4f46e5" style="background:#4f46e5;" aria-label="Indigo Accent"></button>
                        <button type="button" class="accent-dot" data-color="#7c3aed" style="background:#7c3aed;" aria-label="Purple Accent"></button>
                        <button type="button" class="accent-dot" data-color="#d97706" style="background:#d97706;" aria-label="Amber Accent"></button>
                        <button type="button" class="accent-dot" data-color="#e11d48" style="background:#e11d48;" aria-label="Rose Accent"></button>
                    </div>
                    <button type="button" class="btn-icon-nav" id="themeToggleBtn" aria-label="Toggle Dark and Light Mode" title="Toggle Theme">
                        <span id="themeIcon">🌓</span>
                    </button>
                    <button type="button" class="btn-pill btn-pill-outline" id="langToggleBtn" aria-label="Change Language">
                        🌐 <span id="langBtnText">العربية</span>
                    </button>
                    <a href="notifications.html" class="btn-icon-nav" aria-label="Notifications" title="Notifications">
                        🔔<span class="badge-count" id="notifBadgeCount" style="display:none;">0</span>
                    </a>
                    <div id="authNavContainer">
                        <a href="login.html" class="btn-pill btn-pill-primary" id="navLoginBtn">Log In</a>
                        <a href="profile.html" class="user-avatar-btn" id="navUserAvatar" style="display:none;" aria-label="My Profile">
                            <img id="navAvatarImg" class="user-avatar-img" src="" alt="User Avatar">
                            <span id="navAvatarFallback" class="user-avatar-initials" style="display:none;">U</span>
                            <span id="navUserName" style="font-weight:600;font-size:0.85rem;">Account</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
        <div class="drawer-backdrop" id="drawerBackdrop" aria-hidden="true"></div>
        `;
        
        // Setup shortcuts for global search
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('globalSearchInput');
                if (searchInput) searchInput.focus();
            }
        });

        // Setup theme toggle
        const themeBtn = this.querySelector('#themeToggleBtn');
        if (themeBtn && !themeBtn.dataset.bound) {
            themeBtn.dataset.bound = 'true';
            themeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (window.toggleLoppoTheme) {
                    window.toggleLoppoTheme();
                }
            });
        }

        // Setup accent palette pickers
        this.querySelectorAll('.accent-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const color = dot.getAttribute('data-color');
                if (window.setLoppoAccent) {
                    window.setLoppoAccent(color);
                }
            });
        });

        // Setup mobile sidebar menu toggle
        const mobileBtn = this.querySelector('#mobileMenuBtn');
        const backdrop = this.querySelector('#drawerBackdrop');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebarLoppo');
                if (sidebar) sidebar.classList.toggle('open');
                if (backdrop) backdrop.classList.toggle('active');
            });
        }
        if (backdrop) {
            backdrop.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebarLoppo');
                if (sidebar) sidebar.classList.remove('open');
                backdrop.classList.remove('active');
            });
        }
    }
}
customElements.define('loppo-header', LoppoHeader);

class LoppoSidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <aside class="loppo-sidebar-left" id="sidebarLoppo" aria-label="Main Navigation">
            <div class="sidebar-scrollable-content">
                <nav class="sidebar-nav-section" aria-labelledby="headingMainMenu">
                    <button type="button" class="nav-section-toggle" id="headingMainMenu" data-toggle="mainMenu" aria-expanded="true">
                        <span class="section-title-text" id="t-mainMenu">MAIN</span>
                        <span class="nav-section-chevron">▼</span>
                    </button>
                    <ul class="nav-links-list" id="mainMenu">
                        <li><a href="index.html" class="sidebar-nav-link" id="link-home"><span class="nav-link-icon">🏠</span><span class="nav-link-text">Home</span></a></li>
                        <li><a href="popular.html" class="sidebar-nav-link" id="link-popular"><span class="nav-link-icon">🔥</span><span class="nav-link-text">Popular</span></a></li>
                        <li><a href="news.html" class="sidebar-nav-link" id="link-news"><span class="nav-link-icon">📰</span><span class="nav-link-text">News</span></a></li>
                        <li><a href="explore.html" class="sidebar-nav-link" id="link-explore"><span class="nav-link-icon">🧭</span><span class="nav-link-text">Explore</span></a></li>
                    </ul>
                </nav>
                <nav class="sidebar-nav-section" aria-labelledby="headingProfileMenu">
                    <button type="button" class="nav-section-toggle" id="headingProfileMenu" data-toggle="profileMenu" aria-expanded="true">
                        <span class="section-title-text" id="t-profileMenu">PROFILE</span>
                        <span class="nav-section-chevron">▼</span>
                    </button>
                    <ul class="nav-links-list" id="profileMenu">
                        <li><a href="profile.html" class="sidebar-nav-link" id="link-profile"><span class="nav-link-icon">👤</span><span class="nav-link-text">Profile</span></a></li>
                        <li><a href="chat.html" class="sidebar-nav-link" id="link-chat"><span class="nav-link-icon">💬</span><span class="nav-link-text">Chat</span></a></li>
                        <li><a href="friends.html" class="sidebar-nav-link" id="link-friends"><span class="nav-link-icon">👥</span><span class="nav-link-text">Friends</span></a></li>
                        <li><a href="settings.html" class="sidebar-nav-link" id="link-settings"><span class="nav-link-icon">⚙️</span><span class="nav-link-text">Settings</span></a></li>
                    </ul>
                </nav>
                <nav class="sidebar-nav-section" aria-labelledby="headingResourcesMenu">
                    <button type="button" class="nav-section-toggle" id="headingResourcesMenu" data-toggle="resourcesMenu" aria-expanded="true">
                        <span class="section-title-text" id="t-resourcesMenu">RESOURCES</span>
                        <span class="nav-section-chevron">▼</span>
                    </button>
                    <ul class="nav-links-list" id="resourcesMenu">
                        <li><a href="about.html" class="sidebar-nav-link"><span class="nav-link-icon">ℹ️</span><span class="nav-link-text">About</span></a></li>
                        <li><a href="blog.html" class="sidebar-nav-link"><span class="nav-link-icon">✍️</span><span class="nav-link-text">Blog</span></a></li>
                        <li><a href="help.html" class="sidebar-nav-link"><span class="nav-link-icon">❓</span><span class="nav-link-text">Help</span></a></li>
                    </ul>
                </nav>
            </div>
            <footer class="sidebar-footer-links">
                <a href="rules.html" class="footer-link-subtle">Community Rules</a>
                <a href="privacy.html" class="footer-link-subtle">Privacy Policy</a>
                <a href="user-agreement.html" class="footer-link-subtle">User Agreement</a>
                <a href="contact.html" class="footer-link-subtle">Contact Us</a>
                <span class="copyright-tag">© 2026 Loppo Inc.</span>
            </footer>
        </aside>
        `;

        // Highlight active link
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const pageName = currentPath.replace('.html', '');
        const activeLink = this.querySelector(`#link-${pageName}`);
        if (activeLink) activeLink.classList.add('active');
    }
}
customElements.define('loppo-sidebar', LoppoSidebar);

class LoppoRightRail extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <aside class="loppo-sidebar-right" aria-label="Community Highlights">
            <div class="sidebar-widget-card" id="userSidebarWidget">
                <div class="user-widget-profile">
                    <img id="sidebarUserAvatar" class="widget-user-avatar" src="/assets/default-avatar.svg" alt="Loppo member profile picture">
                    <div>
                        <h2 class="widget-user-name" id="sidebarUserName">Welcome to Loppo</h2>
                        <span class="widget-user-handle" id="sidebarUserHandle">Join the conversation</span>
                    </div>
                    <div class="widget-stats-grid" id="sidebarUserStats">
                        <div class="stat-item"><span class="stat-val" id="userKarmaScore">0</span><span class="stat-lbl">Karma</span></div>
                        <div class="stat-item"><span class="stat-val" id="userFollowersCount">0</span><span class="stat-lbl">Followers</span></div>
                        <div class="stat-item"><span class="stat-val" id="userPostsCount">0</span><span class="stat-lbl">Posts</span></div>
                    </div>
                    <a href="signup.html" class="btn-pill btn-pill-primary" id="sidebarAuthCta" style="width:100%;">Create Account</a>
                </div>
            </div>
            <div class="sidebar-widget-card">
                <div class="widget-title-row"><h3 class="widget-title">📈 Trending Topics</h3></div>
                <ul class="trending-topics-list" id="trendingTopicsList">
                    <li class="trending-topic-item" data-topic="Technology"><div class="topic-meta-wrapper"><span class="topic-tag">#Technology</span><span class="topic-posts-count">1.4k posts this week</span></div><span class="topic-arrow">→</span></li>
                    <li class="trending-topic-item" data-topic="WebDev"><div class="topic-meta-wrapper"><span class="topic-tag">#WebDev</span><span class="topic-posts-count">980 posts this week</span></div><span class="topic-arrow">→</span></li>
                    <li class="trending-topic-item" data-topic="AI"><div class="topic-meta-wrapper"><span class="topic-tag">#AI</span><span class="topic-posts-count">2.3k posts this week</span></div><span class="topic-arrow">→</span></li>
                    <li class="trending-topic-item" data-topic="Gaming"><div class="topic-meta-wrapper"><span class="topic-tag">#Gaming</span><span class="topic-posts-count">760 posts this week</span></div><span class="topic-arrow">→</span></li>
                </ul>
            </div>
            <div class="sidebar-widget-card sponsored-box">
                <span class="widget-title" style="font-size:0.7rem;margin-bottom:8px;display:block;">Sponsored</span>
                <h4 class="sponsored-heading">Master Full-Stack Web Dev</h4>
                <p class="sponsored-text">Build real-world HTML5, modern CSS, and full-stack JS applications step by step.</p>
                <a href="signup.html" class="btn-pill btn-pill-outline" style="width:100%;font-size:0.8rem;">Explore Academy</a>
            </div>
        </aside>
        `;
    }
}
customElements.define('loppo-right-rail', LoppoRightRail);

class LoppoPostModal extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <section class="create-post-card" aria-label="Create a new post">
            <div class="create-post-top">
                <img id="postAvatarPreview" src="/assets/default-avatar.svg" alt="Active user profile avatar" class="user-post-avatar">
                <div class="post-textarea-wrapper">
                    <textarea id="postInput" class="post-textarea" placeholder="What's happening in your world?" rows="2" aria-label="Write post content"></textarea>
                </div>
            </div>
            <div id="imagePreviewArea" class="composer-preview-area" style="display:none;">
                <img id="imagePreview" class="preview-media-element" src="" alt="Selected image preview">
                <button type="button" class="remove-preview-btn" id="btnRemoveImage" aria-label="Remove image">✕</button>
            </div>
            <div id="videoPreviewArea" class="composer-preview-area" style="display:none;">
                <video id="videoPreview" class="preview-media-element" src="" controls></video>
                <button type="button" class="remove-preview-btn" id="btnRemoveVideo" aria-label="Remove video">✕</button>
            </div>
            <div id="pollCreator" class="composer-poll-box" style="display:none;">
                <input type="text" id="pollQuestion" class="poll-question-input" placeholder="Ask a question for your poll...">
                <div id="pollOptionsContainer" style="display:flex;flex-direction:column;gap:8px;">
                    <div class="poll-option-row"><input type="text" class="poll-option-input pollOptionInput" placeholder="Option 1"></div>
                    <div class="poll-option-row"><input type="text" class="poll-option-input pollOptionInput" placeholder="Option 2"></div>
                </div>
                <button type="button" class="btn-add-option-pill" id="btnAddPollOption">+ Add Option</button>
            </div>
            <div class="create-post-bottom">
                <div class="media-upload-tools">
                    <input type="file" id="imageUpload" accept="image/*,image/gif" style="display:none;">
                    <button type="button" class="btn-media-tool" id="btnTriggerImageUpload">🖼️ <span>Image</span></button>
                    <input type="file" id="videoUpload" accept="video/*" style="display:none;">
                    <button type="button" class="btn-media-tool" id="btnTriggerVideoUpload">🎥 <span>Video</span></button>
                    <button type="button" class="btn-media-tool" id="btnTogglePoll">📊 <span>Poll</span></button>
                </div>
                <button type="button" class="btn-pill btn-pill-primary" id="btnSubmitPost">🚀 <span>Publish</span></button>
            </div>
        </section>
        `;
    }
}
customElements.define('loppo-post-modal', LoppoPostModal);

// Global Toast helper
window.showToast = function(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'loppo-toast-container';
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};
