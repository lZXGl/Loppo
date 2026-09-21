// Uses shared currentLanguage from shared.js
const translations = {
    en: {
        blogTitle: 'Official Blog',
        blogDesc: 'Latest news, engineering insights, and updates from the Loppo team',
        post1Title: 'Welcome to Loppo v2.5 Release',
        post1Meta: 'Updated 2026 by Loppo Core Team',
        post1Content1: 'We are thrilled to launch Loppo 2.5 with modern features including real-time video uploads, dynamic interactive polls, bookmarking, and lightning-fast page loading.',
        feature1: 'High-speed media and video upload support',
        feature2: 'Interactive community polls with live results',
        feature3: 'Collapsible community navigation sidebar',
        feature4: 'Customizable accent palettes & dark mode',
        feature5: 'Full Arabic & English bi-directional UI',
        post2Title: 'How to Make the Most of Loppo',
        post2Meta: '2026 by Community Team',
        post2Content1: 'Tips and tricks for engaging with the community, creating popular discussions, and building your network on Loppo.',
        tip1: 'Post thoughtful discussions to build your presence',
        tip2: "Engage with community members through likes and comments",
        tip3: 'Use polls to gather community insights and perspectives',
        tip4: 'Share rich media and formatting for higher engagement',
        post3Title: 'Adaptive Dark & Light Themes',
        post3Meta: '2026 by Design Team',
        post3Content1: 'Toggle seamlessly between light and dark themes with custom accent colors for comfortable reading day or night.',
        post3Content2: 'Dark mode reduces eye fatigue during nighttime browsing and optimizes battery life.',
        recentTitle: 'Recent Posts',
        recent1: 'Welcome to Loppo v2.5',
        recent2: 'How to Make the Most of Loppo',
        recent3: 'Adaptive Themes & Accent Colors'
    },
    ar: {
        blogTitle: 'المدونة الرسمية',
        blogDesc: 'آخر الأخبار والرؤى التقنية والتحديثات من فريق لوبو',
        post1Title: 'مرحباً بكم في لوبو الإصدار 2.5',
        post1Meta: 'تحديث 2026 بواسطة فريق لوبو الأساسي',
        post1Content1: 'يسرنا الإعلان عن إطلاق لوبو 2.5 مع ميزات عصرية تشمل رفع الفيديو، استطلاعات الرأي التفاعلية، حفظ المنشورات، وأداء فائق السرعة.',
        feature1: 'دعم رفع ومشاركة الفيديو والصور',
        feature2: 'استطلاعات رأي تفاعلية مع نتائج فورية',
        feature3: 'شريط جانبي مجتمعي تفاعلي قابل للطي',
        feature4: 'وضع داكن وفاتح مع لوحة ألوان مخصصة',
        feature5: 'دعم كامل ومتقن للغتين العربية والإنجليزية',
        post2Title: 'كيف تحقق أقصى استفادة من لوبو',
        post2Meta: '2026 بواسطة فريق المجتمع',
        post2Content1: 'نصائح وحيل للتفاعل مع المجتمع، وإنشاء محتوى مميز، وبناء شبكة علاقاتك على لوبو.',
        tip1: 'انشر نقاشات مفيدة ومميزة لبناء حضورك',
        tip2: 'تفاعل مع أفراد المجتمع بالإعجاب والتعليق البناء',
        tip3: 'استخدم استطلاعات الرأي لجمع آراء وتجارب المجتمع',
        tip4: 'شارك الصور والمقاطع لجعل نقاشاتك أكثر حيوية',
        post3Title: 'الوضع الداكن متوفر الآن',
        post3Meta: '5 أكتوبر 2024 بواسطة فريق التصميم',
        post3Content1: 'يمكنك الآن التبديل بين الوضع الفاتح والداكن للتصفح المريح ليلاً أو نهاراً.',
        post3Content2: 'الوضع الداكن يقلل إجهاد العين أثناء التصفح الليلي ويوفر طاقة البطارية على شاشات OLED.',
        recentTitle: 'أحدث المنشورات',
        recent1: 'مرحباً بكم في المنتدى الإصدار 2.0',
        recent2: 'كيف تستفيد القصوى من المنتدى',
        recent3: 'الوضع الداكن متوفر الآن'
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
        'blogTitle': 'blogTitle',
        'blogDesc': 'blogDesc',
        'post1Title': 'post1Title',
        'post1Meta': 'post1Meta',
        'post2Title': 'post2Title',
        'post2Meta': 'post2Meta',
        'post3Title': 'post3Title',
        'post3Meta': 'post3Meta',
        'recentTitle': 'recentTitle',
        'recent1': 'recent1',
        'recent2': 'recent2',
        'recent3': 'recent3'
    };
    Object.entries(els).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = t[key] || el.innerText;
    });

    const post1 = document.getElementById('post1Content');
    if (post1) post1.innerHTML = '<p>' + t.post1Content1 + '</p><br><p>New features in this release:</p><ul><li>' + t.feature1 + '</li><li>' + t.feature2 + '</li><li>' + t.feature3 + '</li><li>' + t.feature4 + '</li><li>' + t.feature5 + '</li></ul>';
    const post2 = document.getElementById('post2Content');
    if (post2) post2.innerHTML = '<p>' + t.post2Content1 + '</p><br><p>Key tips:</p><ul><li>' + t.tip1 + '</li><li>' + t.tip2 + '</li><li>' + t.tip3 + '</li><li>' + t.tip4 + '</li></ul>';
    const post3 = document.getElementById('post3Content');
    if (post3) post3.innerHTML = '<p>' + t.post3Content1 + '</p><br><p>' + t.post3Content2 + '</p>';
}
