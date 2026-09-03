let currentLanguage = localStorage.getItem('appLanguage') || 'en';

const translations = {
    en: {
        blogTitle: 'Official Blog',
        blogDesc: 'Latest news and updates from the Loppo team',
        post1Title: 'Welcome to Loppo v2.0',
        post1Meta: 'December 15, 2024 by Admin',
        post1Content1: 'We are excited to announce the launch of Loppo 2.0 with new features including video uploads, interactive polls, and improved performance.',
        feature1: 'Video upload support',
        feature2: 'Interactive polls',
        feature3: 'Reddit-style collapsible sidebar',
        feature4: 'Improved dark mode',
        feature5: 'Arabic language support',
        post2Title: 'How to Make the Most of Loppo',
        post2Meta: 'November 20, 2024 by Community Team',
        post2Content1: 'Tips and tricks for engaging with the community, creating popular content, and building your network on Loppo.',
        tip1: 'Post regularly to build your presence',
        tip2: "Engage with others content through likes and comments",
        tip3: 'Use polls to get community feedback',
        tip4: 'Share images and videos for better engagement',
        post3Title: 'Dark Mode Now Available',
        post3Meta: 'October 5, 2024 by Design Team',
        post3Content1: 'You can now toggle between light and dark mode for comfortable browsing day or night.',
        post3Content2: 'Dark mode reduces eye strain during nighttime browsing and saves battery on OLED screens.',
        recentTitle: 'Recent Posts',
        recent1: 'Welcome to Loppo v2.0',
        recent2: 'How to Make the Most of Loppo',
        recent3: 'Dark Mode Available'
    },
    ar: {
        blogTitle: 'المدونة الرسمية',
        blogDesc: 'آخر الأخبار والتحديثات من فريق المنتدى',
        post1Title: 'مرحباً بكم في المنتدى الإصدار 2.0',
        post1Meta: '15 ديسمبر 2024 بواسطة الإدارة',
        post1Content1: 'يسرنا أن نعلن إطلاق المنتدى الإصدار 2.0 مع ميزات جديدة تشمل رفع الفيديو، استطلاعات الرأي التفاعلية، وتحسين الأداء.',
        feature1: 'دعم رفع الفيديو',
        feature2: 'استطلاعات رأي تفاعلية',
        feature3: 'شريط جانبي قابل للطي على نمط ريديت',
        feature4: 'وضع داكن محسن',
        feature5: 'دعم اللغة العربية',
        post2Title: 'كيف تستفيد القصوى من المنتدى',
        post2Meta: '20 نوفمبر 2024 بواسطة فريق المجتمع',
        post2Content1: 'نصائح وحيل للتفاعل مع المجتمع، وإنشاء محتوى شائع، وبناء شبكة علاقاتك على المنتدى.',
        tip1: 'انشر بانتظام لبناء حضورك',
        tip2: 'تفاعل مع محتوى الآخرين من خلال الإعجابات والتعليقات',
        tip3: 'استخدم استطلاعات الرأي للحصول على ملاحظات المجتمع',
        tip4: 'شارك الصور ومقاطع الفيديو لتفاعل أفضل',
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
