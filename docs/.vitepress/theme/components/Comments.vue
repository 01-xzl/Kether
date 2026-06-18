<script setup lang="ts">
import { onMounted, watch, nextTick } from 'vue'
import { useData } from 'vitepress'

// ===== giscus 配置 =====
const GISCUS_CONFIG = {
  repo: '01-xzl/Kether' as `${string}/${string}`,
  repoId: 'R_kgDOS2g5XQ',
  category: 'Announcements',
  categoryId: 'DIC_kwDOS2g5Xc4C_Bkh',
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
  if (typeof window === 'undefined') return 'light'
  const attr = document.documentElement.getAttribute('data-theme')
  // transparent_dark: 透明背景暗色 → 与网站毛玻璃风格融合
  return attr === 'dark' ? 'transparent_dark' : 'light'
}

function loadGiscus() {
  if (typeof window === 'undefined') return
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
  () => {
    if (typeof window === 'undefined') return 'light'
    return document.documentElement.getAttribute('data-theme')
  },
  () => sendThemeToGiscus()
)
</script>

<template>
  <div class="comments-section">
    <h2 class="comments-title">💬 评论</h2>
    <div id="giscus-container" class="giscus-container"></div>
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
</style>
