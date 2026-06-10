# 类 Lin66.site 博客搭建流程计划

> 本计划专注于技术实现流程，暂不涉及艺术设计细节
> 基于所分析博客的技术栈：VitePress + GitHub Pages + Gitalk + 自定义前端增强

---

## 第一阶段：项目初始化

### 1.1 环境准备
- [ ] 安装 Node.js（≥18 LTS）
- [ ] 安装 Git
- [ ] 注册 GitHub 账号（已有则复用）
- [ ] 配置 SSH Key 关联 GitHub

### 1.2 创建项目骨架
- [ ] 使用 VitePress 官方脚手架初始化项目
  ```
  npm create vitepress@latest
  ```
  - 选择自定义主题模板
  - 站点名称、描述按照需求填写
- [ ] 进入项目目录并安装依赖
  ```
  cd project-name
  npm install
  ```
- [ ] 初始化 Git 仓库
  ```
  git init
  git add .
  git commit -m "init: VitePress project scaffold"
  ```

### 1.3 目录结构确认
VitePress 默认生成结构，确认以下目录存在：
```
project-root/
├── docs/                  # 文档源文件目录
│   ├── .vitepress/        # 配置与主题
│   │   ├── config.mts     # 站点配置
│   │   └── theme/         # 自定义主题
│   │       ├── index.ts   # 主题入口
│   │       └── ...
│   ├── public/            # 静态资源（图片、字体等）
│   ├── posts/             # 博客文章 Markdown
│   └── index.md           # 首页
├── package.json
└── ...
```

---

## 第二阶段：基础配置

### 2.1 站点配置文件（.vitepress/config.mts）
- [ ] 设置站点元信息（title, description, lang）
- [ ] 配置 base 路径（若部署到 GitHub Pages 子路径时需要）
- [ ] 配置导航栏（nav）
- [ ] 配置社交链接（socialLinks）
- [ ] 配置搜索功能（内置本地搜索或 Algolia）
- [ ] 配置 vite 插件（如需要，例如自定义字体处理）
- [ ] 配置构建输出目录

### 2.2 GitHub Pages 部署配置
- [ ] 在仓库 Settings → Pages 中开启 GitHub Pages
- [ ] 选择部署分支（通常是 gh-pages）
- [ ] 在 VitePress 配置中设置正确的 base 路径
- [ ] 配置 GitHub Actions 自动化部署（.github/workflows/deploy.yml）：
  ```yaml
  # 推送到 main 分支时自动构建并部署
  # 使用 actions/setup-node + npm ci + npm run docs:build
  # 使用 peaceiris/actions-gh-pages 部署到 gh-pages 分支
  ```
- [ ] 配置 Cloudflare（可选）：
  - 在 Cloudflare 添加站点域名
  - 设置 CNAME 记录指向 GitHub Pages 域名
  - 开启 SSL/TLS

### 2.3 本地开发服务器
- [ ] 配置启动脚本（package.json 中添加 scripts）
- [ ] 运行 `npm run docs:dev` 启动本地开发
- [ ] 确认实时热重载正常工作

---

## 第三阶段：文章内容管理

### 3.1 文章目录组织
- [ ] 在 `docs/` 下按分类创建子目录，例如：
  ```
  docs/
  ├── posts/
  │   ├── first-post.md
  │   ├── category-a/
  │   │   └── post-example.md
  │   └── ...
  └── tags/
      └── index.md
  ```

### 3.2 Frontmatter 格式规范
- [ ] 每篇文章头部定义标准 Frontmatter：
  ```yaml
  ---
  title: 文章标题
  date: YYYY-MM-DD
  tags:
    - 标签1
    - 标签2
  description: 文章摘要（可选）
  cover: /path/to/cover.jpg（可选）
  pinned: true/false（可选，是否置顶）
  ---
  ```

### 3.3 标签系统实现
- [ ] 在 `docs/tags/index.md` 中列出所有标签
- [ ] 编写自动生成标签页面的逻辑（可用 VitePress 的 useData 或自定义集合）
- [ ] 确保文章内标签可点击跳转到对应标签页面

