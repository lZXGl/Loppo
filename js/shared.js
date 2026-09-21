/**
 * ============================================================================
 * LOPPO - SHARED UTILITIES & STATE MANAGEMENT (shared.js)
 * Clean Modular Architecture, Theme Engine, i18n, User Context & Navigation
 * ============================================================================
 */

// Global State
let currentLanguage = localStorage.getItem('appLanguage') || 'en';
let globalCurrentUser = null;

// Translation Dictionary for Shared Components
const sharedTranslations = {
    en: {
        mainMenu: 'MAIN',
        profileMenu: 'PROFILE',
        resourcesMenu: 'RESOURCES',
        home: 'Home',
        popular: 'Popular',
        news: 'News',
        explore: 'Explore',
        profile: 'Profile',
        chat: 'Chat',
        friends: 'Friends',
        settings: 'Settings',
        about: 'About',
        blog: 'Blog',
        help: 'Help',
        rules: 'Community Rules',
        privacy: 'Privacy Policy',
        agreement: 'User Agreement',
        contact: 'Contact Us',
        langBtn: 'العربية',
        loginPrompt: 'Log In',
        welcomeTitle: 'Welcome to Loppo',
        welcomeSub: 'Join the conversation',
        createAccount: 'Create Account',
        viewProfile: 'View Profile',
        karma: 'Karma',
        followers: 'Followers',
        posts: 'Posts',
        mbHome: 'Home',
        mbExplore: 'Explore',
        mbNotif: 'Alerts',
        mbProfile: 'Profile'
    },
    ar: {
        mainMenu: 'الرئيسية',
        profileMenu: 'الملف الشخصي',
        resourcesMenu: 'المصادر',
        home: 'الرئيسية',
        popular: 'الأكثر شهرة',
        news: 'الأخبار',
        explore: 'استكشاف',
        profile: 'الملف الشخصي',
        chat: 'الدردشة',
        friends: 'الأصدقاء',
        settings: 'الإعدادات',
        about: 'معلومات عنا',
        blog: 'المدونة',
        help: 'المساعدة',
        rules: 'قواعد المجتمع',
        privacy: 'سياسة الخصوصية',
        agreement: 'اتفاقية المستخدم',
        contact: 'اتصل بنا',
        langBtn: 'English',
        loginPrompt: 'تسجيل الدخول',
        welcomeTitle: 'مرحباً بك في لوبو',
        welcomeSub: 'شارك في النقاشات وتواصل مع المجتمع',
        createAccount: 'إنشاء حساب جديد',
        viewProfile: 'عرض الملف الشخصي',
        karma: 'نقاط الكارما',
        followers: 'المتابعون',
        posts: 'المنشورات',
        mbHome: 'الرئيسية',
        mbExplore: 'استكشاف',
        mbNotif: 'التنبيهات',
        mbProfile: 'حسابي'
    }
};

/**
 * Safely escape HTML to prevent XSS injection
 * @param {string} str - Raw text string
 * @returns {string} - Escaped safe HTML
 */
function escapeHtml(str) {
    if (!str && str !== 0) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Display a modern toast notification
 * @param {string} message - Notification text
 * @param {'success'|'error'|'info'} type - Toast type
 */
function showNotification(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'loppo-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `loppo-notification ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span class="notif-icon">${icon}</span><span class="notif-text">${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 250);
    }, 3500);
}

/**
 * Converts a hex color string to RGB comma-separated string
 * @param {string} hex - e.g. "#0f766e"
 * @returns {string} - e.g. "15, 118, 110"
 */
