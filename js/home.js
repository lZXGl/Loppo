/**
 * ============================================================================
 * LOPPO - HOME FEED LOGIC & INTERACTION ENGINE (home.js)
 * Clean Architecture: Feed Sorting, Card Rendering, Bookmarks, Polls & Media
 * ============================================================================
 */

// Feed Module State
let rawPostsData = [];
let currentSortMode = 'hot';
let selectedImageData = null;
let selectedVideoData = null;
let isPollOpen = false;

// Saved Bookmarks from LocalStorage
let savedPostIds = JSON.parse(localStorage.getItem('loppoSavedPostIds') || '[]');

// Localized Feed Text Strings
const feedTranslations = {
    en: {
        placeholder: "What's happening in your world?",
        publishBtn: "Publish",
        imageTool: "Image",
        videoTool: "Video",
        pollTool: "Poll",
        tabHot: "Hot",
        tabLatest: "Latest",
        tabTop: "Top Liked",
        tabMedia: "Media",
        tabSaved: "Saved",
        trendingTitle: "📈 Trending Topics",
        emptyFeed: "No discussions found yet. Be the first to spark a conversation!",
        emptySaved: "You haven't bookmarked any posts yet.",
        emptyMedia: "No posts with media found.",
        postPublished: "Post published successfully!",
        writePrompt: "Please write a message or attach media before publishing.",
        loginRequired: "Please log in to perform this action.",
        postDeleted: "Post has been deleted.",
        confirmDelete: "Are you sure you want to delete this post?",
        linkCopied: "Post link copied to clipboard!",
        savedSuccess: "Post added to your bookmarks!",
        unsavedSuccess: "Post removed from bookmarks.",
        quickNote: "Quick note",
        minRead: "min read",
        share: "Share",
        comments: "Comments",
        like: "Like",
        save: "Save",
        saved: "Saved",
        follow: "Follow",
        following: "Following",
        noComments: "No comments yet. Share your thoughts!",
        commentPlaceholder: "Write a constructive reply...",
        commentPosted: "Reply added!"
    },
    ar: {
        placeholder: "ما الجديد في مجالك اليوم؟",
        publishBtn: "نشر",
        imageTool: "صورة",
        videoTool: "فيديو",
        pollTool: "استطلاع",
        tabHot: "الشائع",
        tabLatest: "الأحدث",
        tabTop: "الأعلى تفاعلاً",
        tabMedia: "الوسائط",
        tabSaved: "المحفوظات",
        trendingTitle: "📈 المواضيع الرائجة",
        emptyFeed: "لا توجد منشورات حالياً. كن أول من يبدأ نقاشاً مفيداً!",
        emptySaved: "لم تقم بحفظ أي منشورات في المفضلة بعد.",
        emptyMedia: "لا توجد منشورات تحتوي على وسائط.",
        postPublished: "تم نشر مشاركتك بنجاح!",
        writePrompt: "يرجى كتابة نص أو إرفاق صورة/فيديو قبل النشر.",
        loginRequired: "يرجى تسجيل الدخول للقيام بهذا الإجراء.",
        postDeleted: "تم حذف المنشور بنجاح.",
        confirmDelete: "هل أنت متأكد من رغبتك في حذف هذا المنشور؟",
        linkCopied: "تم نسخ رابط المنشور إلى الحافظة!",
        savedSuccess: "تمت إضافة المنشور إلى المحفوظات!",
        unsavedSuccess: "تمت إزالة المنشور من المحفوظات.",
        quickNote: "ملاحظة سريعة",
        minRead: "دقيقة قراءة",
        share: "مشاركة",
        comments: "تعليق",
        like: "إعجاب",
        save: "حفظ",
        saved: "محفوظ",
        follow: "متابعة",
        following: "متابع",
        noComments: "لا توجد تعليقات بعد. كن أول المعلقين!",
        commentPlaceholder: "اكتب رداً هادفاً...",
        commentPosted: "تمت إضافة الرد!"
    }
};

