let currentFilter = 'all';
let currentSort = 'likes';
let currentTopic = '';
let posts = [];

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('topic')) currentTopic = urlParams.get('topic');

const translations = {
    en: {
        popularTitle: 'Popular Posts', popularDesc: 'Most liked and discussed content from the community',
        allTime: 'All Time', thisWeek: 'This Week', thisMonth: 'This Month', thisYear: 'This Year',
        mostLikes: 'Most Likes', mostComments: 'Most Comments', mostRecent: 'Most Recent',
        trendingTitle: 'Trending Topics', tech: 'Technology', gaming: 'Gaming', webdev: 'WebDev', ai: 'AI',
        emptyState: 'No posts found. Be the first to create a post!',
        likes: 'Likes', comments: 'Comments'
    },
    ar: {
        popularTitle: 'المنشورات الشائعة', popularDesc: 'المحتوى الأكثر إعجاباً ونقاشاً من المجتمع',
        allTime: 'كل الأوقات', thisWeek: 'هذا الأسبوع', thisMonth: 'هذا الشهر', thisYear: 'هذه السنة',
        mostLikes: 'الأكثر إعجاباً', mostComments: 'الأكثر تعليقات', mostRecent: 'الأحدث',
        trendingTitle: 'المواضيع الرائجة', tech: 'تقنية', gaming: 'ألعاب', webdev: 'تطوير ويب', ai: 'ذكاء اصطناعي',
        emptyState: 'لا توجد منشورات. كن أول من ينشر!',
        likes: 'إعجاب', comments: 'تعليقات'
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    updateLanguage();
    applyFilterFromURL();
    await loadPosts();
});

document.addEventListener('languageChanged', () => {
    updateLanguage();
    applyFiltersAndSort();
});

function updateLanguage() {
    const t = translations[currentLanguage];
    const ids = ['popularTitle', 'popularDesc', 'filterAll', 'filterWeek', 'filterMonth', 'filterYear',
        'sortLikes', 'sortComments', 'sortRecent', 'trendingTitle', 'topicTech', 'topicGaming', 'topicWebDev', 'topicAI'];
    const keys = ['popularTitle', 'popularDesc', 'allTime', 'thisWeek', 'thisMonth', 'thisYear',
        'mostLikes', 'mostComments', 'mostRecent', 'trendingTitle', 'tech', 'gaming', 'webdev', 'ai'];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = t[keys[i]];
    });
    applyFiltersAndSort();
}

function applyFilterFromURL() {
    const topic = urlParams.get('topic');
    if (topic) {
        currentTopic = topic;
        setTimeout(() => {
            document.querySelectorAll('.topic-chip').forEach(chip => {
                chip.classList.toggle('active', chip.dataset.topic === topic);
            });
        }, 100);
    }
}

async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        posts = await response.json();
        applyFiltersAndSort();
    } catch (err) { console.error('Error fetching posts:', err); }
}

function getFilteredPosts() {
    let filtered = [...posts];
    if (currentTopic) {
        filtered = filtered.filter(post => post.topic === currentTopic);
    }
    if (currentFilter !== 'all') {
        const now = new Date();
        const days = { week: 7, month: 30, year: 365 }[currentFilter];
        if (days) {
            const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(post => new Date(post.time) >= cutoff);
        }
    }
    return filtered;
}

function sortPosts(postsToSort) {
    const sorted = [...postsToSort];
    switch (currentSort) {
        case 'likes': sorted.sort((a, b) => b.likes - a.likes); break;
        case 'comments': sorted.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0)); break;
        case 'recent': sorted.sort((a, b) => new Date(b.time) - new Date(a.time)); break;
        default: sorted.sort((a, b) => b.likes - a.likes);
    }
    return sorted;
}

function applyFiltersAndSort() {
    const filtered = getFilteredPosts();
    const sorted = sortPosts(filtered);
    renderPosts(sorted);
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.filter === filter);
    });
    applyFiltersAndSort();
}

function setSort(sort) {
    currentSort = sort;
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sort);
    });
    applyFiltersAndSort();
}

function filterByTopic(topic) {
    currentTopic = topic;
    document.querySelectorAll('.topic-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.topic === topic);
    });
    applyFiltersAndSort();
}

function renderPosts(postsToRender) {
    const container = document.getElementById('feedContainer');
    if (!container) return;
    const t = translations[currentLanguage];

    if (postsToRender.length === 0) {
        container.innerHTML = `<div class="empty-state">${t.emptyState}</div>`;
        return;
    }

    container.innerHTML = postsToRender.map(post => {
        let mediaHtml = '';
        if (post.image) mediaHtml = `<img src="${escapeHtml(post.image)}" class="post-image" onclick="event.stopPropagation(); viewFullMedia('image', '${escapeHtml(post.image)}')">`;
        else if (post.video) mediaHtml = `<video src="${escapeHtml(post.video)}" class="post-video" controls onclick="event.stopPropagation()"></video>`;

        return `
            <div class="post" onclick="window.location.href='post.html?id=${post.id}'">
                <div class="post-header">
                    <div class="post-user-info">
                        <div class="post-avatar">${(post.author || 'U').charAt(0).toUpperCase()}</div>
                        <div>
                            <div class="post-author-name">${escapeHtml(post.author || 'User')}</div>
                            <div class="post-time">${post.time || ''}</div>
                        </div>
                    </div>
                </div>
                ${post.text ? '<div class="post-text">' + escapeHtml(post.text) + '</div>' : ''}
                ${mediaHtml}
                <div class="post-actions">
                    <span onclick="event.stopPropagation(); toggleLikeFromPopular(${post.id})">
                        <span class="like-count" id="likeCount${post.id}">${post.likes || 0}</span> ${t.likes}
                    </span>
                    <span onclick="event.stopPropagation(); window.location.href='post.html?id=${post.id}'">
                        ${post.commentCount || 0} ${t.comments}
                    </span>
                </div>
            </div>`;
    }).join('');
}

async function toggleLikeFromPopular(postId) {
    try {
        const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            const post = posts.find(p => p.id === postId);
            if (post) post.likes = data.likes;
            const countSpan = document.getElementById('likeCount' + postId);
            if (countSpan) countSpan.textContent = data.likes;
        }
    } catch (err) { console.error('Error toggling like:', err); }
}

function viewFullMedia(type, src) {
    const modalId = type === 'image' ? 'image-modal' : 'video-modal';
    const mediaId = type === 'image' ? 'modal-image' : 'modal-video';
    const modal = document.getElementById(modalId);
    const media = document.getElementById(mediaId);
    if (modal && media) {
        media.src = src;
        modal.classList.add('active');
    }
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    const v = document.getElementById('modal-video');
    if (v) v.pause();
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
