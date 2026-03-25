create extension if not exists pgcrypto;

create table if not exists public.areas (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.areas(id) on delete cascade,
  name text not null,
  tags text[] not null default '{}',
  moods text[] not null default '{}',
  rating smallint not null default 3 check (rating between 1 and 5),
  revisit_weight smallint not null default 3 check (revisit_weight between 1 and 5),
  price_level text not null default 'normal' check (price_level in ('budget', 'normal', 'treat')),
  business_hours text not null default '',
  map_link text not null default '',
  note text not null default '',
  eat_count integer not null default 0,
  last_eaten_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint foods_area_name_key unique (area_id, name)
);

create table if not exists public.meal_logs (
  id uuid primary key default gen_random_uuid(),
  food_id uuid references public.foods(id) on delete set null,
  area_id uuid references public.areas(id) on delete set null,
  food_name text not null,
  area_name text not null,
  mood text not null default '',
  selected_tags text[] not null default '{}',
  status text not null default 'eaten' check (status in ('decided', 'eaten')),
  user_rating smallint check (user_rating between 1 and 5),
  note text not null default '',
  created_at timestamptz not null default now(),
  eaten_at timestamptz
);

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists foods_touch_updated_at on public.foods;
create trigger foods_touch_updated_at
before update on public.foods
for each row
execute function public.touch_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.app_admins
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

alter table public.areas enable row level security;
alter table public.foods enable row level security;
alter table public.meal_logs enable row level security;
alter table public.app_admins enable row level security;

drop policy if exists "areas_select_all" on public.areas;
create policy "areas_select_all"
on public.areas
for select
using (true);

drop policy if exists "areas_admin_all" on public.areas;
create policy "areas_admin_all"
on public.areas
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "foods_select_public" on public.foods;
create policy "foods_select_public"
on public.foods
for select
using (is_active or public.is_admin());

drop policy if exists "foods_admin_all" on public.foods;
create policy "foods_admin_all"
on public.foods
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "meal_logs_select_all" on public.meal_logs;
create policy "meal_logs_select_all"
on public.meal_logs
for select
using (true);

drop policy if exists "meal_logs_admin_all" on public.meal_logs;
create policy "meal_logs_admin_all"
on public.meal_logs
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "app_admins_select_self" on public.app_admins;
create policy "app_admins_select_self"
on public.app_admins
for select
using (auth.uid() = user_id);

insert into public.areas (name, sort_order)
values
  ('妇幼街', 1),
  ('南门口', 2),
  ('司门口', 3),
  ('林科大', 4),
  ('培元桥', 5),
  ('佳兆业', 6),
  ('家附近', 7),
  ('广济桥', 8),
  ('新家附近', 9),
  ('大学城', 10),
  ('友阿金苹果', 11),
  ('Special day', 12)
on conflict (name) do update
set sort_order = excluded.sort_order;

