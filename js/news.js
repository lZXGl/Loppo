let newsData = [
    {
        id: 101,
        title: "Web Standards 2026: CSS Native Nesting, Container Queries & View Transitions",
        body: "Modern browsers now universally support CSS container queries, subgrid, and view transition APIs. Here is how modern web platforms are dropping heavyweight build steps in favor of clean native styling and instant rendering.",
        author: "alex_dev",
        sub: "webdev",
        time: "2 hours ago",
        upvotes: 342
    },
    {
        id: 102,
        title: "Next-Gen Local AI Models Running Efficiently on Consumer Hardware",
        body: "Breakthroughs in quantization and lightweight transformer architectures allow developers to run 14B parameter models with sub-second response times on standard workstations.",
        author: "sarah_ai",
        sub: "ai",
        time: "4 hours ago",
        upvotes: 518
    },
    {
        id: 103,
        title: "Why Zero-Framework Web Applications Are Gaining Huge Momentum",
        body: "Teams across high-scale products are revisiting vanilla JavaScript and ES modules. With baseline web standards evolving rapidly, frontend bundles are getting smaller and performance scores are reaching 100.",
        author: "omar_tech",
        sub: "programming",
        time: "6 hours ago",
        upvotes: 279
    },
    {
        id: 104,
        title: "Security Deep Dive: Modern Session Protection & Phishing-Resistant 2FA",
        body: "A comprehensive guide on implementing TOTP, WebAuthn, and strict cookie policies (SameSite=Lax, HttpOnly, secure flags) to shield users against session hijacking and credential stuffing.",
        author: "cyber_shield",
        sub: "security",
        time: "10 hours ago",
        upvotes: 195
    },
    {
        id: 105,
        title: "SQLite in Production: Why Embedded Databases Are Ideal for Modern Scalable Web Apps",
        body: "With WAL mode, memory mapping, and lightning SSDs, SQLite handles millions of reads and thousands of concurrent writes with sub-millisecond query latencies.",
        author: "database_pro",
        sub: "backend",
        time: "14 hours ago",
        upvotes: 421
    },
    {
        id: 106,
        title: "Open Source AI Agents: Autonomous Coding & Pair Programming Architectures",
        body: "An overview of how agentic loops, MCP protocols, and sandbox execution environments are revolutionizing software development workflows across teams worldwide.",
        author: "code_ninja",
        sub: "ai",
        time: "1 day ago",
        upvotes: 388
    }
];

const translations = {
    en: {
        aboutTitle: "About Community", aboutDesc: "Welcome to the Tech and Programming News Hub. Stay updated with the latest trends, frameworks, and industry insights.",
        joinBtn: "Join Community",
        rulesTitle: "Rules", rule1: "Be respectful to everyone", rule2: "No spamming or self-promotion",
        rule3: "Post relevant tech content", rule4: "Use proper formatting", rule5: "No hate speech or harassment",
        topicsTitle: "Top Topics",
        searchPlaceholder: "Search news...", emptyState: "No news found matching your search"
    },
    ar: {
        aboutTitle: "عن المجتمع", aboutDesc: "مرحباً بك في مركز أخبار التقنية والبرمجة. ابق على اطلاع بأحدث الاتجاهات والأطر ورؤى الصناعة.",
        joinBtn: "انضم للمجتمع",
        rulesTitle: "القواعد", rule1: "كن محترماً مع الجميع", rule2: "ممنوع الإزعاج أو الترويج",
        rule3: "انشر محتوى تقني مناسب", rule4: "استخدم التنسيق المناسب", rule5: "ممنوع الكراهية أو التحرش",
        topicsTitle: "أهم المواضيع",
        searchPlaceholder: "ابحث في الأخبار...", emptyState: "لا توجد أخبار تطابق بحثك"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    updateLanguage();
    renderPosts();
});

document.addEventListener('languageChanged', () => {
    updateLanguage();
    renderPosts();
});

