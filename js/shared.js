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
    const isDark = document.body.classList.contains('dark-mode');
    const newTheme = isDark ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.setAttribute('data-theme', 'dark');
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        document.body.removeAttribute('data-theme');
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) themeIcon.textContent = '🌙';
    }
    
    localStorage.setItem('loppoTheme', newTheme);
    showNotification(newTheme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled', 'info');
}

/**
 * Load and apply saved theme
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('loppoTheme') || 'light';
    const themeIcon = document.getElementById('themeIcon');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        document.body.removeAttribute('data-theme');
        if (themeIcon) themeIcon.textContent = '🌙';
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
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
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

    // Global Search Form
    const searchForm = document.getElementById('globalSearchForm');
    const searchInput = document.getElementById('globalSearchInput');
    if (searchForm && searchInput) {
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
            }
        });
    }

    // Trending topic items click handler
    document.querySelectorAll('.trending-topic-item').forEach(item => {
        item.addEventListener('click', () => {
            const topic = item.dataset.topic;
            if (topic) window.location.href = `popular.html?topic=${encodeURIComponent(topic)}`;
        });
    });

    // Highlight active sidebar navigation link based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadAccentColor();
    applyLanguageSettings();
    setupSharedEventListeners();
    loadUserContext();
});
