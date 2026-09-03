let currentLanguage = localStorage.getItem('appLanguage') || 'en';

const translations = {
    en: {
        rulesTitle: 'Community Rules',
        rule1: 'Be respectful to all members',
        rule2: 'No hate speech, harassment, or bullying',
        rule3: 'No spam or self-promotion without context',
        rule4: 'Post relevant content to the appropriate categories',
        rule5: 'No sharing of personal information',
        rule6: 'No NSFW or inappropriate content',
        rule7: 'Follow Reddiquette guidelines',
        rule8: 'Report violations to moderators',
        relatedTitle: 'Related Pages',
        privacyLink: 'Privacy Policy',
        termsLink: 'Terms of Service',
        contactLink: 'Contact Us'
    },
    ar: {
        rulesTitle: 'قواعد المجتمع',
        rule1: 'كن محترماً مع جميع الأعضاء',
        rule2: 'ممنوع خطاب الكراهية أو التحرش أو التنمر',
        rule3: 'ممنوع الإزعاج أو الترويج الذاتي دون سياق',
        rule4: 'انشر محتوى ذا صلة بالفئات المناسبة',
        rule5: 'ممنوع مشاركة المعلومات الشخصية',
        rule6: 'ممنوع المحتوى غير اللائق',
        rule7: 'اتبع إرشادات Reddiquette',
        rule8: 'أبلغ عن الانتهاكات إلى المشرفين',
        relatedTitle: 'صفحات ذات صلة',
        privacyLink: 'سياسة الخصوصية',
        termsLink: 'شروط الخدمة',
        contactLink: 'اتصل بنا'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updatePageContent();
});

document.addEventListener('languageChanged', () => {
    currentLanguage = localStorage.getItem('appLanguage') || 'en';
    updatePageContent();
});

function updatePageContent() {
    const t = translations[currentLanguage];
    const els = {
        'rulesTitle': 'rulesTitle',
        'rule1': 'rule1', 'rule2': 'rule2', 'rule3': 'rule3', 'rule4': 'rule4',
        'rule5': 'rule5', 'rule6': 'rule6', 'rule7': 'rule7', 'rule8': 'rule8',
        'relatedTitle': 'relatedTitle',
        'privacyLink': 'privacyLink',
        'termsLink': 'termsLink',
        'contactLink': 'contactLink'
    };
    Object.entries(els).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = t[key] || el.innerText;
    });
}