function hexToRgb(hex) {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

/**
 * Apply Accent Color to CSS variables and localStorage
 * @param {string} colorHex - Hex color code
 */
function setAccentColor(colorHex) {
    localStorage.setItem('accentColor', colorHex);
    document.documentElement.style.setProperty('--accent-color', colorHex);
    document.documentElement.style.setProperty('--accent-color-rgb', hexToRgb(colorHex));
    
    // Update active dot indicators
    document.querySelectorAll('.accent-dot').forEach(dot => {
        if (dot.dataset.color === colorHex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * Load and apply saved Accent Color
 */
function loadAccentColor() {
    const saved = localStorage.getItem('accentColor') || '#0f766e';
    setAccentColor(saved);
}

/**
 * Toggle Dark and Light theme
 */
function toggleTheme() {
    if (window.toggleLoppoTheme) {
        window.toggleLoppoTheme();
    } else {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('loppoTheme', newTheme);
    }
}

/**
 * Load and apply saved theme
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('loppoTheme') || localStorage.getItem('theme') || 'dark';
    if (window.setLoppoTheme) {
        window.setLoppoTheme(savedTheme);
    }
}

/**
 * Toggle Language between English and Arabic (RTL support)
 */
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    localStorage.setItem('appLanguage', currentLanguage);
    applyLanguageSettings();
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: currentLanguage }));
    showNotification(currentLanguage === 'ar' ? 'تم تحويل اللغة إلى العربية' : 'Language switched to English', 'success');
}

/**
 * Apply Language Direction and Shared UI Translations
 */
function applyLanguageSettings() {
    const isAr = currentLanguage === 'ar';
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLanguage);

    const t = sharedTranslations[currentLanguage] || sharedTranslations.en;
    
    const langBtnText = document.getElementById('langBtnText');
    if (langBtnText) langBtnText.textContent = t.langBtn;

    // Sidebar section headers
    const sectionIds = ['mainMenu', 'profileMenu', 'resourcesMenu'];
    sectionIds.forEach(secId => {
        const el = document.getElementById(`t-${secId}`);
        if (el) el.textContent = t[secId];
    });

    // Sidebar navigation links
    const linkKeys = ['home', 'popular', 'news', 'explore', 'profile', 'chat', 'friends', 'settings', 'about', 'blog', 'help', 'rules', 'privacy', 'agreement', 'contact', 'karma', 'followers', 'posts', 'mbHome', 'mbExplore', 'mbNotif', 'mbProfile'];
    linkKeys.forEach(k => {
        const el = document.getElementById(`t-${k}`);
        if (el) el.textContent = t[k];
    });
}

/**
 * Compute user avatar initials fallback
 * @param {string} name - User's display name or username
 * @returns {string} - 1-2 character initials
 */
function getInitials(name) {
    if (!name) return 'U';
    return name.trim().split(/\s+/).map(w => w[0].toUpperCase()).slice(0, 2).join('');
}

/**
 * Fetch and load authenticated user context from /api/user
 */