/**
 * Initialize the Feed Application
 */
document.addEventListener('DOMContentLoaded', async () => {
    setupComposerEvents();
    setupFeedFilterEvents();
    setupModalEvents();
    applyFeedTranslations();

    // Listen for custom events from shared.js
    document.addEventListener('userContextLoaded', () => {
        renderFeed();
    });

    document.addEventListener('languageChanged', () => {
        applyFeedTranslations();
        renderFeed();
    });

    await fetchFeedPosts();
});

/**
 * Apply localized strings to static feed markup
 */
function applyFeedTranslations() {
    const t = feedTranslations[currentLanguage] || feedTranslations.en;
    
    const postInput = document.getElementById('postInput');
    if (postInput) postInput.placeholder = t.placeholder;

    const btnPost = document.getElementById('t-btnPost');
    if (btnPost) btnPost.textContent = t.publishBtn;

    const toolImage = document.getElementById('t-toolImage');
    if (toolImage) toolImage.textContent = t.imageTool;

    const toolVideo = document.getElementById('t-toolVideo');
    if (toolVideo) toolVideo.textContent = t.videoTool;

    const toolPoll = document.getElementById('t-toolPoll');
    if (toolPoll) toolPoll.textContent = t.pollTool;

    const trendingTitle = document.getElementById('t-trendingTitle');
    if (trendingTitle) trendingTitle.textContent = t.trendingTitle;

    // Tabs
    const tabMap = {
        't-tabHot': t.tabHot,
        't-tabLatest': t.tabLatest,
        't-tabTop': t.tabTop,
        't-tabMedia': t.tabMedia,
        't-tabSaved': t.tabSaved
    };
    Object.entries(tabMap).forEach(([id, str]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = str;
    });
}

/**
 * Fetch all posts from backend API
 */
async function fetchFeedPosts() {
    const feedContainer = document.getElementById('feedContainer');
    const badge = document.getElementById('feedCountBadge');
    
    if (badge) badge.textContent = 'Refreshing...';

    try {
        const res = await fetch('/api/posts');
        if (res.ok) {
            rawPostsData = await res.json();
            renderFeed();
        } else {
            if (feedContainer) {
                feedContainer.innerHTML = `<div class="empty-feed-placeholder"><span class="empty-icon">⚠️</span><p>Could not load posts. Please verify server connection.</p></div>`;
            }
        }
    } catch (err) {
        console.error('Error loading posts:', err);
        if (feedContainer) {
            feedContainer.innerHTML = `<div class="empty-feed-placeholder"><span class="empty-icon">🌐</span><p>Network offline or backend unavailable.</p></div>`;
        }
    }
}

/**
 * Filter and Sort the loaded posts based on current tab state
 * @returns {Array} - Processed array of posts
 */
function getProcessedPosts() {
    let list = [...rawPostsData];

    // Filter by Sort Mode
    if (currentSortMode === 'media') {
        list = list.filter(p => Boolean(p.image || p.video));
    } else if (currentSortMode === 'saved') {
        list = list.filter(p => savedPostIds.includes(p.id));
    }

    // Sort order
    if (currentSortMode === 'hot') {
        // Hot ranking: likes * 2 + comments * 3
        list.sort((a, b) => {
            const scoreA = (a.likes || 0) * 2 + (a.commentCount || 0) * 3;
            const scoreB = (b.likes || 0) * 2 + (b.commentCount || 0) * 3;
            return scoreB - scoreA || (b.id - a.id);
        });
    } else if (currentSortMode === 'top') {
        list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (currentSortMode === 'latest') {
        list.sort((a, b) => b.id - a.id);
    }

    return list;
}

/**
 * Calculate estimated reading time for a post
 * @param {string} text - Post text
 * @returns {string} - "Quick note" or "X min read"
 */
function calculateReadingTime(text) {
    const t = feedTranslations[currentLanguage] || feedTranslations.en;
    if (!text) return t.quickNote;
    const words = text.trim().split(/\s+/).length;
    if (words < 30) return t.quickNote;
    const mins = Math.ceil(words / 150);
    return `${mins} ${t.minRead}`;
}

/**
 * Format post body text: sanitize HTML and convert #hashtags into clickable filters
 * @param {string} rawText - Text from post
 * @returns {string} - Safe HTML with interactive tags
 */
function formatPostBodyWithHashtags(rawText) {
    if (!rawText) return '';
    const safeText = escapeHtml(rawText);
    
    // Replace #Hashtag with a styled clickable span
    return safeText.replace(/#([\w\u0600-\u06FF]+)/g, (match, tag) => {
        return `<span class="post-hashtag-pill" data-topic="${tag}">${match}</span>`;
    });
}

