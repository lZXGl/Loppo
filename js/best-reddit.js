let currentLanguage = localStorage.getItem('appLanguage') || 'en';

const translations = {
    en: {
        logo: 'Loppo', home: 'Home', popular: 'Popular', news: 'News', explore: 'Explore', profile: 'Profile', friends: 'Friends',
        langBtn: 'العربية', login: 'Log In',
        bestTitle: 'Best of Reddit 2024',
        award1Title: 'Best Programming Post',
        award1Category: 'Gold Award',
        award1Desc: '"The Complete Guide to React 19" - An incredible in-depth tutorial that helped thousands of developers master the latest React features.',
        award1Likes: '15.2k upvotes',
        award1Comments: '342 comments',
        award1Author: 'u/TechGuru',
        award2Title: 'Most Creative Project',
        award2Category: 'Silver Award',
        award2Desc: '"I built a fully functional OS in my browser using JavaScript" - A mind-blowing project showcasing the power of web technologies.',
        award2Likes: '8.7k upvotes',
        award2Comments: '189 comments',
        award2Author: 'u/CreativeDev',
        award3Title: 'Best Community Contribution',
        award3Category: 'Bronze Award',
        award3Desc: '"Free Web Development Bootcamp for Beginners" - A comprehensive 30-day course offered completely free to the community.',
        award3Likes: '5.3k upvotes',
        award3Comments: '567 comments',
        award3Author: 'u/DevTeacher',
        award4Title: 'Funniest Post of the Year',
        award4Category: 'Humor Award',
        award4Desc: '"When your code works on the first try" - A relatable meme that perfectly captures developer struggles.',
        award4Likes: '23.1k upvotes',
        award4Comments: '421 comments',
        award4Author: 'u/FunnyDev',
        categoriesTitle: 'Best of Categories',
        catProgramming: 'Programming',
        catDesign: 'Design',
        catHumor: 'Humor',
        catCommunity: 'Community',
        // Sidebar translations
        mainTitle: 'MAIN',
        profileTitle: 'PROFILE',
        categoriesTitle: 'CATEGORIES',
        bestTitle: 'BEST OF Loppo',
        resourcesTitle: 'RESOURCES',
        editProfile: 'Edit Profile',
        chat: 'Chat',
        settings: 'Settings',
        friends: 'Friends',
        technology: 'Technology',
        gaming: 'Gaming',
        webdev: 'Web Development',
        ai: 'Artificial Intelligence',
        design: 'Design',
        datascience: 'Data Science',
        bestOf: 'Best of Loppo',
        bestEgypt: 'Best of Loppo in Egypt',
        bestUK: 'Best of Loppo in United Kingdom',
        about: 'About',
        blog: 'Blog',
        help: 'Help',
        rules: 'Community Rules',
        privacy: 'Privacy Policy',
        agreement: 'User Agreement',
        accessibility: 'Accessibility',
        contact: 'Contact Us'
    },
    ar: {
        logo: 'المنتدى', home: 'الرئيسية', popular: 'الأكثر شهرة', news: 'الأخبار', explore: 'استكشاف', profile: 'الملف الشخصي', friends: 'الأصدقاء',
        langBtn: 'English', login: 'تسجيل الدخول',
        bestTitle: 'جوائز ريديت 2024',
        award1Title: 'أفضل منشور برمجي',
        award1Category: 'جائزة ذهبية',
        award1Desc: '"الدليل الشامل لـ React 19" - برنامج تعليمي متعمق ساعد آلاف المطورين على إتقان أحدث ميزات React.',
        award1Likes: '15.2k إعجاب',
        award1Comments: '342 تعليق',
        award1Author: 'u/TechGuru',
        award2Title: 'أكثر مشروع إبداعي',
        award2Category: 'جائزة فضية',
        award2Desc: '"بنيت نظام تشغيل كامل في المتصفح باستخدام JavaScript" - مشروع مذهل يظهر قوة تقنيات الويب.',
        award2Likes: '8.7k إعجاب',
        award2Comments: '189 تعليق',
        award2Author: 'u/CreativeDev',
        award3Title: 'أفضل مساهم مجتمعي',
        award3Category: 'جائزة برونزية',
        award3Desc: '"معسكر تطوير ويب مجاني للمبتدئين" - دورة شاملة مدتها 30 يوماً مقدمة مجاناً للمجتمع.',
        award3Likes: '5.3k إعجاب',
        award3Comments: '567 تعليق',
        award3Author: 'u/DevTeacher',
        award4Title: 'أطرف منشور في السنة',
        award4Category: 'جائزة الفكاهة',
        award4Desc: '"عندما يعمل الكود الخاص بك من المحاولة الأولى" - ميم يعكس معاناة المطورين بشكل مثالي.',
        award4Likes: '23.1k إعجاب',
        award4Comments: '421 تعليق',
        award4Author: 'u/FunnyDev',
        categoriesTitle: 'أفضل الفئات',
        catProgramming: 'برمجة',
        catDesign: 'تصميم',
        catHumor: 'فكاهة',
        catCommunity: 'مجتمع',
        // Sidebar translations
        mainTitle: 'الرئيسية',
        profileTitle: 'الملف الشخصي',
        categoriesTitle: 'التصنيفات',
        bestTitle: 'أفضل ما في المنتدى',
        resourcesTitle: 'المصادر',
        editProfile: 'تعديل الملف الشخصي',
        chat: 'الدردشة',
        settings: 'الإعدادات',
        friends: 'الأصدقاء',
        technology: 'تقنية',
        gaming: 'ألعاب',
        webdev: 'تطوير ويب',
        ai: 'ذكاء اصطناعي',
        design: 'تصميم',
        datascience: 'علوم بيانات',
        bestOf: 'أفضل ما في المنتدى',
        bestEgypt: 'أفضل ما في المنتدى في مصر',
        bestUK: 'أفضل ما في المنتدى في المملكة المتحدة',
        about: 'معلومات عنا',
        blog: 'المدونة',
        help: 'المساعدة',
        rules: 'قواعد المجتمع',
        privacy: 'سياسة الخصوصية',
        agreement: 'اتفاقية المستخدم',
        accessibility: 'إمكانية الوصول',
        contact: 'اتصل بنا'
    }
};
(function loadSavedLanguage() {
    const savedLang = localStorage.getItem('appLanguage');
    if (savedLang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
        if (typeof toggleLanguage === 'function') {
            // لو فيه دالة تغيير لغة، استخدمها
            currentLanguage = 'ar';
            if (typeof updatePageLanguage === 'function') updatePageLanguage();
        }
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
        currentLanguage = 'en';
    }
})();

