const translations = {
    en: {
        settingsTitle: 'Settings',
        appearanceTitle: 'Appearance', darkModeLabel: 'Dark Mode', darkModeDesc: 'Switch between light and dark theme',
        languageLabel: 'Language', languageDesc: 'Change interface language',
        dataTitle: 'Data Management', backupLabel: 'Backup and Restore', backupDesc: 'Export or import your data',
        exportBtn: 'Export Data', importBtn: 'Import Data', backupNote: 'Export your data as a backup file',
        privacyTitle: 'Security & Privacy', clearDataLabel: 'Clear All Data', clearDataDesc: 'Delete all saved data',
        clearDataBtn: 'Clear Data', aboutTitle: 'About', supportTitle: 'Support',
        helpLink: 'Help Center', contactLink: 'Contact Us', aboutLink: 'About',
        darkBtn: 'Dark', lightBtn: 'Light'
    },
    ar: {
        settingsTitle: 'الإعدادات',
        appearanceTitle: 'المظهر', darkModeLabel: 'الوضع الداكن', darkModeDesc: 'التبديل بين الوضع الفاتح والداكن',
        languageLabel: 'اللغة', languageDesc: 'تغيير لغة الواجهة',
        dataTitle: 'إدارة البيانات', backupLabel: 'نسخ احتياطي واستعادة', backupDesc: 'تصدير أو استيراد بياناتك',
        exportBtn: 'تصدير البيانات', importBtn: 'استيراد البيانات', backupNote: 'قم بتصدير بياناتك كملف نسخ احتياطي',
        privacyTitle: 'الأمان والخصوصية', clearDataLabel: 'مسح جميع البيانات', clearDataDesc: 'حذف جميع البيانات المحفوظة',
        clearDataBtn: 'مسح البيانات', aboutTitle: 'حول', supportTitle: 'الدعم',
        helpLink: 'مركز المساعدة', contactLink: 'اتصل بنا', aboutLink: 'معلومات عنا',
        darkBtn: 'داكن', lightBtn: 'فاتح'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    initSettings();
    syncSettingsThemeUI();
});

document.addEventListener('languageChanged', () => {
    updateLanguage();
    syncSettingsThemeUI();
});

function updateLanguage() {
    const t = translations[currentLanguage];
    const ids = ['settingsTitle', 'appearanceTitle', 'darkModeLabel', 'darkModeDesc',
        'languageLabel', 'languageDesc', 'dataTitle', 'backupLabel', 'backupDesc',
        'exportBtn', 'importBtn', 'backupNote', 'privacyTitle', 'clearDataLabel',
        'clearDataDesc', 'clearDataBtn', 'aboutTitle', 'supportTitle', 'helpLink', 'contactLink', 'aboutLink'];
    const keys = ids;
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = t[keys[i]];
    });
}

function initSettings() {
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const color = dot.dataset.color;
            if (typeof setAccentColor === 'function') setAccentColor(color);
            document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            localStorage.setItem('accentColor', color);
            localStorage.setItem('accent-color', color);
        });
    });

    const savedColor = localStorage.getItem('accentColor') || localStorage.getItem('accent-color');
    if (savedColor) {
        document.querySelectorAll('.color-dot').forEach(dot => {
            if (dot.dataset.color === savedColor) dot.classList.add('active');
        });
    }
}

function syncSettingsThemeUI() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const btn = document.getElementById('themeBtn');
    if (btn) {
        btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
}

function toggleThemeLocal() {
    if (window.toggleLoppoTheme) {
        window.toggleLoppoTheme();
    }
    syncSettingsThemeUI();
}

function clearAllData() {
    if (confirm('Are you sure? This will delete ALL your data. This cannot be undone.')) {
        localStorage.clear();
        showNotification('All data cleared. Page will refresh.', 'success');
        setTimeout(() => window.location.href = 'index.html', 1500);
    }
}

function exportData() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
    }
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Loppo_backup_' + new Date().toISOString().slice(0, 19) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully', 'success');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                const data = JSON.parse(ev.target.result);
                for (const [key, value] of Object.entries(data)) {
                    localStorage.setItem(key, value);
                }
                showNotification('Data imported successfully. Page will refresh.', 'success');
                setTimeout(() => window.location.reload(), 1500);
            } catch (err) {
                showNotification('Invalid backup file', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}
