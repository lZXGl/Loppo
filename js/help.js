let currentLanguage = localStorage.getItem('appLanguage') || 'en';

const translations = {
    en: {
        helpTitle: 'Help Center',
        q1: 'How do I create a post?',
        a1: 'Click on the text input at the top of the homepage, write your content, and click Post. You can also add images, videos, or polls using the buttons below the text input.',
        q2: 'How do I create a poll?',
        a2: 'Click the Add Poll button, enter your question and options (minimum 2), then click Create Poll and finally Post.',
        q3: 'How do I follow users?',
        a3: 'Go to the Explore page, find users you like, and click the Follow button next to their name.',
        q4: 'How do I delete my post?',
        a4: 'Click the three dots on your post and select Delete. This option is only visible on your own posts.',
        q5: 'How do I change my display name?',
        a5: 'Go to Profile page, click on Edit Profile, change your display name, and click Save Profile.',
        q6: 'How do I change password?',
        a6: 'Go to Settings page and click on Change Password. Enter your current password and new password.',
        q7: 'How do I report a user?',
        a7: 'Click on the three dots on the user post and select Report. Our team will review the report.',
        q8: 'Need more help?',
        a8: 'Contact us through the Contact page or email support@Loppo.com',
        needHelpTitle: 'Need Help?',
        contactSupport: 'Contact Support',
        communityRules: 'Community Rules',
        aboutUs: 'About Us'
    },
    ar: {
        helpTitle: 'مركز المساعدة',
        q1: 'كيف يمكنني إنشاء منشور؟',
        a1: 'انقر على مربع النص في أعلى الصفحة الرئيسية، واكتب المحتوى الخاص بك، ثم انقر على نشر. يمكنك أيضاً إضافة صور أو فيديوهات أو استطلاعات رأي باستخدام الأزرار الموجودة أسفل مربع النص.',
        q2: 'كيف يمكنني إنشاء استطلاع رأي؟',
        a2: 'انقر على زر أضف استطلاع، أدخل سؤالك وخياراتك (2 على الأقل)، ثم انقر على إنشاء استطلاع وأخيراً نشر.',
        q3: 'كيف يمكنني متابعة المستخدمين؟',
        a3: 'اذهب إلى صفحة الاستكشاف، ابحث عن المستخدمين الذين يعجبونك، وانقر على زر متابعة بجانب أسمائهم.',
        q4: 'كيف يمكنني حذف منشوري؟',
        a4: 'انقر على النقاط الثلاث في منشورك واختر حذف. هذا الخيار يظهر فقط في منشوراتك الخاصة.',
        q5: 'كيف يمكنني تغيير اسمي الظاهر؟',
        a5: 'اذهب إلى صفحة الملف الشخصي، انقر على تعديل الملف الشخصي، غير اسمك الظاهر، ثم انقر على حفظ الملف.',
        q6: 'كيف يمكنني تغيير كلمة المرور؟',
        a6: 'اذهب إلى صفحة الإعدادات وانقر على تغيير كلمة المرور. أدخل كلمة المرور الحالية وكلمة المرور الجديدة.',
        q7: 'كيف يمكنني الإبلاغ عن مستخدم؟',
        a7: 'انقر على النقاط الثلاث في منشور المستخدم واختر إبلاغ. سيقوم فريقنا بمراجعة البلاغ.',
        q8: 'بحاجة إلى مزيد من المساعدة؟',
        a8: 'تواصل معنا من خلال صفحة الاتصال أو راسلنا على support@Loppo.com',
        needHelpTitle: 'بحاجة إلى مساعدة؟',
        contactSupport: 'اتصل بالدعم',
        communityRules: 'قواعد المجتمع',
        aboutUs: 'معلومات عنا'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updatePageContent();
});

document.addEventListener('languageChanged', () => {
    currentLanguage = localStorage.getItem('appLanguage') || 'en';
    updatePageContent();
});

function toggleAnswer(questionElement) {
    const answer = questionElement.nextElementSibling;
    answer.classList.toggle('show');
}

function updatePageContent() {
    const t = translations[currentLanguage];
    const els = {
        'helpTitle': 'helpTitle',
        'q1': 'q1', 'a1': 'a1',
        'q2': 'q2', 'a2': 'a2',
        'q3': 'q3', 'a3': 'a3',
        'q4': 'q4', 'a4': 'a4',
        'q5': 'q5', 'a5': 'a5',
        'q6': 'q6', 'a6': 'a6',
        'q7': 'q7', 'a7': 'a7',
        'q8': 'q8', 'a8': 'a8',
        'needHelpTitle': 'needHelpTitle',
        'contactSupport': 'contactSupport',
        'communityRules': 'communityRules',
        'aboutUs': 'aboutUs'
    };
    Object.entries(els).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) {
            if (key.startsWith('a') && key.length <= 3) {
                el.innerHTML = t[key] || el.innerHTML;
            } else {
                el.innerText = t[key] || el.innerText;
            }
        }
    });
}