### 3.4 分页功能
- [ ] 实现文章列表分页
  - 方案 A：VitePress 插件（如 vitepress-plugin-pagefind 或自定义）
  - 方案 B：手动在主题中实现分页逻辑
- [ ] 限制每页文章数量（例如 5 篇/页）
- [ ] 添加上一页/下一页按钮 + 页码导航

---

## 第四阶段：主题开发

### 4.1 自定义主题入口
- [ ] 创建 `.vitepress/theme/index.ts`
- [ ] 引入 Vue 组件覆盖默认布局
- [ ] 定义 Layout.vue 作为根组件

### 4.2 核心布局组件开发
#### 4.2.1 导航栏（NavBar）
- [ ] 实现固定顶部导航栏（position: sticky）
- [ ] 包含 Logo 占位 + 菜单项（首页、标签、归档等）
- [ ] 移动端汉堡菜单 + 下拉面板
- [ ] 搜索按钮（可省略具体搜索实现，先保留UI入口）

#### 4.2.2 Banner / 头部区域
- [ ] 实现全宽 Banner 区域（高度约 75vh）
- [ ] 背景图片展示（预置 placeholder 图片）
- [ ] 首页显示欢迎文字 + 座右铭 + 头像 + 社交链接
- [ ] 文章页显示文章标题 + 发布时间 + 字数统计
- [ ] Canvas 波浪动画（底部叠加层）

#### 4.2.3 文章列表组件
- [ ] 文章卡片设计：
  - 标题（带链接）
  - 元信息：日期 + 阅读时间/字数
  - 标签列表
  - 摘要/节选（使用 Frontmatter description 或自动截取）
  - 左侧装饰色条
- [ ] 卡片 hover 交互效果
- [ ] 置顶文章标记（小图钉图标）

#### 4.2.4 文章内容页
- [ ] Markdown 渲染样式覆盖
- [ ] 标题自动锚点（header anchor links）
- [ ] 代码块样式：
  - 顶部装饰条 + 语言标签
  - 复制按钮
  - 行号（可选）
- [ ] 图片灯箱功能
- [ ] 表格样式
- [ ] 引用块样式
- [ ] 提示块样式（tip/info/warning/danger）

#### 4.2.5 页面底部
- [ ] 页脚区域（毛玻璃效果）
- [ ] 版权信息（年份 + 作者名）
- [ ] Powered by 链接（GitHub Pages, Cloudflare 等）
- [ ] Logo 或品牌标记

#### 4.2.6 浮动元素
- [ ] 回到顶部按钮
- [ ] 滚动到一定位置后渐入显示

### 4.3 分页组件
- [ ] 上一页 / 下一页箭头按钮
- [ ] 页码数字显示
- [ ] 当前页高亮

### 4.4 搜索功能（可选但推荐）
- [ ] 方案一：VitePress 内置本地搜索
  - 在 config 中配置 `themeConfig.search.provider: 'local'`
- [ ] 方案二：自定义搜索弹窗
  - 弹窗布局 + 背景遮罩
  - 搜索输入框
  - 搜索结果列表（标题 + 链接）

---

## 第五阶段：主题切换系统

### 5.1 CSS 变量体系
- [ ] 在 `:root` 中定义亮色模式所有 CSS 变量
- [ ] 在 `html[theme=dark]` 中定义暗色模式所有 CSS 变量
- [ ] 关键变量分类：
  - 颜色变量（背景、前景、文字、强调色、金色等）
  - 毛玻璃变量（模糊值）
  - 图片亮度变量
  - 阴影变量
  - 装饰图片变量（SVG 图案路径）
  - 图标颜色变量

### 5.2 主题切换逻辑
- [ ] 实现三种模式：亮色 / 暗色 / 跟随系统
- [ ] 使用 localStorage 持久化用户选择
- [ ] 在 `<head>` 中插入内联脚本预检测（防止闪烁）
  - 检查 localStorage 中的主题值
  - 若无则检测 `prefers-color-scheme`
  - 在 `<html>` 上添加对应的 class 或 attribute

