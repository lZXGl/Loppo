let currentLanguage = localStorage.getItem('appLanguage') || 'en';

const translations = {
    en: {
        aboutTitle: 'About Loppo',
        missionTitle: 'Our Mission',
        missionText: 'Loppo is a community platform where users can share posts, create polls, upload images and videos, and connect with others who share similar interests. We believe in creating a safe, inclusive space for meaningful discussions.',
        featuresTitle: 'Features',
        feature1: 'Create text, image, and video posts',
        feature2: 'Create interactive polls',
        feature3: 'Like and comment on posts',
        feature4: 'Follow other users',
        feature5: 'Dark mode support',
        feature6: 'Multi-language (English/Arabic)',
        feature7: 'Collapsible Reddit-style sidebar',
        techTitle: 'Technology',
        techText: 'Loppo is built with HTML5, CSS3, and vanilla JavaScript. All data is stored locally in your browser using localStorage, ensuring your privacy and fast performance.',
        versionTitle: 'Version',
        versionText: 'Version 2.0 | Last updated: December 2024',
        quickLinksTitle: 'Quick Links',
        contactLink: 'Contact Us',
        helpLink: 'Help Center',
        rulesLink: 'Community Rules'
    },
    ar: {
        aboutTitle: 'حول المنتدى',
        missionTitle: 'مهمتنا',
        missionText: 'المنتدى هو منصة مجتمعية حيث يمكن للمستخدمين مشاركة المنشورات، وإنشاء استطلاعات الرأي، وتحميل الصور والفيديوهات، والتواصل مع الآخرين الذين يشاركونهم نفس الاهتمامات. نحن نؤمن بإنشاء مساحة آمنة وشاملة للنقاشات الهادفة.',
        featuresTitle: 'الميزات',
        feature1: 'إنشاء منشورات نصية وصور وفيديو',
        feature2: 'إنشاء استطلاعات رأي تفاعلية',
        feature3: 'إعجاب والتعليق على المنشورات',
        feature4: 'متابعة مستخدمين آخرين',
        feature5: 'دعم الوضع الداكن',
        feature6: 'دعم لغات متعددة (عربي/إنجليزي)',
        feature7: 'شريط جانبي قابل للطي على نمط ريديت',
        techTitle: 'التقنية',
        techText: 'تم بناء المنتدى باستخدام HTML5 و CSS3 و JavaScript خالص. جميع البيانات مخزنة محلياً في متصفحك باستخدام localStorage، مما يضمن خصوصيتك وأداءً سريعاً.',
        versionTitle: 'الإصدار',
        versionText: 'الإصدار 2.0 | آخر تحديث: ديسمبر 2024',
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
