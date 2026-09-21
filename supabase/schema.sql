-- ==============================================================================
-- Loppo Social Platform: Complete Supabase Reference Schema
-- Paste into Supabase Dashboard -> SQL Editor and Run
-- ==============================================================================

-- 1. PROFILES (Extends Supabase auth.users)
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique,
    display_name text,
    avatar_url text,
    bio text,
    cover_photo text,
    karma integer default 0,
    is_admin boolean default false,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
    on public.profiles for select using (true);

create policy "Users can update their own profile."
    on public.profiles for update using (auth.uid() = id);

-- Trigger to create profile automatically on auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, username, display_name, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data->>'avatar_url', '/assets/default-avatar.svg')
    );
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- 2. POSTS
create table if not exists public.posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    text text not null,
    image_url text,
    video_url text,
    category text default 'general',
    tags text[] default '{}',
    likes_count integer default 0,
    is_hidden boolean default false,
    poll jsonb default null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;

create policy "Visible posts are viewable by everyone."
    on public.posts for select using (is_hidden = false or auth.uid() = user_id);

create policy "Authenticated users can create posts."
    on public.posts for insert with check (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "Users can update their own posts."
    on public.posts for update using (auth.uid() = user_id);

create policy "Users can delete their own posts."
    on public.posts for delete using (auth.uid() = user_id);

-- 3. POST LIKES
create table if not exists public.post_likes (
    post_id uuid references public.posts(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "Likes are viewable by everyone."
    on public.post_likes for select using (true);

create policy "Authenticated users can toggle likes."
    on public.post_likes for insert with check (auth.uid() = user_id);

create policy "Users can remove their own likes."
    on public.post_likes for delete using (auth.uid() = user_id);

-- 4. COMMENTS
create table if not exists public.comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references public.posts(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    parent_id uuid references public.comments(id) on delete cascade,
    text text not null,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone."
    on public.comments for select using (true);

create policy "Authenticated users can post comments."
    on public.comments for insert with check (auth.role() = 'authenticated' and auth.uid() = user_id);

create policy "Users can delete their own comments."
    on public.comments for delete using (auth.uid() = user_id);

-- 5. FOLLOWS
create table if not exists public.follows (
    follower_id uuid references public.profiles(id) on delete cascade not null,
    following_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    primary key (follower_id, following_id)
);

alter table public.follows enable row level security;

create policy "Follows are viewable by everyone."
    on public.follows for select using (true);

create policy "Authenticated users can follow/unfollow."
    on public.follows for all using (auth.uid() = follower_id);

-- 6. DIRECT MESSAGES
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    sender_id uuid references public.profiles(id) on delete cascade not null,
    receiver_id uuid references public.profiles(id) on delete cascade not null,
    text text not null,
    is_read boolean default false,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

create policy "Users can read messages they sent or received."
    on public.messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages."
    on public.messages for insert with check (auth.uid() = sender_id);

-- 7. NOTIFICATIONS
create table if not exists public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    sender_id uuid references public.profiles(id) on delete cascade,
    type text not null,
    message text not null,
    related_id text,
    is_read boolean default false,
    created_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

create policy "Users can view their own notifications."
    on public.notifications for select using (auth.uid() = user_id);

create policy "Users can update their notifications (mark read)."
    on public.notifications for update using (auth.uid() = user_id);

-- 8. INDEXES
create index if not exists idx_posts_created_at on public.posts (created_at desc);
create index if not exists idx_posts_user_id on public.posts (user_id);
create index if not exists idx_comments_post_id on public.comments (post_id);
create index if not exists idx_messages_sender_receiver on public.messages (sender_id, receiver_id);
create index if not exists idx_notifications_user on public.notifications (user_id, is_read);
