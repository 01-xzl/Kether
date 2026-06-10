<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useData, useRouter } from 'vitepress'

const { site, theme } = useData()
const router = useRouter()
const mobileOpen = ref(false)
const scrolled = ref(false)

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function closeMobile() {
  mobileOpen.value = false
}

let scrollHandler: () => void
onMounted(() => {
  scrollHandler = () => {
    scrolled.value = window.scrollY > 10
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', scrollHandler)
})
</script>

<template>
  <header class="navbar" :class="{ scrolled }">
    <div class="navbar-inner">
      <a class="navbar-logo" href="/" @click="closeMobile">
        <span class="logo-icon">✦</span>
        <span class="logo-text">{{ site.title }}</span>
      </a>

      <button class="hamburger" :class="{ active: mobileOpen }" @click="toggleMobile" aria-label="菜单">
        <span></span><span></span><span></span>
      </button>

      <nav class="nav-menu" :class="{ open: mobileOpen }">
        <a class="nav-link" href="/" @click="closeMobile">首页</a>
        <a class="nav-link" href="/posts/" @click="closeMobile">文章</a>
        <a class="nav-link" href="/tags/" @click="closeMobile">标签</a>
        <div class="nav-search" @click="closeMobile">
          <button class="search-btn" onclick="document.querySelector('.VPNavBarSearch')?.querySelector('button')?.click()" title="搜索">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(var(--vp-c-bg-raw, 255 255 255), 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s, background 0.3s;
}

.navbar.scrolled {
  border-bottom-color: var(--vp-c-divider);
}

.navbar-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  font-weight: 700;
  font-size: 1.15rem;
}

.logo-icon {
  font-size: 1.4rem;
  color: var(--vp-c-brand-1);
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  z-index: 1001;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--vp-c-text-1);
  border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s;
}

.hamburger.active span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger.active span:nth-child(2) {
  opacity: 0;
}
.hamburger.active span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  padding: 8px 16px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}

.nav-link:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-mute);
}

.nav-search {
  margin-left: 4px;
}

.search-btn {
  background: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  transition: border-color 0.2s, color 0.2s;
}

.search-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 260px;
    height: 100vh;
    flex-direction: column;
    align-items: flex-start;
    padding: 80px 24px 24px;
    background: var(--vp-c-bg);
    border-left: 1px solid var(--vp-c-divider);
    transition: right 0.3s ease;
    gap: 4px;
    box-shadow: -4px 0 12px rgba(0,0,0,0.08);
  }

  .nav-menu.open {
    right: 0;
  }

  .nav-link {
    width: 100%;
    padding: 12px 16px;
    font-size: 1.05rem;
  }
}
</style>