/**
 * Render the main feed cards
 */
function renderFeed() {
    const container = document.getElementById('feedContainer');
    const badge = document.getElementById('feedCountBadge');
    if (!container) return;

    const t = feedTranslations[currentLanguage] || feedTranslations.en;
    const user = globalCurrentUser;
    const currentUserName = user ? (user.displayName || user.username) : null;
    const postsToRender = getProcessedPosts();

    if (badge) {
        badge.textContent = `${postsToRender.length} ${postsToRender.length === 1 ? 'post' : 'posts'}`;
    }

    container.innerHTML = '';

    if (postsToRender.length === 0) {
        let msg = t.emptyFeed;
        if (currentSortMode === 'saved') msg = t.emptySaved;
        if (currentSortMode === 'media') msg = t.emptyMedia;

        container.innerHTML = `
            <div class="empty-feed-placeholder">
                <span class="empty-icon">💭</span>
                <p style="color:var(--text-secondary);font-size:0.95rem;">${msg}</p>
            </div>
        `;
        return;
    }

    // Build Post Card Fragments
    postsToRender.forEach(post => {
        const isHidden = Boolean(post.isHidden);
        const isAuthor = user && (post.userId === user.id || post.author === currentUserName);
        const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
        const isLiked = currentUserName && likedBy.includes(currentUserName);
        const isSaved = savedPostIds.includes(post.id);

        const card = document.createElement('article');
        card.className = `post-card ${isHidden ? 'hidden-post' : ''}`;
        card.id = `post-${post.id}`;
        card.setAttribute('aria-labelledby', `author-post-${post.id}`);

        // Avatar HTML
        const avatarHtml = post.authorAvatar
            ? `<img src="${escapeHtml(post.authorAvatar)}" class="post-author-avatar" alt="${escapeHtml(post.author)}">`
            : `<div class="post-avatar-fallback">${escapeHtml(getInitials(post.author))}</div>`;

        // Follow Button (if not self and user logged in)
        const followHtml = (!isAuthor && user)
            ? `<button type="button" class="btn-follow-chip" data-user-id="${post.userId || ''}">${t.follow}</button>`
            : '';

        // Media Element
        let mediaHtml = '';
        if (post.image) {
            mediaHtml = `
                <div class="post-media-frame">
                    <img src="${escapeHtml(post.image)}" class="post-card-image" alt="Post attachment image" data-full-img="${escapeHtml(post.image)}">
                </div>
            `;
        } else if (post.video) {
            mediaHtml = `
                <div class="post-media-frame">
                    <video src="${escapeHtml(post.video)}" class="post-card-video" controls></video>
                </div>
            `;
        }

        // Poll Display
        let pollHtml = '';
        if (post.poll && post.poll.options) {
            let optionsRows = '';
            const totalVotes = post.poll.totalVotes || 0;

            post.poll.options.forEach(opt => {
                const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                optionsRows += `
                    <div class="post-poll-option-row" data-post-id="${post.id}" data-option-id="${opt.id}">
                        <div class="poll-fill-progress" style="width: ${percentage}%;"></div>
                        <div class="poll-option-content">
                            <span>${escapeHtml(opt.text)}</span>
                            <span>${percentage}%</span>
                        </div>
                    </div>
                `;
            });

            pollHtml = `
                <div class="post-poll-display">
                    <div class="post-poll-question">📊 ${escapeHtml(post.poll.question)}</div>
                    ${optionsRows}
                    <div class="poll-total-votes-count">${totalVotes} total votes</div>
                </div>
            `;
        }

        // Author Actions Dropdown Menu
        const authorMenuHtml = isAuthor ? `
            <div class="post-more-menu-container">
                <button type="button" class="btn-post-more" aria-label="More options">•••</button>
                <div class="post-dropdown-menu">
                    <button type="button" class="menu-action-item" data-action="edit" data-post-id="${post.id}">✏️ Edit</button>
                    <button type="button" class="menu-action-item" data-action="hide" data-post-id="${post.id}" data-hidden="${isHidden}">${isHidden ? '👁️ Unhide' : '🔒 Hide'}</button>
                    <button type="button" class="menu-action-item danger-action" data-action="delete" data-post-id="${post.id}">🗑️ Delete</button>
                </div>
            </div>
        ` : '';

        // Assemble Inner Card HTML
        card.innerHTML = `
            <header class="post-header-row">
                <div class="post-author-meta">
                    ${avatarHtml}
                    <div class="post-author-details">
                        <div class="author-name-wrap">
                            <span class="author-display-name" id="author-post-${post.id}">${escapeHtml(post.author || 'Anonymous')}</span>
                            ${followHtml}
                        </div>
                        <div class="post-timestamp-row">
                            <time datetime="${post.time}">${post.time || 'Recently'}</time>
                            <span>•</span>
                            <span class="read-time-pill">${calculateReadingTime(post.text)}</span>
                        </div>
                    </div>
                </div>
                ${authorMenuHtml}
            </header>

            <div class="post-body-content">
                ${post.text ? `<p class="post-body-text">${formatPostBodyWithHashtags(post.text)}</p>` : ''}
                ${mediaHtml}
                ${pollHtml}
            </div>

            <footer class="post-actions-toolbar">
                <div class="action-tools-group">
                    <button type="button" class="btn-card-action ${isLiked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">
                        <span class="action-icon">${isLiked ? '❤️' : '🤍'}</span>
                        <span class="action-label like-count">${post.likes || 0}</span>
                    </button>

                    <button type="button" class="btn-card-action" data-action="toggle-comments" data-post-id="${post.id}">
                        <span class="action-icon">💬</span>
                        <span class="action-label comment-count">${post.commentCount || 0}</span>
                    </button>

                    <button type="button" class="btn-card-action ${isSaved ? 'saved' : ''}" data-action="bookmark" data-post-id="${post.id}">
                        <span class="action-icon">${isSaved ? '🔖' : '📑'}</span>
                        <span class="action-label">${isSaved ? t.saved : t.save}</span>
                    </button>
                </div>

                <button type="button" class="btn-card-action" data-action="share" data-post-id="${post.id}">
                    <span class="action-icon">🔗</span>
                    <span class="action-label">${t.share}</span>
                </button>
            </footer>

            <!-- Collapsible Comments Section -->
            <section class="post-comments-container" id="comments-${post.id}" style="display:none;" aria-label="Comments">
                <div class="comments-thread-list" id="commentsList-${post.id}">
                    <p style="color:var(--text-muted);font-size:0.85rem;">Loading discussion...</p>
                </div>
                <div class="comment-composer-row">
                    <input type="text" class="comment-input-field" id="commentInput-${post.id}" placeholder="${t.commentPlaceholder}">
                    <button type="button" class="btn-pill btn-pill-primary" data-action="submit-comment" data-post-id="${post.id}">Send</button>
                </div>
            </section>
        `;

        container.appendChild(card);
    });

    attachFeedInteractivity();
}

