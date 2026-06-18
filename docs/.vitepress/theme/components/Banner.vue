<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useData, withBase } from 'vitepress'

const { page, frontmatter, theme } = useData()

const waveCanvas = ref<HTMLCanvasElement | null>(null)
let animId = 0
let resizeTimer: ReturnType<typeof setTimeout> | null = null

function getWaveColors() {
  if (typeof window === 'undefined') return { c1: 'rgba(108,99,255,0.3)', c2: 'rgba(72,64,170,0.2)', c3: 'rgba(108,99,255,0.1)' }
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  return {
    c1: isDark ? 'rgba(108,99,255,0.35)' : 'rgba(108,99,255,0.2)',
    c2: isDark ? 'rgba(72,64,170,0.25)' : 'rgba(72,64,170,0.12)',
    c3: isDark ? 'rgba(108,99,255,0.12)' : 'rgba(108,99,255,0.06)',
  }
}

function startWave() {
  const canvas = waveCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let phase = 0
  let colors = getWaveColors()

  function resize() {
    const rect = canvas!.parentElement!.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas!.width = rect.width * dpr
    canvas!.height = 64 * dpr
    canvas!.style.width = rect.width + 'px'
    canvas!.style.height = '64px'
    ctx!.scale(dpr, dpr)
    colors = getWaveColors()
  }

  resize()

  // 监听主题变化更新颜色
  const themeObserver = new MutationObserver(() => {
    colors = getWaveColors()
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  function draw() {
    const w = canvas!.width / (window.devicePixelRatio || 1)
    const h = 64
    ctx!.clearRect(0, 0, w, h)

    // 3 层正弦波
    const waves = [
      { amp: 10, freq: 0.012, speed: 0.02, color: colors.c1, yOff: 25 },
      { amp: 6,  freq: 0.018, speed: 0.03, color: colors.c2, yOff: 30 },
      { amp: 4,  freq: 0.025, speed: 0.04, color: colors.c3, yOff: 35 },
    ]

    // 移动端减少为 2 层
    const activeWaves = window.innerWidth < 768 ? waves.slice(0, 2) : waves

    for (const wave of activeWaves) {
      ctx!.beginPath()
      ctx!.moveTo(0, h)
      for (let x = 0; x <= w; x += 2) {
        const y = wave.yOff + Math.sin(x * wave.freq + phase * wave.speed) * wave.amp
        ctx!.lineTo(x, y)
      }
      ctx!.lineTo(w, h)
      ctx!.closePath()
      ctx!.fillStyle = wave.color
      ctx!.fill()
    }

    phase++
    animId = requestAnimationFrame(draw)
  }

  draw()

  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(resize, 100)
  })
}

onMounted(() => {
  startWave()
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  if (resizeTimer) clearTimeout(resizeTimer)
})
</script>

<template>
  <div class="banner" :class="{ 'banner-post': page.isPost }">
    <div class="banner-bg"></div>

    <!-- Home page banner -->
    <div v-if="page.url === '/'" class="banner-content banner-home">
      <div class="home-avatar">
        <div class="avatar-placeholder">✦</div>
      </div>
      <h1 class="home-title">{{ frontmatter.hero?.name || '我的博客' }}</h1>
      <p class="home-subtitle">{{ frontmatter.hero?.text || '记录技术 & 生活' }}</p>
      <p class="home-tagline">{{ frontmatter.hero?.tagline || '' }}</p>
      <div class="home-socials">
        <a :href="theme.socialLinks?.[0]?.link || 'https://github.com/01-xzl'" target="_blank" rel="noopener" class="social-icon" title="GitHub">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
      </div>
    </div>

    <!-- Post page banner -->
    <div v-else-if="page.url !== '/tags/'" class="banner-content banner-post-page">
      <h1 class="post-banner-title">{{ frontmatter.title || '文章' }}</h1>
      <div class="post-banner-meta" v-if="frontmatter.date">
        <time :datetime="frontmatter.date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          {{ frontmatter.date }}
        </time>
      </div>
    </div>

    <!-- Tags page banner -->
    <div v-else class="banner-content banner-post-page">
      <h1 class="post-banner-title">🏷️ 标签浏览</h1>
    </div>

    <!-- Canvas 实时波浪 -->
    <canvas ref="waveCanvas" class="banner-wave-canvas"></canvas>
  </div>
</template>

<style scoped>
.banner {
  position: relative;
  min-height: 65vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 56px;
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--vp-c-brand-2) 0%, var(--vp-c-brand-1) 50%, var(--vp-c-brand-3) 100%);
  opacity: 0.08;
}

.banner-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
}

.banner-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.home-avatar {
  margin-bottom: 0.5rem;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.home-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  margin: 0;
  letter-spacing: -0.02em;
}

.home-subtitle {
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  margin: 0;
  font-weight: 400;
}

.home-tagline {
  font-size: 0.95rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

.home-socials {
  display: flex;
  gap: 12px;
  margin-top: 0.75rem;
}

.social-icon {
  color: var(--vp-c-text-2);
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.social-icon:hover {
  color: var(--vp-c-brand-1);
}

.banner-post {
  min-height: 35vh;
}

.banner-post-page {
  text-align: center;
}

.post-banner-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem;
}

.post-banner-meta {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.post-banner-meta time {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

/* Canvas wave */
.banner-wave-canvas {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  z-index: 0;
  pointer-events: none;
}

@media (max-width: 768px) {
  .home-title {
    font-size: 1.8rem;
  }
  .banner {
    min-height: 55vh;
  }
  .banner-post {
    min-height: 28vh;
  }
}
</style>
