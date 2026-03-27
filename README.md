# What to eat?

一个用来解决“这顿吃什么”的轻产品。

它不是点评网站，也不是外卖平台，而是一个围绕个人真实吃饭决策搭起来的选择器：先缩小范围，再抽一个结果，吃完以后顺手记下来，慢慢把自己的美食地图养出来。

## Product

`What to eat?` 适合这样的使用场景：

- 两个人反复纠结这顿到底吃什么
- 明明收藏了一堆店，但临到吃饭还是选不出来
- 想把常去的区域和店铺整理成自己的决策库
- 想保留一点随机感，但又不希望总抽到不想吃的

这个产品的目标不是给你“搜索答案”，而是帮你更快做决定。

## Core Flow

产品现在分成 3 个视图：

- `Pick`
  先选区域、预算和偏好，然后抽一个结果
- `Journal`
  记录真正吃过的这顿，慢慢形成自己的吃饭历史
- `Manage`
  维护区域、美食和基础资料

最推荐的使用路径是：

1. 打开 `Pick`
2. 选区域、预算或偏好
3. 点击 `开始抽签`
4. 如果结果合适，直接去吃
5. 吃完以后在结果区点 `记进日记`

## Current Features

- 区域筛选
- 预算筛选
- 偏好筛选
- 随机抽签
- 避开最近重复
- 按评分和复吃权重做推荐倾斜
- 吃完后记录体验分和备注
- 管理员在线新增 / 编辑 / 删除区域和美食
- Supabase 持久化
- GitHub Pages 外网访问
- 本地回退模式

## Product Rules

有几个关键规则，使用前最好知道：

- 抽签结果不会展示其它未抽中的候选，页面只保留最终答案
- `记进日记` 只用于“真的吃了”的结果
- 只有管理员账号登录后，线上编辑才会永久写进 Supabase
- 未登录或无权限时，页面默认只读
- 如果 Supabase 连接异常，页面会回退到本地模式

## Admin Editing

后台管理的设计原则是“新增”和“编辑”明确分开：

- `新增模式`
  保存会新建一条数据
- `编辑模式`
  只有点了库存卡片之后，保存才会覆盖那一条

当前支持维护的信息包括：

- 区域名称
- 美食名称
- 标签 / 场景偏好
- 评分
- 复吃权重
- 预算层级
- 营业时间
- 地图链接
- 备注

## Stack

当前版本的实现方式：

- 前端：原生 HTML / CSS / JavaScript
- 部署：GitHub Pages
- 数据：Supabase
- 鉴权：Supabase Auth
- 权限控制：Supabase RLS

这样做的好处是简单、便宜、易维护，也适合你这种持续边做边改的小产品。

## Files

- `index.html`
  页面结构
- `styles.css`
  页面样式
- `app.js`
  交互逻辑、抽签逻辑、数据读写
- `app-config.js`
  Supabase 配置
- `supabase-schema.sql`
  数据表和权限策略
- `.nojekyll`
  GitHub Pages 静态部署配置

## Run And Deploy

### 1. 配置 Supabase

先在 Supabase 项目里完成这些事：

1. 执行 `supabase-schema.sql`
2. 创建管理员账号
3. 把管理员账号写入 `app_admins`
4. 在 `app-config.js` 中填入：
   - `useSupabase: true`
   - `supabaseUrl`
   - `supabaseAnonKey`

### 2. 发布到 GitHub Pages

把项目推到 GitHub 仓库根目录，然后开启 Pages：

1. 仓库 `Settings`
2. `Pages`
3. `Deploy from a branch`
4. 选择 `main` 和 `/ (root)`

之后项目就会通过 GitHub Pages 自动发布。

## Iteration Workflow

这个项目当前最顺手的更新方式就是：

```bash
cd /Users/chazz/python项目/idea/这顿吃什么
git pull --rebase origin main
git add .
git commit -m "Describe the change"
git push origin main
```

推上去以后，GitHub Pages 会自动重新部署。

如果你只是改前端界面或交互，这就是最便捷的日常流程。

## Roadmap

接下来最值得继续做的方向：

- `Pick` 页进一步压缩筛选层级
- `Journal` 支持手动补录一顿饭
- 支持上传门店图片
- 增加人均、距离、营业状态
- 增加双人偏好匹配
- 增加“最近没吃过”的探索推荐

## Status

当前版本已经具备一个完整小产品的基础能力：

- 能公开访问
- 能在线抽签
- 能持续维护数据
- 能记录真实吃饭历史

接下来优化重点应该放在体验和产品节奏，而不是继续堆功能。