/**
 * Attach Event Delegation and Handlers to Feed elements
 */
function attachFeedInteractivity() {
    const container = document.getElementById('feedContainer');
    if (!container) return;

    // Remove existing event listeners by replacing with clone or attaching to container
    container.onclick = async (e) => {
        const target = e.target;

        // 1. Post Hashtag Click
        const hashtag = target.closest('.post-hashtag-pill');
        if (hashtag) {
            const topic = hashtag.dataset.topic;
            if (topic) window.location.href = `popular.html?topic=${encodeURIComponent(topic)}`;
            return;
        }

        // 2. Image Click to Zoom
        const cardImg = target.closest('.post-card-image');
        if (cardImg) {
            const fullSrc = cardImg.dataset.fullImg || cardImg.src;
            openModalImage(fullSrc);
            return;
        }

        // 3. More Dropdown Trigger
        const btnMore = target.closest('.btn-post-more');
        if (btnMore) {
            e.stopPropagation();
            const dropdown = btnMore.nextElementSibling;
            document.querySelectorAll('.post-dropdown-menu.show').forEach(m => {
                if (m !== dropdown) m.classList.remove('show');
            });
            if (dropdown) dropdown.classList.toggle('show');
            return;
        }

        // 4. Action: Like
        const btnLike = target.closest('[data-action="like"]');
        if (btnLike) {
            const postId = parseInt(btnLike.dataset.postId, 10);
            await handlePostLike(btnLike, postId);
            return;
        }

        // 5. Action: Toggle Comments
        const btnComment = target.closest('[data-action="toggle-comments"]');
        if (btnComment) {
            const postId = parseInt(btnComment.dataset.postId, 10);
            await toggleCommentsSection(postId);
            return;
        }

        // 6. Action: Bookmark
        const btnBookmark = target.closest('[data-action="bookmark"]');
        if (btnBookmark) {
            const postId = parseInt(btnBookmark.dataset.postId, 10);
            toggleBookmarkPost(btnBookmark, postId);
            return;
        }

        // 7. Action: Share
        const btnShare = target.closest('[data-action="share"]');
        if (btnShare) {
            const postId = parseInt(btnShare.dataset.postId, 10);
            handleSharePost(postId);
            return;
        }

        // 8. Action: Submit Comment
        const btnSubmitComment = target.closest('[data-action="submit-comment"]');
        if (btnSubmitComment) {
            const postId = parseInt(btnSubmitComment.dataset.postId, 10);
            await handleAddComment(postId);
            return;
        }

        // 9. Menu Actions: Edit, Hide, Delete
        const menuAction = target.closest('.menu-action-item');
        if (menuAction) {
            const action = menuAction.dataset.action;
            const postId = parseInt(menuAction.dataset.postId, 10);

            if (action === 'delete') await handleDeletePost(postId);
            else if (action === 'hide') {
                const isHidden = menuAction.dataset.hidden === 'true';
                await handleHidePost(postId, isHidden);
            } else if (action === 'edit') await handleEditPost(postId);
            return;
        }

        // 10. Follow Button
        const btnFollow = target.closest('.btn-follow-chip');
        if (btnFollow) {
            const userId = btnFollow.dataset.userId;
            if (userId) handleFollowUser(btnFollow, userId);
            return;
        }
    };

    // Close any open dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.post-more-menu-container')) {
            document.querySelectorAll('.post-dropdown-menu.show').forEach(m => m.classList.remove('show'));
        }
    });
}