async function loadUserContext() {
    const navLoginBtn = document.getElementById('navLoginBtn');
    const navUserAvatar = document.getElementById('navUserAvatar');
    const navAvatarImg = document.getElementById('navAvatarImg');
    const navAvatarFallback = document.getElementById('navAvatarFallback');
    const navUserName = document.getElementById('navUserName');
    const postAvatarPreview = document.getElementById('postAvatarPreview');

    // Sidebar widget elements
    const sidebarUserName = document.getElementById('sidebarUserName');
    const sidebarUserHandle = document.getElementById('sidebarUserHandle');
    const sidebarUserAvatar = document.getElementById('sidebarUserAvatar');
    const sidebarAuthCta = document.getElementById('sidebarAuthCta');
    const userKarmaScore = document.getElementById('userKarmaScore');
    const userFollowersCount = document.getElementById('userFollowersCount');
    const userPostsCount = document.getElementById('userPostsCount');

    try {
        const response = await fetch('/api/user');
        if (response.ok) {
            const user = await response.json();
            globalCurrentUser = user;
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            const displayName = user.displayName || user.username || 'Loppo User';
            const handle = user.username ? `@${user.username}` : user.email || '';

            // Header state
            if (navLoginBtn) navLoginBtn.style.display = 'none';
            if (navUserAvatar) navUserAvatar.style.display = 'inline-flex';
            if (navUserName) navUserName.textContent = displayName;

            if (user.avatar) {
                if (navAvatarImg) { navAvatarImg.src = user.avatar; navAvatarImg.style.display = 'block'; }
                if (navAvatarFallback) navAvatarFallback.style.display = 'none';
                if (postAvatarPreview) postAvatarPreview.src = user.avatar;
                if (sidebarUserAvatar) sidebarUserAvatar.src = user.avatar;
            } else {
                if (navAvatarImg) navAvatarImg.style.display = 'none';
                if (navAvatarFallback) {
                    navAvatarFallback.textContent = getInitials(displayName);
                    navAvatarFallback.style.display = 'flex';
                }
            }

            // Right Sidebar Widget
            if (sidebarUserName) sidebarUserName.textContent = displayName;
            if (sidebarUserHandle) sidebarUserHandle.textContent = handle;
            if (userKarmaScore) userKarmaScore.textContent = user.karma || 0;
            if (sidebarAuthCta) {
                sidebarAuthCta.textContent = sharedTranslations[currentLanguage].viewProfile || 'View Profile';
                sidebarAuthCta.href = 'profile.html';
            }

            // Fetch live follower count if available
            try {
                const statsRes = await fetch('/api/profile/stats');
                if (statsRes.ok) {
                    const stats = await statsRes.json();
                    if (userFollowersCount) userFollowersCount.textContent = stats.followers || 0;
                    if (userPostsCount) userPostsCount.textContent = stats.posts || 0;
                }
            } catch (e) {}

        } else {
            // Logged out state
            globalCurrentUser = null;
            localStorage.removeItem('loggedInUser');
            if (navLoginBtn) navLoginBtn.style.display = 'inline-flex';
            if (navUserAvatar) navUserAvatar.style.display = 'none';
        }
    } catch (e) {
        console.warn('User session check offline or unauthenticated');
    }

    document.dispatchEvent(new CustomEvent('userContextLoaded', { detail: globalCurrentUser }));
}

/**
 * Setup Global Event Listeners (Drawer, Accent Picker, Theme, Search)
 */
function setupSharedEventListeners() {
    // Mobile Drawer navigation
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebarLoppo');
    const backdrop = document.getElementById('drawerBackdrop');

    if (mobileMenuBtn && sidebar && backdrop) {
        const toggleDrawer = () => {
            const isOpen = sidebar.classList.toggle('open');
            backdrop.classList.toggle('active', isOpen);
            mobileMenuBtn.classList.toggle('active', isOpen);
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        };

        mobileMenuBtn.addEventListener('click', toggleDrawer);
        backdrop.addEventListener('click', toggleDrawer);
    }

    // Sidebar collapsible section toggles
    document.querySelectorAll('.nav-section-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!isExpanded));
            btn.classList.toggle('collapsed', isExpanded);
        });
    });

    // Theme Toggle
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn && !themeToggleBtn.dataset.bound) {
        themeToggleBtn.dataset.bound = 'true';
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
        });
    }

    // Language Toggle
    const langToggleBtn = document.getElementById('langToggleBtn');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', toggleLanguage);
    }

    // Accent Color Pickers
    document.querySelectorAll('.accent-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const color = dot.dataset.color;
            if (color) setAccentColor(color);
        });
    });

    // Global Search Form with Live Suggestions
    initGlobalSearch();

    // Trending topic items click handler
    document.querySelectorAll('.trending-topic-item').forEach(item => {
        item.addEventListener('click', () => {
            const topic = item.dataset.topic;
            if (topic) window.location.href = `popular.html?topic=${encodeURIComponent(topic)}`;
        });
    });

    // Highlight active sidebar navigation link based on current page (supports clean URLs and .html)
    let currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (!currentPath.endsWith('.html') && currentPath !== '') currentPath += '.html';
    if (currentPath === '') currentPath = 'index.html';

    document.querySelectorAll('.sidebar-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || href === currentPath.replace('.html', '')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Initialize Back-To-Top button
    initBackToTop();

    // Initialize Keyboard Shortcuts
    initKeyboardShortcuts();
}

/**
 * Global Search with Instant Suggestions Dropdown
 */