function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const icon = document.getElementById(sectionId + 'Icon');
    if (content && icon) {
        content.classList.toggle('collapsed');
        icon.classList.toggle('collapsed');
    }
}

function showNotification(message, type) {
    const oldNotifs = document.querySelectorAll('.notification-toast');
    oldNotifs.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    const colors = { success: '#4CAF50', error: '#f44336', info: '#2196F3' };
    notification.style.background = colors[type] || colors.success;
    notification.style.color = 'white';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function loadUserAvatar() {
    const savedAvatar = localStorage.getItem('user_avatar');
    const navAvatar = document.getElementById('nav-avatar');
    const userAvatarDiv = document.getElementById('user-avatar');
    const loggedIn = localStorage.getItem('loggedInUser');
    const loginBtn = document.getElementById('loginBtn');
    
    if (loggedIn) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userAvatarDiv) userAvatarDiv.style.display = 'block';
        if (savedAvatar && savedAvatar !== 'undefined' && savedAvatar !== 'null') {
            navAvatar.src = savedAvatar;
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (userAvatarDiv) userAvatarDiv.style.display = 'none';
    }
}

function filterCategory(category) {
    const t = translations[currentLanguage];
    let message = '';
    if (currentLanguage === 'en') {
        message = 'Showing ' + category + ' category winners';
    } else {
        if (category === 'programming') message = 'عرض الفائزين في فئة البرمجة';
        else if (category === 'design') message = 'عرض الفائزين في فئة التصميم';
        else if (category === 'humor') message = 'عرض الفائزين في فئة الفكاهة';
        else if (category === 'community') message = 'عرض الفائزين في فئة المجتمع';
        else message = 'عرض فئة ' + category;
    }
    showNotification(message, 'info');
}

