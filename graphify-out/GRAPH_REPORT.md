# Graph Report - loppo  (2026-09-21)

## Corpus Check
- 64 files · ~179,441 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 30 file(s) not represented in the graph (top: .css 24, .example 2, (none) 2)

## Summary
- 468 nodes · 650 edges · 43 communities (24 shown, 19 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b0f1058b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- db/index.js
- home.js
- explore.js
- server.cjs
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
- app/page.tsx
- compilerOptions
- devDependencies
- next-env.d.ts
- next.config.mjs
- server.js
- AGENTS.md
- src/package.json

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `react` - 13 edges
3. `attachFeedInteractivity()` - 12 edges
4. `useToast()` - 11 edges
5. `lucide-react` - 10 edges
6. `isAuthenticated()` - 10 edges
7. `renderFeed()` - 9 edges
8. `applyFiltersAndSort()` - 9 edges
9. `express` - 9 edges
10. `renderUsers()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `HomePage()` --calls--> `useToast()`  [EXTRACTED]
  app/page.tsx → components/ui/Toast.tsx
- `PostCardProps` --references--> `Post`  [EXTRACTED]
  components/feed/PostCard.tsx → types/database.ts
- `PostComposerProps` --references--> `Post`  [EXTRACTED]
  components/feed/PostComposer.tsx → types/database.ts
- `SettingsPage()` --calls--> `setAccent()`  [EXTRACTED]
  app/settings/page.tsx → components/theme/ThemeProvider.tsx
- `SettingsPage()` --calls--> `setTheme()`  [EXTRACTED]
  app/settings/page.tsx → components/theme/ThemeProvider.tsx

## Import Cycles
- None detected.

## Communities (43 total, 19 thin omitted)

### Community 0 - "db/index.js"
Cohesion: 0.07
Nodes (36): isSupabaseConfigured, supabase, express, ref_path, @supabase/supabase-js, { createClient }, src_db_index_db, path (+28 more)

### Community 1 - "home.js"
Cohesion: 0.15
Nodes (24): attachFeedInteractivity(), calculateReadingTime(), feedTranslations, fetchFeedPosts(), formatPostBodyWithHashtags(), getProcessedPosts(), handleAddComment(), handleDeletePost() (+16 more)

### Community 2 - "explore.js"
Cohesion: 0.13
Nodes (21): blockedUsers, closeAllModals(), closeBlockModal(), closeReportModal(), confirmBlock(), filterByCategory(), filterUsers(), friendsList (+13 more)

### Community 3 - "server.cjs"
Cohesion: 0.08
Nodes (25): body-parser, express-session, ref_fs, helmet, app, bcrypt, bodyParser, compression (+17 more)

### Community 4 - "shared.js"
Cohesion: 0.19
Nodes (17): applyLanguageSettings(), escapeHtml(), getInitials(), hexToRgb(), initBackToTop(), initGlobalSearch(), initKeyboardShortcuts(), loadAccentColor() (+9 more)

### Community 5 - "package.json"
Cohesion: 0.08
Nodes (23): author, description, keywords, license, main, name, type, version (+15 more)

### Community 6 - "popular.js"
Cohesion: 0.18
Nodes (12): applyFiltersAndSort(), filterByTopic(), getFilteredPosts(), loadPosts(), posts, renderPosts(), setFilter(), setSort() (+4 more)

### Community 7 - "post.js"
Cohesion: 0.18
Nodes (13): addComment(), closeReportPostModal(), deletePost(), editPost(), loadPost(), postId, renderPost(), reportedPosts (+5 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (24): dependencies, autoprefixer, bcryptjs, body-parser, compression, cors, express, express-rate-limit (+16 more)

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
Cohesion: 0.33
Nodes (6): scripts, build, dev, server, start, test

### Community 30 - "🌐 Loppo - Modern Social Discussion & Community Platform"
Cohesion: 0.18
Nodes (10): 1. Clone & Install Dependencies, 2. Configure Environment, 3. Run the Development Server, 🏗️ Architecture, ✨ Features, 📄 License, 🌐 Loppo - Modern Social Discussion & Community Platform, 🚀 Quickstart (+2 more)

### Community 32 - "app/page.tsx"
Cohesion: 0.07
Nodes (46): CATEGORIES, CREATORS, app_globals, metadata, HomePage(), SettingsPage(), FeedTabs(), FeedTabsProps (+38 more)

### Community 33 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 34 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, @types/node, @types/react, @types/react-dom, typescript

### Community 35 - "next-env.d.ts"
Cohesion: 0.50
Nodes (3): next_dev_types_root_params_d, next_dev_types_routes_d, NOTE: This file should not be edited

## Knowledge Gaps
- **184 isolated node(s):** `CREATORS`, `CATEGORIES`, `metadata`, `FeedTabsProps`, `TRENDING_TOPICS` (+179 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 260 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `express` connect `db/index.js` to `routes/auth.js`, `server.cjs`, `package.json`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `react` connect `app/page.tsx` to `package.json`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `CREATORS`, `CATEGORIES`, `metadata` to the rest of the system?**
  _184 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06868686868686869 - nodes in this community are weakly interconnected._
- **Should `home.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._
- **Should `explore.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._