/**
 * Handle Upvote / Like toggle
 */
async function handlePostLike(buttonEl, postId) {
    const t = feedTranslations[currentLanguage] || feedTranslations.en;
    try {
        const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            const countLabel = buttonEl.querySelector('.like-count');
            const icon = buttonEl.querySelector('.action-icon');

            if (countLabel) countLabel.textContent = data.likes;
            if (icon) icon.textContent = data.userLiked ? '❤️' : '🤍';
            buttonEl.classList.toggle('liked', data.userLiked);

            // Update local post state
            const postObj = rawPostsData.find(p => p.id === postId);
            if (postObj) {
                postObj.likes = data.likes;
                const user = globalCurrentUser;
                const userName = user ? (user.displayName || user.username) : null;
                if (userName) {
                    if (!Array.isArray(postObj.likedBy)) postObj.likedBy = [];
                    if (data.userLiked) postObj.likedBy.push(userName);
                    else postObj.likedBy = postObj.likedBy.filter(u => u !== userName);
                }
            }
        } else {
            showNotification(t.loginRequired, 'error');
        }
    } catch (e) {
        showNotification('Connection error while voting.', 'error');
    }
}

/**
 * Toggle Save / Bookmark for a post
 */
function toggleBookmarkPost(buttonEl, postId) {
    const t = feedTranslations[currentLanguage] || feedTranslations.en;
    const index = savedPostIds.indexOf(postId);
    const icon = buttonEl.querySelector('.action-icon');
    const label = buttonEl.querySelector('.action-label');

    if (index > -1) {
        // Remove from bookmarks
        savedPostIds.splice(index, 1);
        buttonEl.classList.remove('saved');
        if (icon) icon.textContent = '📑';
        if (label) label.textContent = t.save;
        showNotification(t.unsavedSuccess, 'info');
    } else {
        // Add to bookmarks
        savedPostIds.push(postId);
        buttonEl.classList.add('saved');
        if (icon) icon.textContent = '🔖';
        if (label) label.textContent = t.saved;
        showNotification(t.savedSuccess, 'success');
    }

    localStorage.setItem('loppoSavedPostIds', JSON.stringify(savedPostIds));

    // If currently on Saved tab, re-render immediately
    if (currentSortMode === 'saved') {
        renderFeed();
    }
}

