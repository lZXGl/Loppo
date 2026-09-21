/**
 * Loppo Theme & Accent Engine (Zero-FOUC, Synchronous Head Script)
 * Executes immediately in <head> to prevent any flash of white/unpainted content.
 */
(function() {
    const THEME_KEY = 'loppoTheme';
    const ACCENT_KEY = 'loppoAccent';

    // Helper: Hex to RGB
    function hexToRgbStr(hex) {
        const clean = hex.replace('#', '');
        if (clean.length === 6) {
            const r = parseInt(clean.substring(0, 2), 16);
            const g = parseInt(clean.substring(2, 4), 16);
            const b = parseInt(clean.substring(4, 6), 16);
            return `${r}, ${g}, ${b}`;
        }
        return '99, 102, 241';
    }

    // 1. Determine active theme
    const storedTheme = localStorage.getItem(THEME_KEY) || localStorage.getItem('theme');
    let activeTheme = storedTheme;
    if (!activeTheme) {
        activeTheme = 'dark'; // Default to dark mode
    }

    // 2. Determine active accent color
    const storedAccent = localStorage.getItem(ACCENT_KEY) || localStorage.getItem('accentColor') || '#0f766e';

    // 3. Immediately apply to <html> root element before paint
    document.documentElement.setAttribute('data-theme', activeTheme);
    document.documentElement.style.setProperty('--accent-color', storedAccent);
    document.documentElement.style.setProperty('--accent-color-rgb', hexToRgbStr(storedAccent));
    document.documentElement.style.setProperty('--accent-light', `rgba(${hexToRgbStr(storedAccent)}, 0.18)`);

    if (activeTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }

    // 4. Global Theme APIs
    window.setLoppoTheme = function(theme) {
        document.documentElement.classList.add('theme-transitioning');
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-mode');
            if (document.body) {
                document.body.setAttribute('data-theme', 'dark');
                document.body.classList.add('dark-mode');
            }
        } else {
            document.documentElement.classList.remove('dark-mode');
            if (document.body) {
                document.body.setAttribute('data-theme', 'light');
                document.body.classList.remove('dark-mode');
            }
        }

        localStorage.setItem(THEME_KEY, theme);
        localStorage.setItem('theme', theme);
        updateThemeUI(theme);

        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 320);
    };

    let isToggling = false;
    window.toggleLoppoTheme = function() {
        if (isToggling) return;
        isToggling = true;
        setTimeout(() => { isToggling = false; }, 300);

        const current = document.documentElement.getAttribute('data-theme') || (document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light');
        const next = current === 'dark' ? 'light' : 'dark';
        window.setLoppoTheme(next);
        
        if (typeof window.showToast === 'function') {
            window.showToast(next === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'info');
        } else if (typeof window.showNotification === 'function') {
            window.showNotification(next === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'info');
        }
    };

    window.setLoppoAccent = function(color) {
        const rgb = hexToRgbStr(color);
        document.documentElement.style.setProperty('--accent-color', color);
        document.documentElement.style.setProperty('--accent-color-rgb', rgb);
        document.documentElement.style.setProperty('--accent-light', `rgba(${rgb}, 0.18)`);
        localStorage.setItem(ACCENT_KEY, color);
        localStorage.setItem('accentColor', color);
        document.querySelectorAll('.accent-dot').forEach(dot => {
            const dotColor = dot.getAttribute('data-color') || dot.dataset.color;
            dot.classList.toggle('active', dotColor === color);
        });
    };

    function updateThemeUI(theme) {
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    }

    // 5. Sync UI states when DOM is ready
    function syncDOM() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        if (document.body) {
            document.body.setAttribute('data-theme', current);
            if (current === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
        updateThemeUI(current);
        const savedAccent = localStorage.getItem(ACCENT_KEY) || localStorage.getItem('accentColor') || '#0f766e';
        document.querySelectorAll('.accent-dot').forEach(dot => {
            const dotColor = dot.getAttribute('data-color') || dot.dataset.color;
            dot.classList.toggle('active', dotColor === savedAccent);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncDOM);
    } else {
        syncDOM();
    }
})();
