<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useData } from 'vitepress'

// ===== 配置区域 — 使用前请修改为你的 Gitalk 配置 =====
const GITALK_CONFIG = {
  clientID: 'YOUR_GITHUB_CLIENT_ID',       // 替换为你的 GitHub OAuth App Client ID
  clientSecret: 'YOUR_GITHUB_CLIENT_SECRET', // 替换为你的 GitHub OAuth App Client Secret
  repo: 'YOUR_REPO_NAME',                   // 替换为仓库名
  owner: 'YOUR_GITHUB_USERNAME',            // 替换为 GitHub 用户名
  admin: ['YOUR_GITHUB_USERNAME'],          // 管理员用户名列表
}

const { page, frontmatter } = useData()
const containerRef = ref<HTMLDivElement | null>(null)
const loaded = ref(false)

function getTheme() {
  if (typeof window === 'undefined') return 'light'
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'dark' ? 'dark' : 'light'
}

async function loadGitalk() {
  if (loaded.value || typeof window === 'undefined') return
  if (!containerRef.value) return

  // Check if credentials are configured
  if (GITALK_CONFIG.clientID.startsWith('YOUR_')) {
    containerRef.value.innerHTML = `<div class="gitalk-placeholder">
      <p>💬 评论系统尚未配置</p>
      <p>请在 <code>docs/.vitepress/theme/components/Comments.vue</code></p>
      <p>中修改 <code>GITALK_CONFIG</code> 为你的 GitHub OAuth App 信息。</p>
      <p><small>需要在 GitHub 创建一个 <a href="https://github.com/settings/applications/new" target="_blank">OAuth App</a></small></p>
    </div>`
    return
  }

  try {
    // Dynamically load Gitalk
    await loadCSS('https://unpkg.com/gitalk/dist/gitalk.css')
    await loadScript('https://unpkg.com/gitalk/dist/gitalk.min.js')

    const id = window.location.pathname.replace(/\/$/, '') || '/'
    const title = document.title || id

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Gitalk = (window as any).Gitalk
    if (!Gitalk) return

    const gitalk = new Gitalk({
      ...GITALK_CONFIG,
      id: id,
      title: title,
      distractionFreeMode: false,
      language: 'zh-CN',
    })

    gitalk.render(containerRef.value)
    loaded.value = true
  } catch (e) {
    console.error('Failed to load Gitalk:', e)
  }
}

function loadCSS(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`))
    document.head.appendChild(link)
  })
}

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`))
    document.body.appendChild(script)
  })
}

onMounted(() => {
  nextTick(() => {
    loadGitalk()
  })
})

// Watch for theme changes and update Gitalk
watch(() => getTheme(), () => {
  if (loaded.value) {
    // Gitalk doesn't support runtime theme switching natively
    // We use CSS overrides below instead
  }
})
</script>

<template>
  <div class="comments-section">
    <h2 class="comments-title">💬 评论</h2>
    <div ref="containerRef" class="gitalk-container"></div>
  </div>
</template>

<style>
/* ===== Gitalk 主题适配 ===== */

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

/* Placeholder style */
.gitalk-placeholder {
  padding: 2rem;
  text-align: center;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 2;
}

.gitalk-placeholder code {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg-mute);
  font-size: 0.85em;
  color: var(--vp-c-brand-1);
}

.gitalk-placeholder a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.gitalk-placeholder a:hover {
  text-decoration: underline;
}

.gitalk-container {
  margin: 0 auto;
  max-width: 100%;
}

/* Gitalk dark theme overrides */
html[data-theme="dark"] .gt-container {
  color: var(--vp-c-text-1);
}

html[data-theme="dark"] .gt-container .gt-header-textarea,
html[data-theme="dark"] .gt-container .gt-header-preview {
  background: var(--vp-c-bg-soft) !important;
  color: var(--vp-c-text-1) !important;
  border-color: var(--vp-c-divider) !important;
}

html[data-theme="dark"] .gt-container .gt-header-textarea:focus {
  background: var(--vp-c-bg) !important;
}

html[data-theme="dark"] .gt-container .gt-comment-content {
  background: var(--vp-c-bg-soft) !important;
  border-color: var(--vp-c-divider) !important;
}

html[data-theme="dark"] .gt-container .gt-comment-content:hover {
  box-shadow: 0 0 8px rgba(108, 99, 255, 0.15) !important;
}

html[data-theme="dark"] .gt-container .gt-comment-body {
  color: var(--vp-c-text-1) !important;
}

html[data-theme="dark"] .gt-container .gt-comment-username {
  color: var(--vp-c-brand-1) !important;
}

html[data-theme="dark"] .gt-container .gt-comment-date {
  color: var(--vp-c-text-3) !important;
}

html[data-theme="dark"] .gt-container .gt-comment-text {
  color: var(--vp-c-text-1) !important;
}

html[data-theme="dark"] .gt-container .gt-btn {
  background: var(--vp-c-bg-mute) !important;
  border-color: var(--vp-c-divider) !important;
  color: var(--vp-c-text-1) !important;
}

html[data-theme="dark"] .gt-container .gt-btn:hover {
  background: var(--vp-c-bg-soft) !important;
}

html[data-theme="dark"] .gt-container .gt-btn-preview {
  background: var(--vp-c-bg-soft) !important;
}

html[data-theme="dark"] .gt-container .gt-btn-public {
  background: var(--vp-c-brand-1) !important;
  border-color: var(--vp-c-brand-1) !important;
  color: white !important;
}

html[data-theme="dark"] .gt-container .gt-svg svg {
  fill: var(--vp-c-text-2) !important;
}

html[data-theme="dark"] .gt-container .gt-popup {
  background: var(--vp-c-bg) !important;
  border-color: var(--vp-c-divider) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
}

html[data-theme="dark"] .gt-container .gt-popup .gt-action {
  color: var(--vp-c-text-1) !important;
}

html[data-theme="dark"] .gt-container .gt-meta {
  border-bottom-color: var(--vp-c-divider) !important;
}

html[data-theme="dark"] .gt-container a.is--active {
  color: var(--vp-c-brand-1) !important;
}

html[data-theme="dark"] .gt-container .gt-comment-admin .gt-comment-content {
  background: var(--vp-c-bg-mute) !important;
  border-color: var(--vp-c-brand-3) !important;
}
</style>