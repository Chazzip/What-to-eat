# 今晚吃什么 · Supabase 版

这个目录现在已经按静态前端 + Supabase 的方式组织好了：

- `index.html`: 页面入口
- `styles.css`: 页面样式
- `app.js`: 抽签、筛选、在线管理、管理员登录、晚饭日记
- `app-config.js`: 你的 Supabase 配置
- `supabase-schema.sql`: 数据表、RLS 策略、默认种子数据

## 你要做的事

1. 在 Supabase 新建一个项目。
2. 打开 SQL Editor，执行 [`supabase-schema.sql`](/Users/chazz/python项目/idea/这顿吃什么/supabase-schema.sql)。
3. 在 Supabase Auth 里创建一个邮箱密码用户，作为管理员。
4. 把这个管理员用户的 `uuid` 写进 `public.app_admins` 表。
5. 编辑 [`app-config.js`](/Users/chazz/python项目/idea/这顿吃什么/app-config.js)，填入：
   - `useSupabase: true`
   - `supabaseUrl`
   - `supabaseAnonKey`
6. 把这个目录推到 GitHub 仓库，开启 GitHub Pages。

## GitHub Pages 部署

最简单的方式是把这个目录内容放到仓库根目录，然后在仓库设置里：

1. 进入 `Settings -> Pages`
2. `Source` 选择你的分支，比如 `main`
3. `Folder` 选 `/ (root)`
4. 保存后等待生成公开地址

如果你想绑定自定义域名，再去 GitHub Pages 设置里配置自定义域名即可。

## 安全边界

- `Anon Key` 可以放前端，它不是管理员密钥。
- 绝对不要把 `service_role key` 写进前端仓库。
- 现在的 RLS 是：
  - 所有人可读 `areas`、公开的 `foods`、`meal_logs`
  - 只有 `app_admins` 里的账号能增删改

## 当前已经做进页面的功能

- 随机抽签
- 按区域、预算、标签、心情筛选
- 避开最近吃过或刚抽中过的
- 按评分和复吃权重调整推荐概率
- 管理员在线新增/编辑/删除区域和美食
- 记录“真的吃了”的晚饭日记
- 导出当前数据 JSON
- Supabase 失效时自动回退到本地模式

## 你后面最值得继续加的

- 图片上传到 Supabase Storage
- 店铺营业状态和休息日
- 人均价格和距离
- 双人偏好匹配
- 不同时间段自动切换推荐策略
- “这周还没吃过”的补全推荐
