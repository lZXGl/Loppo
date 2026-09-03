let currentLanguage = localStorage.getItem('appLanguage') || 'en';

const translations = {
    en: {
        contactTitle: 'Contact Us',
        contactSubtitle: 'We would love to hear from you. Fill out the form and we will get back to you within 24 hours.',
        nameLabel: 'Full Name',
        emailLabel: 'Email Address',
        subjectLabel: 'Subject',
        selectOption: 'Select a subject...',
        optGeneral: 'General Inquiry',
        optTech: 'Technical Support',
        optBug: 'Bug Report',
        optFeature: 'Feature Request',
        optPartnership: 'Partnership',
        messageLabel: 'Message',
        sendBtn: 'Send Message',
        emailValue: 'support@Loppo.com',
        emailLabelCard: 'Email',
        twitterValue: 'Loppo',
        twitterLabel: 'Twitter',
        discordValue: 'Discord.gg/Loppo',
        discordLabel: 'Discord',
        quickLinksTitle: 'Quick Links',
        aboutLink: 'About Us',
        helpLink: 'Help Center',
        rulesLink: 'Community Rules'
    },
    ar: {
        contactTitle: 'اتصل بنا',
        contactSubtitle: 'نحن نحب أن نسمع منك. املأ النموذج وسنرد عليك في غضون 24 ساعة.',
        nameLabel: 'الاسم الكامل',
        emailLabel: 'البريد الإلكتروني',
        subjectLabel: 'الموضوع',
        selectOption: 'اختر موضوعاً...',
        optGeneral: 'استفسار عام',
        optTech: 'دعم فني',
        optBug: 'الإبلاغ عن خطأ',
        optFeature: 'طلب ميزة',
        optPartnership: 'شراكة',
        messageLabel: 'الرسالة',
        sendBtn: 'إرسال الرسالة',
        emailValue: 'support@Loppo.com',
        emailLabelCard: 'البريد الإلكتروني',
        twitterValue: 'Loppo',
        twitterLabel: 'تويتر',
        discordValue: 'Discord.gg/Loppo',
        discordLabel: 'ديسكورد',
        quickLinksTitle: 'روابط سريعة',
        aboutLink: 'معلومات عنا',
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
        'contactTitle': 'contactTitle',
        'contactSubtitle': 'contactSubtitle',
        'nameLabel': 'nameLabel',
        'emailLabel': 'emailLabel',
        'subjectLabel': 'subjectLabel',
        'selectOption': 'selectOption',
        'optGeneral': 'optGeneral',
        'optTech': 'optTech',
        'optBug': 'optBug',
        'optFeature': 'optFeature',
        'optPartnership': 'optPartnership',
        'messageLabel': 'messageLabel',
        'sendBtn': 'sendBtn',
        'emailValue': 'emailValue',
        'emailLabelCard': 'emailLabelCard',
        'twitterValue': 'twitterValue',
        'twitterLabel': 'twitterLabel',
        'discordValue': 'discordValue',
        'discordLabel': 'discordLabel',
        'quickLinksTitle': 'quickLinksTitle',
        'aboutLink': 'aboutLink',
        'helpLink': 'helpLink',
        'rulesLink': 'rulesLink'
    };
    Object.entries(els).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = t[key] || el.innerText;
    });
}

function submitContact(event) {
    event.preventDefault();
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const t = translations[currentLanguage];

    let message = '';
    if (currentLanguage === 'en') {
        message = 'Thank you ' + name + '!\n\nYour message has been sent successfully.\nWe will respond to ' + email + ' within 24 hours.';
    } else {
        message = 'شكراً لك ' + name + '!\n\nتم إرسال رسالتك بنجاح.\nسوف نرد على ' + email + ' في غضون 24 ساعة.';
    }

    showNotification(message);
    document.getElementById('contactForm').reset();
}
