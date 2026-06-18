# giscus 评论系统迁移实施计划

> 日期：2026-06-15
> 原系统：Gitalk（基于 GitHub Issues OAuth App）
> 目标系统：giscus（基于 GitHub Discussions API）

---

## 一、现有代码分析

### 1.1 评论系统涉及的文件

| 文件 | 作用 | 改动 |
|------|------|------|
| `docs/.vitepress/theme/components/Comments.vue` | 评论组件主体 | 🔄 完全重写 |
| `docs/.vitepress/theme/Layout.vue` | 在文章页引入 `<Comments>` | ✅ 无需改动 |
| `docs/.vitepress/theme/index.ts` | 全局注册 Comments 组件 | ✅ 无需改动 |
| `docs/.vitepress/theme/custom.css` | 文章样式（无 Gitalk 相关代码） | ✅ 无需改动 |

### 1.2 现有 Gitalk 代码结构（Comments.vue）

```
<script setup>
  ↑ GITALK_CONFIG 对象（含 clientSecret）
  ↑ getTheme() — 检测 data-theme
  ↑ loadGitalk() — 动态加载 CDN + 渲染
  ↑ loadCSS/loadScript — 辅助加载
  ↑ onMounted + watch theme
</script>

<template>
  <div class="comments-section">
    <h2>💬 评论</h2>
    <div ref="containerRef"> ← Gitalk 挂载点
</template>

<style> (非 scoped, ~135 行)
  ↑ 暗色主题 Gitalk UI 覆盖 * 21 条规则
</style>
```

### 1.3 集成方式

```
Layout.vue:
  import Comments from './components/Comments.vue'
  <Comments v-if="isPost" />

theme/index.ts:
  import Comments from './components/Comments.vue'
  enhanceApp({ app }) {
    app.component('Comments', Comments)
  }
```

---

## 二、giscus 技术方案

### 2.1 与 Gitalk 的本质区别

| | Gitalk | giscus |
|---|--------|--------|
| **加载方式** | JS 动态创建实例 `new Gitalk({...})` | HTML `<script>` 标签属性配置 |
| **配置方式** | JavaScript 对象 | `data-*` HTML 属性 |
| **密钥** | 🔴 `clientSecret` 在 JS 中 | ✅ 无密钥 |
| **OAuth** | App Secret 前端直接使用 | giscus 服务端代理 |
| **数据存储** | GitHub Issues | GitHub Discussions |
| **暗色主题** | 手动 CSS 覆盖 | `data-theme` 属性切换 |
| **仓库要求** | 无特殊要求 | 需启用 Discussions + 安装 giscus App |

### 2.2 giscus 组件结构

```html
<!-- giscus 是纯 HTML/CSS/JS，无 Vue 运行时依赖 -->
<script src="https://giscus.app/client.js"
  data-repo="01-xzl/Kether"
  data-repo-id="R_kgDOXXXXXX"
  data-category="Announcements"
  data-category-id="DIC_kwDOXXXXXX"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="top"
  data-theme="preferred_color_scheme"
  data-lang="zh-CN"
  data-loading="lazy"
  crossorigin="anonymous"
  async>
</script>
```

giscus 脚本会自动在 `<script>` 标签所在位置渲染评论 widget。**不需要 new 实例、不需要 ref 容器、不需要手动挂载。**

### 2.3 主题切换策略

giscus 支持动态主题切换，通过 `iframe` 的 `postMessage` 通信：

```ts
// 发送主题切换消息
function setGiscusTheme(theme: string) {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (!iframe) return
  iframe.contentWindow?.postMessage(
    { giscus: { setConfig: { theme } } },
    'https://giscus.app'
  )
}
```

- 暗色主题推荐值：`dark` 或 `transparent_dark`（后者无背景，更适配网站）
- 亮色主题：`light` 或 `preferred_color_scheme`

### 2.4 用户配置步骤（一次性）

| 步骤 | 操作 |
|------|------|
| 1 | 安装 giscus GitHub App：https://github.com/apps/giscus → 授权到 `01-xzl/Kether` |
| 2 | 仓库 Settings → Features → **Enable Discussions** |
| 3 | 创建一个 Discussions 分类（如 "Comments" 或 "Announcements"） |
| 4 | 访问 https://giscus.app/ → 填入 `01-xzl/Kether` → 自动生成配置 |
| 5 | 复制 `data-repo-id`、`data-category`、`data-category-id` |

---

## 三、代码改动方案

### 3.1 改动文件清单

| # | 文件 | 改动类型 | 描述 |
|---|------|----------|------|
| 1 | `Comments.vue` | 🔄 完全重写 | Gitalk 逻辑全部替换为 giscus |
| 2 | `Layout.vue` | ✅ 不变 | 接口保持 `<Comments v-if="isPost" />` |
| 3 | `theme/index.ts` | ✅ 不变 | 组件注册不变 |
| 4 | `custom.css` | ✅ 不变 | 无 Gitalk 样式需清理（样式在 Comments.vue 中） |

### 3.2 新 Comments.vue 设计

