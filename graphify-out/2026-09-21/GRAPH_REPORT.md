# Graph Report - loppo  (2026-09-21)

## Corpus Check
- 39 files · ~136,332 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 29 file(s) not represented in the graph (top: .css 23, .example 2, (none) 2)

## Summary
- 341 nodes · 460 edges · 32 communities (20 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b0f1058b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- db/index.js
- home.js
- explore.js
- server.js
- shared.js
- package.json
- popular.js
- post.js
- dependencies
- routes/auth.js
- generate_assets.py
- friends.js
- news.js
- loppo-ui.js
- js/notifications.js
- profile.js
- settings.js
- js/admin.js
- user-agreement.js
- contact.js
- help.js
- scripts
- about.js
- accessibility.js
- blog.js
- privacy.js
- rules.js
- 🌐 Loppo - Modern Social Discussion & Community Platform
- re

## God Nodes (most connected - your core abstractions)
1. `attachFeedInteractivity()` - 12 edges
2. `isAuthenticated()` - 10 edges
3. `renderFeed()` - 9 edges
4. `applyFiltersAndSort()` - 9 edges
5. `express` - 9 edges
6. `renderUsers()` - 8 edges
7. `renderNotifs()` - 7 edges
8. `setupSharedEventListeners()` - 7 edges
9. `🌐 Loppo - Modern Social Discussion & Community Platform` - 7 edges
10. `fetchFeedPosts()` - 6 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (32 total, 12 thin omitted)

### Community 0 - "db/index.js"
Cohesion: 0.08
Nodes (34): express, ref_path, @supabase/supabase-js, { createClient }, src_db_index_db, path, sqlite3, isAdmin() (+26 more)

### Community 1 - "home.js"
Cohesion: 0.15
Nodes (24): attachFeedInteractivity(), calculateReadingTime(), feedTranslations, fetchFeedPosts(), formatPostBodyWithHashtags(), getProcessedPosts(), handleAddComment(), handleDeletePost() (+16 more)

### Community 2 - "explore.js"
Cohesion: 0.13
Nodes (21): blockedUsers, closeAllModals(), closeBlockModal(), closeReportModal(), confirmBlock(), filterByCategory(), filterUsers(), friendsList (+13 more)

### Community 3 - "server.js"
Cohesion: 0.09
Nodes (22): ref_fs, app, bcrypt, bodyParser, compression, cors, { db }, express (+14 more)

### Community 4 - "shared.js"
Cohesion: 0.19
Nodes (17): applyLanguageSettings(), escapeHtml(), getInitials(), hexToRgb(), initBackToTop(), initGlobalSearch(), initKeyboardShortcuts(), loadAccentColor() (+9 more)

### Community 5 - "package.json"
Cohesion: 0.11
Nodes (17): author, description, keywords, license, main, name, type, version (+9 more)

### Community 6 - "popular.js"
Cohesion: 0.18
Nodes (12): applyFiltersAndSort(), filterByTopic(), getFilteredPosts(), loadPosts(), posts, renderPosts(), setFilter(), setSort() (+4 more)

### Community 7 - "post.js"
Cohesion: 0.18
Nodes (13): addComment(), closeReportPostModal(), deletePost(), editPost(), loadPost(), postId, renderPost(), reportedPosts (+5 more)

### Community 8 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, bcryptjs, body-parser, compression, cors, express, express-rate-limit, express-session (+8 more)

### Community 9 - "routes/auth.js"
Cohesion: 0.17
Nodes (11): bcryptjs, otplib, passport, qrcode, bcrypt, { db }, express, { isAuthenticated } (+3 more)

### Community 10 - "generate_assets.py"
Cohesion: 0.43
Nodes (6): create_gradient_surface(), generate_icon(), generate_og_image(), main(), os, pil

### Community 11 - "friends.js"
Cohesion: 0.25
Nodes (6): friendsList, loadFriends(), renderFriends(), saveFriends(), translations, unfollowFriend()

### Community 12 - "news.js"
Cohesion: 0.24
Nodes (5): newsData, performNewsSearch(), renderPosts(), searchTopic(), translations

### Community 13 - "loppo-ui.js"
Cohesion: 0.22
Nodes (4): LoppoHeader, LoppoPostModal, LoppoRightRail, LoppoSidebar

### Community 14 - "js/notifications.js"
Cohesion: 0.33
Nodes (7): fetchNotifications(), filterNotifications(), filterType(), markAllAsRead(), notifications, renderNotifs(), translations

### Community 15 - "profile.js"
Cohesion: 0.39
Nodes (7): editBio(), init(), loadUserPosts(), updateProfile(), updateProfileUI(), uploadAvatar(), uploadCover()

### Community 16 - "settings.js"
Cohesion: 0.25
Nodes (3): syncSettingsThemeUI(), toggleThemeLocal(), translations

### Community 17 - "js/admin.js"
Cohesion: 0.39
Nodes (6): deletePost(), deleteUser(), loadPosts(), loadStats(), loadUsers(), translations

### Community 21 - "scripts"
Cohesion: 0.50
Nodes (4): scripts, dev, start, test

### Community 30 - "🌐 Loppo - Modern Social Discussion & Community Platform"
Cohesion: 0.18
Nodes (10): 1. Clone & Install Dependencies, 2. Configure Environment, 3. Run the Development Server, 🏗️ Architecture, ✨ Features, 📄 License, 🌐 Loppo - Modern Social Discussion & Community Platform, 🚀 Quickstart (+2 more)

## Knowledge Gaps
- **119 isolated node(s):** `translations`, `translations`, `translations`, `translations`, `translations` (+114 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 181 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `db/index.js` to `routes/auth.js`, `server.js`, `package.json`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `translations`, `translations`, `translations` to the rest of the system?**
  _119 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07549361207897794 - nodes in this community are weakly interconnected._
- **Should `home.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Should `explore.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._