function initGlobalSearch() {
    const searchForm = document.getElementById('globalSearchForm');
    const searchInput = document.getElementById('globalSearchInput');
    if (!searchForm || !searchInput) return;

    // Create suggestions container if not exists
    let dropdown = document.getElementById('searchSuggestionsDropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.id = 'searchSuggestionsDropdown';
        dropdown.className = 'search-suggestions-dropdown';
        searchForm.style.position = 'relative';
        searchForm.appendChild(dropdown);
    }

    const popularSuggestions = [
        { label: '🔥 Trending: Web Standards 2026', query: 'web standards', type: 'topic' },
        { label: '🤖 Topic: Artificial Intelligence', query: 'ai', type: 'topic' },
        { label: '💻 Topic: Frontend & JavaScript', query: 'javascript', type: 'topic' },
        { label: '🛡️ Topic: Security & Privacy', query: 'security', type: 'topic' },
        { label: '🚀 Topic: SQLite & Backends', query: 'backend', type: 'topic' }
    ];

    const renderSuggestions = (query) => {
        const q = query.trim().toLowerCase();
        if (!q) {
            dropdown.classList.remove('active');
            return;
        }

        const filtered = popularSuggestions.filter(s => s.label.toLowerCase().includes(q) || s.query.includes(q));

        let html = `
            <div class="search-suggestion-group">
                <div class="search-suggestion-title">Quick Search</div>
                <div class="search-suggestion-item" data-query="${escapeHtml(query)}">
                    <span class="item-icon">🔍</span>
                    <span>Search for "<strong>${escapeHtml(query)}</strong>"</span>
                </div>
            </div>`;

        if (filtered.length > 0) {
            html += `
                <div class="search-suggestion-group">
                    <div class="search-suggestion-title">Suggested Topics</div>
                    ${filtered.map(f => `
                        <div class="search-suggestion-item" data-query="${escapeHtml(f.query)}">
                            <span class="item-icon">✨</span>
                            <span>${escapeHtml(f.label)}</span>
                        </div>
                    `).join('')}
                </div>`;
        }

        dropdown.innerHTML = html;
        dropdown.classList.add('active');

        dropdown.querySelectorAll('.search-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const targetQ = item.dataset.query;
                window.location.href = `explore.html?q=${encodeURIComponent(targetQ)}`;
            });
        });
    };

    searchInput.addEventListener('input', (e) => renderSuggestions(e.target.value));
    searchInput.addEventListener('focus', (e) => {
        if (e.target.value.trim()) renderSuggestions(e.target.value);
    });

    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target)) dropdown.classList.remove('active');
    });

    const executeSearch = () => {
        const q = searchInput.value.trim();
        if (q) window.location.href = `explore.html?q=${encodeURIComponent(q)}`;
    };

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        executeSearch();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeSearch();
        } else if (e.key === 'Escape') {
            dropdown.classList.remove('active');
        }
    });
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    let btn = document.getElementById('backToTopBtn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'backToTopBtn';
        btn.className = 'back-to-top-btn';
        btn.setAttribute('aria-label', 'Back to top of page');
        btn.innerHTML = '▲';
        document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Global Share Modal
 */
function openShareModal({ title = 'Loppo Community', text = 'Check out this discussion on Loppo!', url = window.location.href }) {
    if (navigator.share) {
        navigator.share({ title, text, url }).catch(() => {});
        return;
    }

    let modal = document.getElementById('loppoShareModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loppoShareModal';
        modal.className = 'loppo-modal-overlay';
        modal.innerHTML = `
            <div class="loppo-modal-card" role="dialog" aria-modal="true" aria-labelledby="shareModalTitle">
                <div class="loppo-modal-header">
                    <h3 class="loppo-modal-title" id="shareModalTitle">Share Discussion</h3>
                    <button class="loppo-modal-close" id="btnCloseShareModal" aria-label="Close share dialog">✕</button>
                </div>
                <div class="share-options-grid">
                    <a id="shareTwitter" target="_blank" rel="noopener noreferrer" class="share-option-btn">
                        <span>𝕏</span>
                        <span>Twitter/X</span>
                    </a>
                    <a id="shareWhatsApp" target="_blank" rel="noopener noreferrer" class="share-option-btn">
                        <span>💬</span>
                        <span>WhatsApp</span>
                    </a>
                    <a id="shareLinkedIn" target="_blank" rel="noopener noreferrer" class="share-option-btn">
                        <span>💼</span>
                        <span>LinkedIn</span>
                    </a>
                    <a id="shareReddit" target="_blank" rel="noopener noreferrer" class="share-option-btn">
                        <span>🚀</span>
                        <span>Reddit</span>
                    </a>
                </div>
                <div class="share-copy-input-row">
                    <input type="text" id="shareUrlField" readonly>
                    <button type="button" class="btn-pill btn-pill-primary" id="btnCopyShareUrl">Copy Link</button>
                </div>
            </div>`;
        document.body.appendChild(modal);

        modal.querySelector('#btnCloseShareModal').addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    const shareUrlField = modal.querySelector('#shareUrlField');
    shareUrlField.value = url;

    modal.querySelector('#shareTwitter').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    modal.querySelector('#shareWhatsApp').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    modal.querySelector('#shareLinkedIn').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    modal.querySelector('#shareReddit').href = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;

    const copyBtn = modal.querySelector('#btnCopyShareUrl');
    copyBtn.onclick = () => {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copied to clipboard!', 'success');
            modal.classList.remove('active');
        }).catch(() => {
            shareUrlField.select();
            document.execCommand('copy');
            showNotification('Link copied!', 'success');
            modal.classList.remove('active');
        });
    };

    modal.classList.add('active');
}

