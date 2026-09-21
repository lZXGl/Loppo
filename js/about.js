// Uses shared currentLanguage from shared.js
const translations = {
    en: {
        aboutTitle: 'About Loppo',
        missionTitle: 'Our Mission',
        missionText: 'Loppo is a modern community platform where users share posts, create interactive polls, share media, and connect around ideas. We believe in creating a safe, high-performance, inclusive space for thoughtful conversations.',
        featuresTitle: 'Features',
        feature1: 'Create text, image, and video discussions',
        feature2: 'Create interactive real-time polls',
        feature3: 'Like, bookmark, and comment on threads',
        feature4: 'Follow creators and build connections',
        feature5: 'Fluid dark & light theme system',
        feature6: 'Multi-language (English and Arabic RTL)',
        feature7: 'Collapsible Loppo community navigation sidebar',
        techTitle: 'Technology',
        techText: 'Loppo is powered by modern Node.js, Express, SQLite, and vanilla ES6+ JavaScript with zero bloated client frameworks for instant page loads and maximum privacy.',
        versionTitle: 'Version',
        versionText: 'Version 2.5 | Modern Platform Release (2026)',
        quickLinksTitle: 'Quick Links',
        contactLink: 'Contact Us',
        helpLink: 'Help Center',
        rulesLink: 'Community Rules'
    },
    ar: {
        aboutTitle: 'حول لوبو',
        missionTitle: 'مهمتنا',
        missionText: 'لوبو هي منصة مجتمعية حديثة حيث يمكن للأعضاء مشاركة المنشورات، وإنشاء استطلاعات الرأي، ومشاركة الوسائط، والتواصل حول الأفكار المفيدة. نؤمن بإنشاء مساحة آمنة وسريعة وشاملة للنقاشات الهادفة.',
        featuresTitle: 'الميزات',
        feature1: 'إنشاء منشورات نصية وصور وفيديو',
        feature2: 'إنشاء استطلاعات رأي تفاعلية وفورية',
        feature3: 'إعجاب وحفظ والتعليق على المنشورات',
        feature4: 'متابعة المبدعين وبناء الصداقات',
        feature5: 'دعم الوضع الداكن والفاتح بسلاسة',
        feature6: 'دعم كامل للغتين العربية والإنجليزية',
        feature7: 'شريط جانبي مجتمعي تفاعلي وسهل الاستخدام',
        techTitle: 'التقنية',
        techText: 'تم تطوير لوبو باستخدام Node.js و Express و SQLite و JavaScript حديث بأعلى معايير السرعة وخفة الحجم وحماية الخصوصية.',
        versionTitle: 'الإصدار',
        versionText: 'الإصدار 2.5 | التحديث الشامل 2026',
        quickLinksTitle: 'روابط سريعة',
        contactLink: 'اتصل بنا',
        helpLink: 'مركز المساعدة',
        rulesLink: 'قواعد المجتمع'
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
        'aboutTitle': 'aboutTitle',
        'missionTitle': 'missionTitle',
        'missionText': 'missionText',
        'featuresTitle': 'featuresTitle',
        'feature1': 'feature1',
        'feature2': 'feature2',
        'feature3': 'feature3',
        'feature4': 'feature4',
        'feature5': 'feature5',
        'feature6': 'feature6',
        'feature7': 'feature7',
        'techTitle': 'techTitle',
        'techText': 'techText',
        'versionTitle': 'versionTitle',
        'versionText': 'versionText',
        'quickLinksTitle': 'quickLinksTitle',
        'contactLink': 'contactLink',
        'helpLink': 'helpLink',
        'rulesLink': 'rulesLink'
    };
    Object.entries(els).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = t[key] || el.innerText;
    });
}