### 5.3 主题切换 UI
- [ ] 主题选择下拉框（亮色 / 暗色 / 跟随系统）
- [ ] 切换时平滑过渡

---

## 第六阶段：评论系统

### 6.1 Gitalk 集成
- [ ] 在 GitHub 注册 OAuth App（获取 Client ID 和 Client Secret）
- [ ] 在页面中引入 Gitalk：
  ```html
  <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
  <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
  ```
- [ ] 创建 Gitalk 实例：
  ```js
  const gitalk = new Gitalk({
    clientID: 'xxx',
    clientSecret: 'xxx',
    repo: 'repo-name',
    owner: 'owner-name',
    admin: ['admin-name'],
    id: window.location.pathname, // 唯一标识
    distractionFreeMode: false
  })
  ```
- [ ] 将评论组件挂载到文章页底部

### 6.2 评论主题适配
- [ ] Gitalk 样式与网站主题联动
- [ ] 暗色/亮色模式下评论框样式不同

---

## 第七阶段：附加功能

### 7.1 背景音乐
- [ ] 引入背景音乐音频文件（mp3/ogg 格式）
- [ ] 创建隐藏的 `<audio>` 标签 + 循环播放
- [ ] 播放/暂停控制按钮
- [ ] 注意：大部分浏览器需要用户交互才能播放

### 7.2 加载动画（Splash）
- [ ] 实现全屏加载覆盖层
- [ ] SVG 装饰动画（发光路径呼吸效果）
- [ ] 页面加载完成后淡出消失

### 7.3 烟花特效
- [ ] Canvas 绘制烟花粒子系统
- [ ] 用户点击/页面加载时触发
- [ ] 可设置开关

### 7.4 Spine 角色（可选，高级功能）
- [ ] 引入 Spine Player 库
- [ ] 准备 Spine 动画资源（.skel/.json + .atlas + 图片）
- [ ] 角色容器布局（右下角固定定位）
- [ ] 播放控制（播放/暂停、速度、动画切换、皮肤切换）
- [ ] 对话气泡功能

---

## 第八阶段：性能优化与部署

### 8.1 构建前检查
- [ ] 移除未使用的 CSS
- [ ] 图片资源压缩
- [ ] 字体子集化（仅包含需要的字符）
- [ ] 确保所有资源路径正确
- [ ] 检查控制台无报错

### 8.2 生产构建
- [ ] 运行 `npm run docs:build`
- [ ] 检查 `docs/.vitepress/dist/` 输出目录
- [ ] 本地预览构建结果：
  ```
  npx vitepress preview docs
  ```

### 8.3 部署到 GitHub Pages
- [ ] 推送代码到 GitHub 仓库
- [ ] 确认 GitHub Actions 自动部署成功
- [ ] 访问 GitHub Pages 域名确认站点正常
- [ ] 配置自定义域名（如有）

### 8.4 Cloudflare 配置（可选）
- [ ] 添加域名到 Cloudflare
- [ ] 配置 DNS 解析
- [ ] 开启 Cloudflare 代理（橙色云朵）
- [ ] 配置 SSL/TLS 加密模式
- [ ] 配置页面缓存规则

---

## 第九阶段：持续维护

### 9.1 日常维护清单
- [ ] 撰写新文章并推送
- [ ] 定期备份 GitHub Issues（Gitalk 评论数据）
- [ ] 更新依赖版本（VitePress 自身更新）
- [ ] 检查评论系统是否正常工作

### 9.2 潜在扩展方向
- [ ] RSS Feed 支持
- [ ] 站点地图（sitemap.xml）
- [ ] SEO 优化（Open Graph / Twitter Card）
- [ ] 站点统计（Google Analytics / Umami / Plausible）
- [ ] PWA 支持（Service Worker + manifest.json）
- [ ] 多语言支持（i18n）

---

## 附录：关键命令速查

```bash
# 初始化项目
npm create vitepress@latest
# 启动开发服务器
npm run docs:dev
# 生产构建
npm run docs:build
# 本地预览
npx vitepress preview docs
# 安装依赖
npm install
# 更新依赖
npm update
```

---

*文档结束*