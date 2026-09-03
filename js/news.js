let newsData = [];

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