/**
 * Share post via Web Share API or Clipboard
 */
function handleSharePost(postId) {
    const t = feedTranslations[currentLanguage] || feedTranslations.en;
    const postUrl = `${window.location.origin}/post.html?id=${postId}`;

    if (navigator.share) {
        navigator.share({
            title: 'Loppo Discussion',
            text: 'Check out this post on Loppo!',
            url: postUrl
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(postUrl).then(() => {
            showNotification(t.linkCopied, 'success');
        }).catch(() => {
            showNotification('Could not copy link.', 'error');
        });
    }
}

/**
 * Toggle Comments and load thread
 */
async function toggleCommentsSection(postId) {
    const section = document.getElementById(`comments-${postId}`);
    if (!section) return;

    const isClosed = section.style.display === 'none';
    section.style.display = isClosed ? 'flex' : 'none';

    if (isClosed) {
        await loadCommentsThread(postId);
    }
}

/**
 * Fetch and render comments for a post
 */
async function loadCommentsThread(postId) {
    const listEl = document.getElementById(`commentsList-${postId}`);
    if (!listEl) return;

    const t = feedTranslations[currentLanguage] || feedTranslations.en;

    try {
        const res = await fetch(`/api/posts/${postId}/comments`);
        if (res.ok) {
            const comments = await res.json();
            if (comments.length === 0) {
                listEl.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem;padding:4px 0;">${t.noComments}</p>`;
            } else {
                listEl.innerHTML = comments.map(c => `
                    <div class="comment-bubble">
                        <span class="comment-author-badge">${escapeHtml(c.author || 'User')}</span>
                        <p class="comment-text-p">${escapeHtml(c.text)}</p>
                    </div>
                `).join('');
            }
        }
    } catch (e) {
        listEl.innerHTML = '<p style="color:var(--danger);font-size:0.85rem;">Error loading comments.</p>';
    }
}

/**
 * Submit a comment reply
 */
async function handleAddComment(postId) {
    const input = document.getElementById(`commentInput-${postId}`);
    const text = input ? input.value.trim() : '';
    const t = feedTranslations[currentLanguage] || feedTranslations.en;

    if (!text) return;

    try {
        const res = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (res.ok) {
            input.value = '';
            await loadCommentsThread(postId);
            showNotification(t.commentPosted, 'success');

            // Increment UI counter
            const counter = document.querySelector(`#post-${postId} .comment-count`);
            if (counter) counter.textContent = parseInt(counter.textContent || 0, 10) + 1;
        } else {
            showNotification(t.loginRequired, 'error');
        }
    } catch (e) {
        showNotification('Failed to post comment.', 'error');
    }
}

/**
 * Follow user action
 */
async function handleFollowUser(buttonEl, userId) {
    const t = feedTranslations[currentLanguage] || feedTranslations.en;
    try {
        const res = await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
        if (res.ok) {
            buttonEl.textContent = t.following;
            buttonEl.style.background = 'var(--accent-color)';
            buttonEl.style.color = 'white';
            showNotification(`Followed user successfully!`, 'success');
        } else {
            showNotification(t.loginRequired, 'error');
        }
    } catch (e) {}
}

/**
 * Delete a post with confirmation
 */
async function handleDeletePost(postId) {
    const t = feedTranslations[currentLanguage] || feedTranslations.en;
    if (!confirm(t.confirmDelete)) return;

    try {
        const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
        if (res.ok) {
            rawPostsData = rawPostsData.filter(p => p.id !== postId);
            renderFeed();
            showNotification(t.postDeleted, 'success');
        }
    } catch (e) {
        showNotification('Error deleting post.', 'error');
    }
}

/**
 * Toggle Hide post visibility
 */
async function handleHidePost(postId, currentHidden) {
    try {
        const res = await fetch(`/api/posts/${postId}/hide`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isHidden: !currentHidden })
        });
        if (res.ok) {
            await fetchFeedPosts();
            showNotification('Visibility updated!', 'info');
        }
    } catch (e) {}
}

