let currentLanguage = localStorage.getItem('appLanguage') || 'en';

const translations = {
    en: {
        agreementTitle: 'User Agreement',
        agreementLastUpdated: 'Last updated: December 2024',
        section1Title: '1. Acceptance of Terms',
        section1Text: 'By accessing or using Loppo, you agree to be bound by this User Agreement and all terms incorporated by reference. If you do not agree to these terms, please do not use the platform.',
        section2Title: '2. User Accounts',
        section2Text: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account. You must be at least 13 years old to use Loppo.',
        section3Title: '3. User Content',
        section3Text: 'You retain ownership of any content you post on Loppo. By posting content, you grant Loppo a non-exclusive, royalty-free license to display and distribute your content on the platform. You are solely responsible for the content you post.',
        section4Title: '4. Prohibited Conduct',
        section4Text: 'You agree not to post content that is illegal, harassing, defamatory, or violates the rights of others. You may not use the platform to distribute spam, malware, or engage in any fraudulent activity.',
        section5Title: '5. Termination',
        section5Text: 'We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that violates this agreement or is harmful to other users or the platform.',
        section6Title: '6. Disclaimer of Warranties',
        section6Text: 'Loppo is provided "as is" without warranties of any kind. We do not guarantee that the platform will be uninterrupted or error-free.',
        section7Title: '7. Limitation of Liability',
        section7Text: 'To the maximum extent permitted by law, Loppo shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
        section8Title: '8. Changes to Agreement',
        section8Text: 'We may modify this agreement at any time. Continued use of Loppo after changes constitutes acceptance of the modified terms.',
        section9Title: '9. Contact',
        section9Text: 'For questions about this agreement, please contact us through the Contact page.',
        quickLinksTitle: 'Quick Navigation',
        agreeBtn: 'I Agree',
        declineBtn: 'Decline',
        acceptMessage: 'Thank you for accepting the terms. You can now continue using Loppo.',
        declineMessage: 'You must accept the User Agreement to continue using Loppo.'
    },
    ar: {
        agreementTitle: 'اتفاقية المستخدم',
        agreementLastUpdated: 'آخر تحديث: ديسمبر 2024',
        section1Title: '1. قبول الشروط',
        section1Text: 'باستخدامك للمنتدى، فإنك توافق على الالتزام باتفاقية المستخدم هذه وجميع الشروط المضمنة فيها. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام المنصة.',
        section2Title: '2. حسابات المستخدمين',
        section2Text: 'أنت مسؤول عن الحفاظ على سرية بيانات حسابك. توافق على تحمل المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك. يجب أن يكون عمرك 13 سنة على الأقل لاستخدام المنتدى.',
        section3Title: '3. محتوى المستخدم',
        section3Text: 'تحتفظ بملكية أي محتوى تنشره على المنتدى. بنشر المحتوى، تمنح المنتدى ترخيصاً غير حصري لعرض وتوزيع المحتوى الخاص بك على المنصة. أنت وحدك المسؤول عن المحتوى الذي تنشره.',
        section4Title: '4. السلوك المحظور',
        section4Text: 'توافق على عدم نشر محتوى غير قانوني أو مسيء أو تشهيري أو ينتهك حقوق الآخرين. لا يجوز لك استخدام المنصة لتوزيع البريد العشوائي أو البرامج الضارة أو الانخراط في أي نشاط احتيالي.',
        section5Title: '5. إنهاء الخدمة',
        section5Text: 'نحتفظ بالحق في تعليق أو إنهاء حسابك وفقاً لتقديرنا الخاص، دون إشعار، لأي سلوك ينتهك هذه الاتفاقية أو يضر بالمستخدمين الآخرين أو المنصة.',
        section6Title: '6. إخلاء المسؤولية عن الضمانات',
        section6Text: 'يتم توفير المنتدى "كما هو" دون أي ضمانات من أي نوع. نحن لا نضمن أن المنصة ستكون دون انقطاع أو خالية من الأخطاء.',
        section7Title: '7. تحديد المسؤولية',
        section7Text: 'إلى أقصى حد يسمح به القانون، لا يتحمل المنتدى المسؤولية عن أي أضرار غير مباشرة أو عرضية أو تبعية ناتجة عن استخدامك للمنصة.',
        section8Title: '8. التعديلات على الاتفاقية',
        section8Text: 'يجوز لنا تعديل هذه الاتفاقية في أي وقت. الاستمرار في استخدام المنتدى بعد التعديلات يعني قبولك للشروط المعدلة.',
        section9Title: '9. الاتصال',
        section9Text: 'للاستفسار عن هذه الاتفاقية، يرجى الاتصال بنا من خلال صفحة الاتصال.',
        quickLinksTitle: 'تنقل سريع',
        agreeBtn: 'أوافق',
        declineBtn: 'أرفض',
        acceptMessage: 'شكراً لقبولك الشروط. يمكنك الآن متابعة استخدام المنتدى.',
        declineMessage: 'يجب عليك قبول اتفاقية المستخدم للمتابعة في استخدام المنتدى.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updatePageContent();
});

document.addEventListener('languageChanged', () => {
    currentLanguage = localStorage.getItem('appLanguage') || 'en';
    updatePageContent();
});

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function acceptAgreement() {
    localStorage.setItem('userAgreementAccepted', 'true');
    localStorage.setItem('userAgreementAcceptedDate', new Date().toISOString());
    const t = translations[currentLanguage];
    showNotification(t.acceptMessage, 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function declineAgreement() {
    const t = translations[currentLanguage];
    showNotification(t.declineMessage, 'error');
}

function updatePageContent() {
    const t = translations[currentLanguage];
    const els = {
        'agreementTitle': 'agreementTitle',
        'agreementLastUpdated': 'agreementLastUpdated',
        'section1Title': 'section1Title', 'section1Text': 'section1Text',
        'section2Title': 'section2Title', 'section2Text': 'section2Text',
        'section3Title': 'section3Title', 'section3Text': 'section3Text',
        'section4Title': 'section4Title', 'section4Text': 'section4Text',
        'section5Title': 'section5Title', 'section5Text': 'section5Text',
        'section6Title': 'section6Title', 'section6Text': 'section6Text',
        'section7Title': 'section7Title', 'section7Text': 'section7Text',
        'section8Title': 'section8Title', 'section8Text': 'section8Text',
        'section9Title': 'section9Title',
        'quickLinksTitle': 'quickLinksTitle',
        'agreeBtn': 'agreeBtn',
        'declineBtn': 'declineBtn'
    };
    Object.entries(els).forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = t[key] || el.innerText;
    });

    const section9 = document.getElementById('section9Text');
    if (section9) section9.innerHTML = t.section9Text;

    const quickLinks = document.querySelectorAll('.sidebar-list li');
    if (quickLinks[0]) quickLinks[0].innerHTML = t.section1Title;
    if (quickLinks[1]) quickLinks[1].innerHTML = t.section2Title;
    if (quickLinks[2]) quickLinks[2].innerHTML = t.section3Title;
    if (quickLinks[3]) quickLinks[3].innerHTML = t.section4Title;
    if (quickLinks[4]) quickLinks[4].innerHTML = t.section5Title;
    if (quickLinks[5]) quickLinks[5].innerHTML = t.section6Title;
    if (quickLinks[6]) quickLinks[6].innerHTML = t.section7Title;
    if (quickLinks[7]) quickLinks[7].innerHTML = t.section8Title;
    if (quickLinks[8]) quickLinks[8].innerHTML = t.section9Title;
}