function updateLanguage() {
    const t = translations[currentLanguage];
    const ids = ['aboutTitle', 'aboutDesc', 'joinBtn', 'rulesTitle', 'rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'topicsTitle'];
    const keys = ['aboutTitle', 'aboutDesc', 'joinBtn', 'rulesTitle', 'rule1', 'rule2', 'rule3', 'rule4', 'rule5', 'topicsTitle'];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = t[keys[i]];
    });
    const search = document.getElementById('news-search');
    if (search) search.placeholder = t.searchPlaceholder;
}

function toggleUpvote(element, postId) {
    const post = newsData.find(p => p.id === postId);
    if (!post) return;
    const upvoteSpan = element;
    const downvoteSpan = element.parentElement.querySelector('.vote-icon:last-child');
    const voteCountSpan = element.parentElement.querySelector('.vote-count');

    if (upvoteSpan.classList.contains('upvoted')) {
        upvoteSpan.classList.remove('upvoted');
        post.upvotes--;
    } else {
        if (downvoteSpan.classList.contains('downvoted')) {
            downvoteSpan.classList.remove('downvoted');
            post.upvotes++;
        }
        upvoteSpan.classList.add('upvoted');
        post.upvotes++;
    }
    voteCountSpan.textContent = post.upvotes;
}

function toggleDownvote(element, postId) {
    const post = newsData.find(p => p.id === postId);
    if (!post) return;
    const downvoteSpan = element;
    const upvoteSpan = element.parentElement.querySelector('.vote-icon:first-child');
    const voteCountSpan = element.parentElement.querySelector('.vote-count');

    if (downvoteSpan.classList.contains('downvoted')) {
        downvoteSpan.classList.remove('downvoted');
        post.upvotes++;
    } else {
        if (upvoteSpan.classList.contains('upvoted')) {
            upvoteSpan.classList.remove('upvoted');
            post.upvotes--;
        }
        downvoteSpan.classList.add('downvoted');
        post.upvotes--;
    }
    voteCountSpan.textContent = post.upvotes;
}

function renderPosts(postsToRender) {
    const newsFeed = document.getElementById('news-list');
    if (!newsFeed) return;
    const posts = postsToRender || newsData;
    const t = translations[currentLanguage];

    if (posts.length === 0) {
        newsFeed.innerHTML = `<div class="empty-state">${t.emptyState}</div>`;
        return;
    }

    newsFeed.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <div class="votes">
                <span class="vote-icon" onclick="event.stopPropagation(); toggleUpvote(this, ${post.id})">▲</span>
                <span class="vote-count">${post.upvotes}</span>
                <span class="vote-icon" onclick="event.stopPropagation(); toggleDownvote(this, ${post.id})">▼</span>
            </div>
            <div class="post-content">
                <div class="post-info">
                    <strong>r/${escapeHtml(post.sub)}</strong> • Posted by u/${escapeHtml(post.author)} • ${escapeHtml(post.time)}
                </div>
                <h2 class="post-title">${escapeHtml(post.title)}</h2>
                <p class="post-text">${escapeHtml(post.body?.substring(0, 150))}${post.body?.length > 150 ? '...' : ''}</p>
            </div>`;
        newsFeed.appendChild(postElement);
    });
}

function performNewsSearch() {
    const input = document.getElementById('news-search');
    if (!input) return;
    const q = input.value.trim().toLowerCase();
    if (q === '') { renderPosts(newsData); return; }

    const filtered = newsData.filter(post =>
        post.title?.toLowerCase().includes(q) ||
        post.body?.toLowerCase().includes(q) ||
        post.author?.toLowerCase().includes(q) ||
        post.sub?.toLowerCase().includes(q)
    );
    renderPosts(filtered);
}

function searchTopic(topic) {
    const input = document.getElementById('news-search');
    if (input) input.value = topic;
    performNewsSearch();
    showNotification('Searching for ' + topic + '...', 'info');
}

function joinCommunity() {
    showNotification('You joined the community', 'success');
}
