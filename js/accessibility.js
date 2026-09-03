let currentLanguage = localStorage.getItem('appLanguage') || 'en';

const translations = {
    en: {
        accessibilityTitle: 'Accessibility at Loppo',
        accessibilitySubtitle: 'We are committed to making our platform accessible to everyone.',
        wcagBadge: 'WCAG 2.1 Compliant',
        commitmentTitle: 'Our Commitment',
        commitmentText: 'Loppo is designed to be accessible to people with disabilities. We follow the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA to ensure our platform is usable by everyone.',
        featuresTitle: 'Accessibility Features',
        feature1: 'Screen reader compatible',
        feature2: 'Full keyboard navigation support',
        feature3: 'Dark mode for reduced eye strain',
        feature4: 'Responsive design for all devices',
        feature5: 'High contrast color options',
        feature6: 'Text resizing support',
        helpTitle: 'Need Help?',
        helpText: 'If you experience any accessibility issues, please contact us at accessibility@Loppo.com or visit our Contact page.',
        quickLinksTitle: 'Quick Links',
        contactLinkSidebar: 'Contact Us',
        helpLinkSidebar: 'Help Center',
        rulesLinkSidebar: 'Community Rules'
    },
    ar: {
        accessibilityTitle: 'إمكانية الوصول في المنتدى',
        accessibilitySubtitle: 'نحن ملتزمون بجعل منصتنا في متناول الجميع.',
        wcagBadge: 'متوافق مع WCAG 2.1',
        commitmentTitle: 'التزامنا',
        commitmentText: 'تم تصميم المنتدى ليكون في متناول الأشخاص ذوي الإعاقة. نحن نتبع إرشادات الوصول إلى محتوى الويب (WCAG) 2.1 بمستوى AA لضمان أن منصتنا قابلة للاستخدام من قبل الجميع.',
        featuresTitle: 'ميزات إمكانية الوصول',
        feature1: 'متوافق مع قارئات الشاشة',
        feature2: 'دعم كامل للتنقل عبر لوحة المفاتيح',
        feature3: 'الوضع الداكن لتقليل إجهاد العين',
        feature4: 'تصميم متجاوب لجميع الأجهزة',
        feature5: 'خيارات ألوان عالية التباين',
        feature6: 'دعم تغيير حجم النص',
        helpTitle: 'بحاجة إلى مساعدة؟',
        helpText: 'إذا واجهت أي مشاكل في إمكانية الوصول، يرجى الاتصال بنا على accessibility@Loppo.com أو زيارة صفحة الاتصال.',
        quickLinksTitle: 'روابط سريعة',
        contactLinkSidebar: 'اتصل بنا',
        helpLinkSidebar: 'مركز المساعدة',
        rulesLinkSidebar: 'قواعد المجتمع'
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
        'accessibilityTitle': 'accessibilityTitle',
        'accessibilitySubtitle': 'accessibilitySubtitle',
        'wcagBadge': 'wcagBadge',
        'commitmentTitle': 'commitmentTitle',
        'commitmentText': 'commitmentText',
        'featuresTitle': 'featuresTitle',
        'feature1': 'feature1', 'feature2': 'feature2', 'feature3': 'feature3',
        'feature4': 'feature4', 'feature5': 'feature5', 'feature6': 'feature6',
        'helpTitle': 'helpTitle',
        'quickLinksTitle': 'quickLinksTitle',
        'contactLinkSidebar': 'contactLinkSidebar',
        'helpLinkSidebar': 'helpLinkSidebar',
        'rulesLinkSidebar': 'rulesLinkSidebar'
    };
    Object.entries(els).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = t[key] || el.innerText;
    });

    const helpText = document.getElementById('helpText');
    if (helpText) helpText.innerHTML = t.helpText;
}