/**
 * Keyboard Shortcuts Modal (? key)
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            openShortcutsModal();
        } else if (e.key === 'Escape') {
            const sm = document.getElementById('shortcutsModal');
            if (sm && sm.classList.contains('active')) sm.classList.remove('active');
            const shm = document.getElementById('loppoShareModal');
            if (shm && shm.classList.contains('active')) shm.classList.remove('active');
        }
    });
}

function openShortcutsModal() {
    let modal = document.getElementById('shortcutsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'shortcutsModal';
        modal.className = 'loppo-modal-overlay';
        modal.innerHTML = `
            <div class="loppo-modal-card" role="dialog" aria-modal="true" aria-labelledby="shortcutsModalTitle">
                <div class="loppo-modal-header">
                    <h3 class="loppo-modal-title" id="shortcutsModalTitle">Keyboard Shortcuts</h3>
                    <button class="loppo-modal-close" id="btnCloseShortcuts" aria-label="Close shortcuts dialog">✕</button>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px;font-size:0.9rem;margin-top:8px;">
                    <div style="display:flex;justify-content:space-between;"><span>Focus Search Bar</span><kbd style="background:var(--bg-surface-alt);padding:3px 8px;border-radius:4px;border:1px solid var(--border-subtle);">/</kbd></div>
                    <div style="display:flex;justify-content:space-between;"><span>Toggle Theme (Dark/Light)</span><kbd style="background:var(--bg-surface-alt);padding:3px 8px;border-radius:4px;border:1px solid var(--border-subtle);">T</kbd></div>
                    <div style="display:flex;justify-content:space-between;"><span>Close Modals / Drawers</span><kbd style="background:var(--bg-surface-alt);padding:3px 8px;border-radius:4px;border:1px solid var(--border-subtle);">ESC</kbd></div>
                    <div style="display:flex;justify-content:space-between;"><span>Open Shortcuts Help</span><kbd style="background:var(--bg-surface-alt);padding:3px 8px;border-radius:4px;border:1px solid var(--border-subtle);">?</kbd></div>
                </div>
            </div>`;
        document.body.appendChild(modal);
        modal.querySelector('#btnCloseShortcuts').addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
    modal.classList.add('active');
}

// Global hotkeys for / and T
document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    } else if (e.key === 't' || e.key === 'T') {
        toggleTheme();
    }
});

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadAccentColor();
    applyLanguageSettings();
    setupSharedEventListeners();
    loadUserContext();
});
