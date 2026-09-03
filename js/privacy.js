let currentLanguage = localStorage.getItem('appLanguage') || 'en';

const translations = {
    en: {
        policyTitle: 'Privacy Policy',
        lastUpdated: 'Last updated: December 2024',
        section1Title: '1. Data Storage',
        section1Text: 'All your posts, comments, and preferences are stored locally in your browser using localStorage. We do not collect or store any personal data on external servers.',
        section2Title: '2. Account Information',
        section2Text: 'Your display name and avatar are stored locally on your device only. No account information is sent to any external server.',
        section3Title: '3. Cookies',
        section3Text: 'We do not use cookies or any tracking technologies. Your activity remains private to your device.',
        section4Title: '4. Third Parties',
        section4Text: 'We do not share any data with third parties as no data is collected.',
        section5Title: '5. Your Rights',
        section5Text: 'You can delete all your data by clearing your browser localStorage or using the delete options within the app.',
        section6Title: '6. Contact',
        section6Text: 'For questions about this privacy policy, contact us via the Contact page.',
        quickLinksTitle: 'Quick Links',
        rulesLink: 'Community Rules',
        termsLink: 'Terms of Service',
        contactLinkSidebar: 'Contact Us'
    },
    ar: {
        policyTitle: 'سياسة الخصوصية',
        lastUpdated: 'آخر تحديث: ديسمبر 2024',
        section1Title: '1. تخزين البيانات',
        section1Text: 'جميع منشوراتك وتعليقاتك وتفضيلاتك مخزنة محلياً في متصفحك باستخدام localStorage. لا نقوم بجمع أو تخزين أي بيانات شخصية على خوادم خارجية.',
        section2Title: '2. معلومات الحساب',
        section2Text: 'اسمك الظاهر وصورتك الشخصية مخزنة محلياً على جهازك فقط. لا يتم إرسال أي معلومات حساب إلى أي خادم خارجي.',
        section3Title: '3. ملفات تعريف الارتباط',
        section3Text: 'لا نستخدم ملفات تعريف الارتباط أو أي تقنيات تتبع. يبقى نشاطك خاصاً بجهازك.',
        section4Title: '4. الأطراف الثالثة',
        section4Text: 'لا نشارك أي بيانات مع أطراف ثالثة حيث لا يتم جمع أي بيانات.',
        section5Title: '5. حقوقك',
        section5Text: 'يمكنك حذف جميع بياناتك عن طريق مسح localStorage في متصفحك أو باستخدام خيارات الحذف داخل التطبيق.',
        section6Title: '6. الاتصال',
        section6Text: 'للاستفسار عن سياسة الخصوصية هذه، اتصل بنا عبر صفحة الاتصال.',
        quickLinksTitle: 'روابط سريعة',
        rulesLink: 'قواعد المجتمع',
        termsLink: 'شروط الخدمة',
        contactLinkSidebar: 'اتصل بنا'
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
        'policyTitle': 'policyTitle',
        'lastUpdated': 'lastUpdated',
        'section1Title': 'section1Title', 'section1Text': 'section1Text',
        'section2Title': 'section2Title', 'section2Text': 'section2Text',
        'section3Title': 'section3Title', 'section3Text': 'section3Text',
        'section4Title': 'section4Title', 'section4Text': 'section4Text',
        'section5Title': 'section5Title', 'section5Text': 'section5Text',
        'section6Title': 'section6Title',
        'quickLinksTitle': 'quickLinksTitle',
        'rulesLink': 'rulesLink',
        'termsLink': 'termsLink',
        'contactLinkSidebar': 'contactLinkSidebar'
    };
    Object.entries(els).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = t[key] || el.innerText;
    });

    const section6 = document.getElementById('section6Text');
    if (section6) section6.innerHTML = t.section6Text;
}
