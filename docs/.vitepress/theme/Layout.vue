<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import NavBar from './components/NavBar.vue'
import Banner from './components/Banner.vue'
import AppFooter from './components/AppFooter.vue'
import BackToTop from './components/BackToTop.vue'
import Comments from './components/Comments.vue'
import BgmPlayer from './components/BgmPlayer.vue'
import Fireworks from './components/Fireworks.vue'
import { computed, ref, onMounted } from 'vue'

const { page, frontmatter } = useData()
const { Layout: DefaultLayout } = DefaultTheme

const isPost = computed(() => {
  const path = page.value.relativePath
  if (!path) return false
  return path.startsWith('posts/') && path !== 'posts/index.md'
})

// ---- Splash 加载动画 ----
const showSplash = ref(true)
const splashFadeOut = ref(false)

function hideSplash() {
  splashFadeOut.value = true
  setTimeout(() => {
    showSplash.value = false
  }, 500) // 匹配 CSS transition
}

// ---- 代码块复制按钮 ----
function setupCopyButtons() {
  if (typeof window === 'undefined') return
  document.querySelectorAll('.vp-doc div[class*="language-"] pre').forEach(pre => {
    if (pre.querySelector('.copy-btn')) return
    const btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.textContent = '复制'
    btn.addEventListener('click', async () => {
      const code = pre.textContent || ''
      try {
        await navigator.clipboard.writeText(code)
        btn.textContent = '已复制'
        btn.classList.add('copied')
        setTimeout(() => {
          btn.textContent = '复制'
          btn.classList.remove('copied')
        }, 2000)
      } catch {
        btn.textContent = '复制失败'
        setTimeout(() => { btn.textContent = '复制' }, 2000)
      }
    })
    pre.style.position = 'relative'
    pre.appendChild(btn)
  })
}

onMounted(() => {
  setupCopyButtons()
  // 路由切换后重新注入
  if (typeof window !== 'undefined') {
    const observer = new MutationObserver(() => setupCopyButtons())
    observer.observe(document.body, { childList: true, subtree: true })
  }

  // Splash: 最小显示 800ms + 等待 load
  const minTime = 800
  const startTime = performance.now()
  window.addEventListener('load', () => {
    const elapsed = performance.now() - startTime
    const remaining = Math.max(0, minTime - elapsed)
    setTimeout(hideSplash, remaining)
  })
  // 兜底：3s 后强制隐藏
  setTimeout(() => {
    if (showSplash.value) hideSplash()
  }, 3000)
})
</script>

<template>
  <!-- Splash 加载动画 -->
  <div v-if="showSplash" class="splash-overlay" :class="{ 'splash-hide': splashFadeOut }">
    <div class="splash-content">
      <svg class="splash-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle class="splash-ring" cx="32" cy="32" r="28" stroke="var(--vp-c-brand-1)" stroke-width="2" fill="none" opacity="0.3"/>
        <circle class="splash-ring" cx="32" cy="32" r="20" stroke="var(--vp-c-brand-1)" stroke-width="2" fill="none" opacity="0.6"/>
        <circle class="splash-core" cx="32" cy="32" r="8" fill="var(--vp-c-brand-1)" opacity="0.8"/>
      </svg>
      <p class="splash-text">Loading</p>
    </div>
  </div>

  <div class="custom-layout">
    <NavBar />
    <Banner />
    <main class="main-content">
      <div class="content-wrapper">
        <DefaultLayout />
        <Comments v-if="isPost" />
      </div>
    </main>
    <AppFooter />
    <BackToTop />
    <BgmPlayer />
    <Fireworks />
  </div>
</template>

<style scoped>
.main-content {
  min-height: 60vh;
}

.content-wrapper {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 16px;
  }
}
</style>

<style>
/* Reset VitePress default nav and footer since we replace them */
.custom-layout .VPNav {
  display: none !important;
}
.custom-layout .VPFooter {
  display: none !important;
}

/* ---- Splash overlay ---- */
.splash-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease;
}

.splash-overlay.splash-hide {
  opacity: 0;
  pointer-events: none;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.splash-icon {
  animation: splash-breathe 2s ease-in-out infinite;
}

@keyframes splash-breathe {
  0%, 100% { transform: scale(0.9); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
}

.splash-text {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  letter-spacing: 0.1em;
}
</style>