/**
 * Edit post content
 */
async function handleEditPost(postId) {
    const post = rawPostsData.find(p => p.id === postId);
    if (!post) return;

    const newText = prompt('Edit your post:', post.text || '');
    if (newText !== null && newText.trim()) {
        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText.trim() })
            });
            if (res.ok) {
                await fetchFeedPosts();
                showNotification('Post edited!', 'success');
            }
        } catch (e) {}
    }
}

/**
 * Setup Composer Events (Textarea, File Select, Poll Creator, Submit)
 */
function setupComposerEvents() {
    const btnSubmit = document.getElementById('btnSubmitPost');
    const postInput = document.getElementById('postInput');
    const imageUpload = document.getElementById('imageUpload');
    const videoUpload = document.getElementById('videoUpload');
    const btnTriggerImage = document.getElementById('btnTriggerImageUpload');
    const btnTriggerVideo = document.getElementById('btnTriggerVideoUpload');
    const btnTogglePoll = document.getElementById('btnTogglePoll');
    const btnAddPollOption = document.getElementById('btnAddPollOption');
    const btnRemoveImage = document.getElementById('btnRemoveImage');
    const btnRemoveVideo = document.getElementById('btnRemoveVideo');

    // Trigger file uploads
    if (btnTriggerImage && imageUpload) {
        btnTriggerImage.addEventListener('click', () => imageUpload.click());
        imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    selectedImageData = evt.target.result;
                    selectedVideoData = null;
                    document.getElementById('imagePreview').src = selectedImageData;
                    document.getElementById('imagePreviewArea').style.display = 'block';
                    document.getElementById('videoPreviewArea').style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnTriggerVideo && videoUpload) {
        btnTriggerVideo.addEventListener('click', () => videoUpload.click());
        videoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    selectedVideoData = evt.target.result;
                    selectedImageData = null;
                    document.getElementById('videoPreview').src = selectedVideoData;
                    document.getElementById('videoPreviewArea').style.display = 'block';
                    document.getElementById('imagePreviewArea').style.display = 'none';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (btnRemoveImage) {
        btnRemoveImage.addEventListener('click', () => {
            selectedImageData = null;
            if (imageUpload) imageUpload.value = '';
            document.getElementById('imagePreviewArea').style.display = 'none';
        });
    }

    if (btnRemoveVideo) {
        btnRemoveVideo.addEventListener('click', () => {
            selectedVideoData = null;
            if (videoUpload) videoUpload.value = '';
            document.getElementById('videoPreviewArea').style.display = 'none';
        });
    }

    // Toggle Poll Box
    if (btnTogglePoll) {
        btnTogglePoll.addEventListener('click', () => {
            isPollOpen = !isPollOpen;
            const pollBox = document.getElementById('pollCreator');
            if (pollBox) pollBox.style.display = isPollOpen ? 'flex' : 'none';
            btnTogglePoll.classList.toggle('active', isPollOpen);
        });
    }

    // Add Poll Option
    if (btnAddPollOption) {
        btnAddPollOption.addEventListener('click', () => {
            const container = document.getElementById('pollOptionsContainer');
            if (!container) return;
            const count = container.children.length + 1;
            const row = document.createElement('div');
            row.className = 'poll-option-row';
            row.innerHTML = `
                <input type="text" class="poll-option-input pollOptionInput" placeholder="Option ${count}">
                <button type="button" class="btn-remove-option" aria-label="Remove option">✕</button>
            `;
            row.querySelector('.btn-remove-option').addEventListener('click', () => row.remove());
            container.appendChild(row);
        });
    }

    // Submit Post
    if (btnSubmit) {
        btnSubmit.addEventListener('click', submitPostComposer);
    }
}

/**
 * Handle Post Publishing
 */
async function submitPostComposer() {
    const t = feedTranslations[currentLanguage] || feedTranslations.en;
    const postInput = document.getElementById('postInput');
    const text = postInput ? postInput.value.trim() : '';

    if (!text && !selectedImageData && !selectedVideoData && !isPollOpen) {
        showNotification(t.writePrompt, 'info');
        return;
    }

    let pollPayload = null;
    if (isPollOpen) {
        const question = document.getElementById('pollQuestion').value.trim();
        const optionInputs = document.querySelectorAll('.pollOptionInput');
        const options = [];

        optionInputs.forEach((input, i) => {
            const val = input.value.trim();
            if (val) options.push({ id: i + 1, text: val, votes: 0 });
        });

        if (!question || options.length < 2) {
            showNotification('Poll requires a question and at least 2 options.', 'error');
            return;
        }

        pollPayload = { question, options, totalVotes: 0 };
    }

    try {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                image: selectedImageData,
                video: selectedVideoData,
                poll: pollPayload
            })
        });

        if (res.ok) {
            if (postInput) postInput.value = '';
            selectedImageData = null;
            selectedVideoData = null;
            isPollOpen = false;
            
            document.getElementById('imagePreviewArea').style.display = 'none';
            document.getElementById('videoPreviewArea').style.display = 'none';
            document.getElementById('pollCreator').style.display = 'none';

            await fetchFeedPosts();
            showNotification(t.postPublished, 'success');
        } else {
            showNotification(t.loginRequired, 'error');
        }
    } catch (e) {
        showNotification('Failed to publish post.', 'error');
    }
}

/**
 * Setup Feed Filter Tab Events
 */
function setupFeedFilterEvents() {
    document.querySelectorAll('.feed-sort-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.feed-sort-tab').forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            currentSortMode = tab.dataset.sort || 'hot';
            renderFeed();
        });
    });

    // Mobile quick post button trigger
    const mbQuickPost = document.getElementById('mobileQuickPostBtn');
    if (mbQuickPost) {
        mbQuickPost.addEventListener('click', () => {
            const composer = document.getElementById('postInput');
            if (composer) {
                composer.scrollIntoView({ behavior: 'smooth' });
                composer.focus();
            }
        });
    }
}

/**
 * Setup High-Resolution Image Viewer Modal
 */
function setupModalEvents() {
    const modal = document.getElementById('imageModal');
    const btnClose = document.getElementById('btnCloseModal');

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target === btnClose) {
                modal.classList.remove('active');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

function openModalImage(src) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    if (modal && modalImg) {
        modalImg.src = src;
        modal.classList.add('active');
    }
}