with seed(area_name, food_name) as (
  values
    ('妇幼街', '芳芳热卤'),
    ('妇幼街', '牛爷骚'),
    ('妇幼街', '大碗先生'),
    ('妇幼街', '铁胖子'),
    ('妇幼街', '朝阳满地'),
    ('南门口', '红牛粉店'),
    ('南门口', '湘遇糯米饭'),
    ('南门口', '新疆手抓饭'),
    ('南门口', '蚵仔煎'),
    ('南门口', '桂湘缘螺蛳粉'),
    ('南门口', '阿元螺蛳粉'),
    ('南门口', '金记糖油坨坨'),
    ('南门口', '港道菠萝包'),
    ('南门口', '酸嘢'),
    ('南门口', '李记双皮奶'),
    ('南门口', '胖冬瓜'),
    ('南门口', '串小白'),
    ('司门口', 'Humble guy'),
    ('司门口', '盟重'),
    ('林科大', '小桃麻糍'),
    ('林科大', '舒芙蕾'),
    ('林科大', '窦窦烤面筋'),
    ('林科大', '拌的么'),
    ('林科大', '嘟享吃鸡公煲'),
    ('林科大', '薛笑笑螺蛳粉'),
    ('林科大', '台湾卤肉饭'),
    ('林科大', '玉米王饼'),
    ('林科大', '食全食美'),
    ('林科大', '肉夹馍'),
    ('林科大', '焖面'),
    ('林科大', '膳当家'),
    ('林科大', '糖水铺'),
    ('林科大', '嘿阿达西'),
    ('培元桥', '小二面馆'),
    ('培元桥', '哆哆煲仔饭'),
    ('培元桥', '鸿源烧烤'),
    ('佳兆业', '大碗先生'),
    ('佳兆业', '河马食堂'),
    ('佳兆业', '李小饭'),
    ('佳兆业', '麦如麦立送'),
    ('佳兆业', '常德小碗菜'),
    ('佳兆业', '盒马水果'),
    ('佳兆业', '阿捡汴京炸鸡'),
    ('家附近', '老柴枝'),
    ('家附近', '楼下烧烤'),
    ('家附近', '无名炒饭'),
    ('家附近', '柳柳饭店'),
    ('家附近', '粉二哥'),
    ('家附近', '卤肉饭'),
    ('家附近', '老上海馄饨铺'),
    ('家附近', '奶香铺子'),
    ('家附近', '大嘴巴酸辣粉'),
    ('家附近', '绿叶水果'),
    ('广济桥', '笨罗卜总店'),
    ('广济桥', '面13口'),
    ('广济桥', '享味堂甜水铺'),
    ('广济桥', '正宗兰州牛肉拉面'),
    ('广济桥', '周记粉店'),
    ('广济桥', '德胜煲仔屋'),
    ('新家附近', '宁乡宁鸡蛋面'),
    ('新家附近', '彭厨'),
    ('新家附近', '江南糕点（铁板鸭）'),
    ('新家附近', '丹妹麻辣烫'),
    ('新家附近', '李易面馆'),
    ('大学城', '整理君糯米饭'),
    ('大学城', '恰一口麻糍'),
    ('大学城', '提拉米苏'),
    ('大学城', '临榆炸鸡'),
    ('大学城', '酯花道'),
    ('大学城', '里脊肉饼'),
    ('大学城', '黄记绿豆饼'),
    ('大学城', '神奇的鸡蛋灌饼'),
    ('大学城', '周椰记'),
    ('友阿金苹果', '盛香亭转转热卤'),
    ('友阿金苹果', '水城羊肉粉'),
    ('友阿金苹果', '莹雯螺蛳粉'),
    ('友阿金苹果', '科星巷糖油坨坨'),
    ('友阿金苹果', '刘记里脊肉'),
    ('友阿金苹果', '鱿鱼嘴烧烤'),
    ('Special day', '友友饭店'),
    ('Special day', '冰火楼小馆'),
    ('Special day', '时间仓'),
    ('Special day', '未下山'),
    ('Special day', '宴长沙'),
    ('Special day', '南景饭店'),
    ('Special day', '玉芙蓉'),
    ('Special day', '王品（橘洲观江店）')
)
insert into public.foods (
  area_id,
  name,
  rating,
  revisit_weight,
  price_level
)
select
  a.id,
  s.food_name,
  case
    when s.area_name = 'Special day' then 5
    when s.food_name ~ '(热卤|螺蛳|煲|麻糍|舒芙蕾|糖油|炸鸡)' then 4
    else 3
  end as rating,
  case
    when s.area_name = 'Special day' then 4
    else 3
  end as revisit_weight,
  case
    when s.food_name ~ '(王品|宴长沙|玉芙蓉|未下山|冰火楼|友友饭店|南景)' then 'treat'
    when s.food_name ~ '(糖油|麻糍|双皮奶|菠萝包|水果|绿豆饼|提拉米苏|舒芙蕾)' then 'budget'
    else 'normal'
  end as price_level
from seed s
join public.areas a
  on a.name = s.area_name
on conflict (area_id, name) do nothing;

-- 使用方式：
-- 1. 在 Supabase Auth 里创建你的管理员账号（邮箱密码）。
-- 2. 查到该用户的 uuid 之后，执行：
-- insert into public.app_admins (user_id, email)
-- values ('你的-auth-user-id', '你的管理员邮箱');