```vue
<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue'
import { useData } from 'vitepress'

// ===== giscus 配置 =====
const GISCUS_CONFIG = {
  repo: '01-xzl/Kether' as `${string}/${string}`,
  repoId: 'R_kgDOXXXXXX',           // ← 用户从 giscus.app 获取
  category: 'Announcements',         // ← 用户选择的分类名
  categoryId: 'DIC_kwDOXXXXXX',     // ← 用户从 giscus.app 获取
  mapping: 'pathname' as const,
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top' as const,
  lang: 'zh-CN',
  loading: 'lazy' as const,
}

const { page } = useData()

function getGiscusTheme(): string {
  // transparent_dark: 透明背景暗色 → 与网站毛玻璃风格融合更好
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'dark' ? 'transparent_dark' : 'light'
}

function loadGiscus() {
  // 防止重复加载
  if (document.querySelector('iframe.giscus-frame')) return

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', GISCUS_CONFIG.repo)
  script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId)
  script.setAttribute('data-category', GISCUS_CONFIG.category)
  script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId)
  script.setAttribute('data-mapping', GISCUS_CONFIG.mapping)
  script.setAttribute('data-strict', GISCUS_CONFIG.strict)
  script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled)
  script.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata)
  script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition)
  script.setAttribute('data-theme', getGiscusTheme())
  script.setAttribute('data-lang', GISCUS_CONFIG.lang)
  script.setAttribute('data-loading', GISCUS_CONFIG.loading)
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true
  document.getElementById('giscus-container')?.appendChild(script)
}

function sendThemeToGiscus() {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (!iframe) return
  iframe.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: getGiscusTheme() } } },
    'https://giscus.app'
  )
}

onMounted(() => {
  nextTick(() => loadGiscus())
})

// 监听主题切换 → 通知 giscus iframe 同步
watch(
  () => document.documentElement.getAttribute('data-theme'),
  () => sendThemeToGiscus()
)
</script>

<template>
  <div class="comments-section">
    <h2 class="comments-title">💬 评论</h2>
    <div id="giscus-container" class="giscus-container"></div>
    <!-- 未配置提示 -->
    <div v-if="GISCUS_CONFIG.repoId === 'R_kgDOXXXXXX'" class="giscus-placeholder">
      <p>💬 评论系统尚未配置</p>
      <p>请访问 <a href="https://giscus.app/" target="_blank">giscus.app</a> 获取配置信息</p>
      <p>然后修改 <code>docs/.vitepress/theme/components/Comments.vue</code> 中的 <code>GISCUS_CONFIG</code></p>
    </div>
  </div>
</template>

<style scoped>
.comments-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.comments-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.giscus-container {
  margin: 0 auto;
  max-width: 100%;
  min-height: 100px;
}

.giscus-placeholder {
  padding: 2rem;
  text-align: center;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 2;
}

.giscus-placeholder code {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg-mute);
  font-size: 0.85em;
  color: var(--vp-c-brand-1);
}

.giscus-placeholder a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.giscus-placeholder a:hover {
  text-decoration: underline;
}
</style>
```

### 3.3 对比：Gitalk vs giscus 代码量

| 项目 | Gitalk | giscus | 变化 |
|------|--------|--------|------|
| Script 逻辑 | ~43 行 | ~42 行 | 相当 |
| Template | 7 行 | 10 行 | +3 (placeholder) |
| Style (暗色覆盖) | ~135 行 | 0 行 | **-135 行** ✅ |
| **总行数** | ~245 行 | ~110 行 | **-55%** |
| **密钥暴露** | 🔴 `clientSecret` | ✅ 无 | **安全** |

---

## 四、可行性评估

### 4.1 技术可行性：✅ 完全可行

| 维度 | 评估 |
|------|------|
| **Vue/VitePress 兼容** | ✅ giscus 是纯 HTML/JS，不依赖 Vue，SSR 安全 |
| **SSR 安全** | ✅ `onMounted` 保护，仅客户端执行 |
| **主题切换** | ✅ `postMessage` API + `transparent_dark` 主题 |
| **移动端适配** | ✅ giscus 自带响应式 |
| **构建兼容** | ✅ 不经过 Vite 打包，运行时动态加载 CDN |
| **GitHub Pages** | ✅ 纯静态，无额外依赖 |

### 4.2 风险点：🟡 极低

| 风险 | 概率 | 缓解措施 |
|------|------|----------|
| giscus.app 服务宕机 | 🟡 极低 | GitHub 官方赞助项目，高可用 |
| Discussions API 变更 | 🟡 极低 | giscus 维护者会跟进适配 |
| `repo-id/category-id` 获取困难 | 🟡 低 | giscus.app 网页自动生成，无需手写 API |

### 4.3 改动范围：🟢 极小

- **仅修改 1 个文件**：`Comments.vue`（重写）
- **3 个文件无需改动**：`Layout.vue`、`index.ts`、`custom.css`
- **暗色 CSS 全部删除**：从 ~135 行 → 0 行（giscus 内置处理）
- **无破坏性改动**：接口保持不变（`<Comments v-if="isPost" />`）

---

## 五、实施步骤

| 步骤 | 操作 | 执行者 |
|------|------|--------|
| 1 | 阅读本计划并理解改动 | 用户 |
| 2 | 启用 Discussions + 安装 giscus App + 获取配置 ID | 用户（手动） |
| 3 | 用户提供 `repo-id`、`category`、`category-id` | 用户 → AI |
| 4 | AI 重写 Comments.vue | AI（自动） |
| 5 | 构建验证 `npm run docs:build` | AI（自动） |
| 6 | Git commit + push | AI（自动） |
| 7 | 线上验证评论功能 | 用户（手动） |

---

## 六、结论

**强烈建议执行迁移。** 理由总结：

| 维度 | 收益 |
|------|------|
| 🔒 安全性 | 消除 `clientSecret` 前端泄露风险 |
| 🧹 代码质量 | 删除 135 行暗色 CSS hack，代码量 -55% |
| 🔧 维护性 | giscus 持续维护，Gitalk 已停更 |
| 🎨 主题适配 | `transparent_dark` 天然融合毛玻璃风格 |
| 📦 改动量 | 仅 1 个文件，无破坏性改动 |