function updatePageLanguage() {
    const t = translations[currentLanguage];
    const isAr = currentLanguage === 'ar';
    
    // تحديث شريط التنقل
    document.getElementById('logo-text').innerText = t.logo;
    document.getElementById('nav-home').innerText = t.home;
    document.getElementById('nav-popular').innerText = t.popular;
    document.getElementById('nav-news').innerText = t.news;
    document.getElementById('nav-explore').innerText = t.explore;
    document.getElementById('nav-profile').innerText = t.profile;
    document.getElementById('nav-friends').innerText = t.friends;
    document.getElementById('loginBtn').innerText = t.login;
    document.getElementById('langBtn').innerText = t.langBtn;
    
    // تحديث محتوى الجوائز
    document.getElementById('bestTitle').innerText = t.bestTitle;
    document.getElementById('award1Title').innerText = t.award1Title;
    document.getElementById('award1Category').innerText = t.award1Category;
    document.getElementById('award1Desc').innerText = t.award1Desc;
    document.getElementById('award1Likes').innerText = ' ' + t.award1Likes;
    document.getElementById('award1Comments').innerText = ' ' + t.award1Comments;
    document.getElementById('award1Author').innerText = '👤 ' + t.award1Author;
    document.getElementById('award2Title').innerText = t.award2Title;
    document.getElementById('award2Category').innerText = t.award2Category;
    document.getElementById('award2Desc').innerText = t.award2Desc;
    document.getElementById('award2Likes').innerText = ' ' + t.award2Likes;
    document.getElementById('award2Comments').innerText = ' ' + t.award2Comments;
    document.getElementById('award2Author').innerText = '👤 ' + t.award2Author;
    document.getElementById('award3Title').innerText = t.award3Title;
    document.getElementById('award3Category').innerText = t.award3Category;
    document.getElementById('award3Desc').innerText = t.award3Desc;
    document.getElementById('award3Likes').innerText = ' ' + t.award3Likes;
    document.getElementById('award3Comments').innerText = ' ' + t.award3Comments;
    document.getElementById('award3Author').innerText = '👤 ' + t.award3Author;
    document.getElementById('award4Title').innerText = t.award4Title;
    document.getElementById('award4Category').innerText = t.award4Category;
    document.getElementById('award4Desc').innerText = t.award4Desc;
    document.getElementById('award4Likes').innerText = ' ' + t.award4Likes;
    document.getElementById('award4Comments').innerText = ' ' + t.award4Comments;
    document.getElementById('award4Author').innerText = '👤 ' + t.award4Author;
    document.getElementById('categoriesTitle').innerText = t.categoriesTitle;
    document.getElementById('catProgramming').innerText = t.catProgramming;
    document.getElementById('catDesign').innerText = t.catDesign;
    document.getElementById('catHumor').innerText = t.catHumor;
    document.getElementById('catCommunity').innerText = t.catCommunity;
    
    // ========== تحديث السايدبار ==========
    const sections = document.querySelectorAll('.sidebar-section .section-title');
    if (sections[0]) sections[0].innerText = t.mainTitle;
    if (sections[1]) sections[1].innerText = t.profileTitle;
    if (sections[2]) sections[2].innerText = t.categoriesTitle;
    if (sections[3]) sections[3].innerText = t.bestTitle;
    if (sections[4]) sections[4].innerText = t.resourcesTitle;
    
    const mainLinks = document.querySelectorAll('#mainMenu a');
    if (mainLinks[0]) mainLinks[0].innerText = t.home;
    if (mainLinks[1]) mainLinks[1].innerText = t.popular;
    if (mainLinks[2]) mainLinks[2].innerText = t.news;
    if (mainLinks[3]) mainLinks[3].innerText = t.explore;
    
    const profileLinks = document.querySelectorAll('#profileMenu a');
    if (profileLinks[0]) profileLinks[0].innerText = t.editProfile;
    if (profileLinks[1]) profileLinks[1].innerText = t.chat;
    if (profileLinks[2]) profileLinks[2].innerText = t.settings;
    if (profileLinks[3]) profileLinks[3].innerText = t.friends;
    
    const catLinks = document.querySelectorAll('#categoriesMenu a');
    if (catLinks[0]) catLinks[0].innerText = t.technology;
    if (catLinks[1]) catLinks[1].innerText = t.gaming;
    if (catLinks[2]) catLinks[2].innerText = t.webdev;
    if (catLinks[3]) catLinks[3].innerText = t.ai;
    if (catLinks[4]) catLinks[4].innerText = t.design;
    if (catLinks[5]) catLinks[5].innerText = t.datascience;
    
    const bestLinks = document.querySelectorAll('#bestMenu a');
    if (bestLinks[0]) bestLinks[0].innerText = t.bestOf;
    if (bestLinks[1]) bestLinks[1].innerText = t.bestEgypt;
    if (bestLinks[2]) bestLinks[2].innerText = t.bestUK;
    
    const resLinks = document.querySelectorAll('#resourcesMenu a');
    if (resLinks[0]) resLinks[0].innerText = t.about;
    if (resLinks[1]) resLinks[1].innerText = t.blog;
    if (resLinks[2]) resLinks[2].innerText = t.help;
    
    const bottomLinks = document.querySelectorAll('.sidebar-bottom a');
    if (bottomLinks[0]) bottomLinks[0].innerText = t.rules;
    if (bottomLinks[1]) bottomLinks[1].innerText = t.privacy;
    if (bottomLinks[2]) bottomLinks[2].innerText = t.agreement;
    if (bottomLinks[3]) bottomLinks[3].innerText = t.accessibility;
    if (bottomLinks[4]) bottomLinks[4].innerText = t.contact;
}

function toggleLanguage() {
    if (currentLanguage === 'en') {
        currentLanguage = 'ar';
        localStorage.setItem('appLanguage', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('lang', 'ar');
    } else {
        currentLanguage = 'en';
        localStorage.setItem('appLanguage', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('lang', 'en');
    }
    updatePageLanguage();
    showNotification(currentLanguage === 'en' ? 'Switched to English' : 'تم التبديل إلى العربية', 'success');
}

if (!document.querySelector('#best-reddit-animations')) {
    const style = document.createElement('style');
    style.id = 'best-reddit-animations';
    style.textContent = `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-weight: 500;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

window.addEventListener('storage', function(e) {
    if (e.key === 'loggedInUser' || e.key === 'user_avatar') {
        loadUserAvatar();
    }
    if (e.key === 'appLanguage') {
        currentLanguage = localStorage.getItem('appLanguage') || 'en';
        updatePageLanguage();
    }
});

loadUserAvatar();
updatePageLanguage();