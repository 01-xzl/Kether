# AGENTS.md — project001_ideas / lin66.blog

> 评估日期：2026-06-11
> 项目阶段：1-4 阶段完成，5-9 阶段待推进

---

## 项目概要

基于 **VitePress v1.6.4 + Vue 3.5** 构建的个人博客，灵感来源于 [lin66.site](https://lin66.site/)。采用完整自定义主题（6 个 Vue 组件 + custom.css），覆盖默认 VitePress 布局。目标部署到 GitHub Pages（GitHub Actions 自动化）。

---

## 参考站点 (lin66.site) 对照

> 来源：`设计分析/lin66.blog_风格分析.md`（因网络限制无法直接访问，基于离线分析文档）

| 特性 | lin66.site | 本项目状态 |
|------|-----------|-----------|
| 框架 | VitePress 1.6.3 | ✅ 1.6.4 |
| 托管 | GitHub Pages + Cloudflare | ⚠️ Pages 就绪，Cloudflare 可选 |
| 毛玻璃导航 | `backdrop-filter: blur(15px)` | ✅ `blur(12px)` |
| 自定义字体 | Blueaka / Blueaka_Bold (手绘风) + JetBrains Mono | ❌ 未引入 |
| 自定义图标 | iconfont (社交/UI图标) | ❌ 用 emoji 占位 |
| 主题切换 | 亮色(Arona)/暗色(Plana)/跟随系统，两套完整配色 | 🔜 第5阶段 |
| Canvas 波浪 | 实时 Canvas 波浪动画 | ⚠️ 仅有静态 SVG 波浪装饰 |
| Splash 加载页 | SVG 发光路径呼吸动画 | ❌ 未在计划中 |
| 评论系统 | Gitalk (GitHub Issues OAuth) | 🔜 第6阶段 |
| 图片灯箱 | Fancybox UI | ❌ 未在计划中 |
| 背景音乐 | BGM 播放器 | 🔜 第7阶段 |
| 烟花特效 | Canvas 烟花粒子 | 🔜 第7阶段 |
| Spine 角色 | 右下角可交互 2D 骨骼动画 | 🔜 第7阶段 |
| 配色风格 | ACG/二次元向，亮蓝→暗紫 | ⚠️ 使用 VitePress 默认变量 |

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | VitePress 1.6.4 (Vue 3 驱动) |
| 前端 | Vue 3.5 SFC（Composition API + `<script setup>`） |
| 样式 | CSS 自定义属性 + Scoped CSS，毛玻璃(backdrop-filter)贯穿全局 |
| 托管 | GitHub Pages (GitHub Actions 自动部署) |
| 搜索 | VitePress 内置本地搜索 (`provider: 'local'`) |
| 语言 | zh-CN |

---

## 目录结构

```
project001_ideas/
├── .github/workflows/deploy.yml          # GitHub Actions 自动部署
├── docs/                                 # VitePress 文档根
│   ├── index.md                          # 首页（home layout）
│   ├── posts/                            # 文章目录
│   │   ├── index.md                      # 文章列表页
│   │   ├── posts.data.ts                 # createContentLoader 数据层
│   │   ├── life/hello-blog.md            # 生活类示例
│   │   └── tech/                         # 技术类
│   │       ├── css-glassmorphism.md
│   │       └── vitepress-build-guide.md  # 置顶文章
│   ├── tags/index.md                     # 标签浏览页
│   └── .vitepress/
│       ├── config.mts                    # 站点配置
│       └── theme/                        # 自定义主题
│           ├── index.ts                  # 主题入口（注册全局组件）
│           ├── Layout.vue                # 根布局
│           ├── custom.css                # 文章内容全局样式覆盖
│           ├── shims.d.ts                # TS 类型声明
│           └── components/
│               ├── NavBar.vue            # 毛玻璃固定导航
│               ├── Banner.vue            # 自适应头部 + SVG 波浪
│               ├── AppFooter.vue         # 毛玻璃页脚
│               ├── BackToTop.vue         # 回到顶部按钮
│               ├── PostList.vue          # 文章列表 + 分页(5篇/页)
│               └── TagList.vue           # 标签云 + 点击筛选
├── 设计分析/                              # 博客设计与流程文档
│   ├── lin66.blog_搭建流程计划.md         # 9阶段搭建计划
│   ├── lin66.blog_搭建计划_可行性分析.md    # 可行性评估
│   ├── lin66.blog_风格分析.md             # lin66.site 设计风格分析
│   └── 项目开发进度.md                    # 开发进度追踪
├── 素材仓库/                              # 原始素材文档
├── package.json
└── .gitignore
```

---

## 开发进度总览

| 阶段 | 名称 | 状态 | 完成度 |
|------|------|------|--------|
| 一 | 项目初始化 | ✅ 完成 | 100% |
| 二 | 基础配置 | ✅ 完成 | 100% |
| 三 | 文章内容管理 | ✅ 完成 | 100% |
| 四 | 主题开发 | ✅ 完成 | 100% |
| 五 | 主题切换系统 | 🔜 待开始 | 0% |
| 六 | 评论系统 | 🔜 待开始 | 0% |
| 七 | 附加功能 | 🔜 待开始 | 0% |
| 八 | 性能优化与部署 | 🔜 待开始 | 0% |
| 九 | 持续维护 | 🔜 待开始 | 0% |

### 已完成详情

**阶段一（项目初始化）**：Node.js v24.13.0 / Git v2.52.0 / 手动搭建 VitePress 骨架 / `root-commit 853864a`

**阶段二（基础配置）**：`config.mts` 站点元信息 + 导航 + 本地搜索 / `.github/workflows/deploy.yml`（push main → build → deploy Pages）/ `docs:dev/build/preview` 脚本

**阶段三（内容管理）**：
- `posts/posts.data.ts` 用 `createContentLoader` 收集所有 frontmatter → 排序（置顶优先 + 日期倒序）
- `PostList.vue` 客户端分页 (5篇/页) + 智能页码（含省略号）
- `TagList.vue` 标签云 + 点击筛选文章列表
- 3 篇示例文章（含 frontmatter: title/date/tags/description/pinned）

**阶段四（主题开发）**：6 个自定义 Vue 组件 + `custom.css` 全局样式覆盖，完全替代默认 VitePress 导航/页脚。

---

## 下一步行动（第 5 阶段：主题切换）

1. CSS 自定义属性体系：`:root` 亮色 + `html[data-theme="dark"]` 暗色（参考 lin66 的 Arona/Plana 双配色方案）
2. 主题切换 Vue 组件（亮色/暗色/跟随系统 三模式）
3. `localStorage` 持久化用户选择
4. `<head>` 内联脚本预检测（防闪烁）

---

## 代码约定

- **Vue 组件**：`<script setup lang="ts">` + Scoped CSS，使用 Composition API
- **VitePress API**：`useData()` 获取 site/page/frontmatter，`createContentLoader` 读取文章元数据
- **样式**：优先使用 VitePress CSS 变量（`--vp-c-*`），覆盖集中在 `custom.css`
- **毛玻璃**：`backdrop-filter: blur(12px)` + `-webkit-backdrop-filter`，配合 `rgba(var(--vp-c-bg-raw), 0.72)` 半透明背景
- **响应式**：`@media (max-width: 768px)` 断点，移动端汉堡菜单
- **Frontmatter 规范**：
  ```yaml
  ---
  title: 文章标题
  date: YYYY-MM-DD
  tags: [标签1, 标签2]
  description: 文章摘要
  pinned: false
  ---
  ```
- **TypeScript**：`shims.d.ts` 声明 `.vue` 模块，`posts.data.ts` 导出 `Post` 接口
- **文件命名**：文章用 kebab-case，组件用 PascalCase

---

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run docs:dev` | 启动开发服务器 http://localhost:5173/ (HMR) |
| `npm run docs:build` | 生产构建 → `docs/.vitepress/dist/` |
| `npx vitepress preview docs` | 本地预览构建结果 |

启动命令：
```bash
cd E:\AA__projects\project001_ideas
npm run docs:dev
```

---

## 注意事项

- `base` 路径当前设为 `'/'`（根路径部署），若改为 `username.github.io/repo/` 需同步修改为 `'/repo/'`
- GitHub repository / SSH Key / GitHub Pages Settings 均待用户手动配置
- `docs/.vitepress/dist/` 和 `docs/.vitepress/cache/` 已在 `.gitignore` 中排除
- `Layout.vue` 通过 `:deep(.VPNav)` / `:deep(.VPFooter)` 隐藏 VitePress 默认导航和页脚
- 构建已验证通过（约 3-4s），无报错
- 无法直接访问 lin66.site（网络限制），所有参考信息来自 `设计分析/` 目录中的离线分析文档
