<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

type ThemeMode = 'light' | 'dark' | 'system'

const current = ref<ThemeMode>('system')
const open = ref(false)

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem('blog-theme-mode')
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

function applyTheme(mode: ThemeMode) {
  if (typeof window === 'undefined') return
  const html = document.documentElement

  // Add transition class for smooth switching
  html.classList.add('theme-transition')

  let resolved: 'light' | 'dark'
  if (mode === 'system') {
    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } else {
    resolved = mode
  }

  html.setAttribute('data-theme', resolved)
  localStorage.setItem('blog-theme-mode', mode)

  // Remove transition class after animation completes
  setTimeout(() => {
    html.classList.remove('theme-transition')
  }, 300)
}

function setTheme(mode: ThemeMode) {
  current.value = mode
  applyTheme(mode)
  open.value = false
}

function toggleDropdown() {
  open.value = !open.value
}

function closeDropdown(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.theme-switch')) {
    open.value = false
  }
}

onMounted(() => {
  current.value = getStoredTheme()

  // Listen for system theme changes
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', () => {
    if (current.value === 'system') {
      applyTheme('system')
    }
  })

  document.addEventListener('click', closeDropdown)
})
</script>

<template>
  <div class="theme-switch">
    <button
      class="theme-btn"
      @click="toggleDropdown"
      :title="'主题: ' + current"
      :aria-label="'主题切换，当前：' + current"
      :aria-expanded="open"
      role="button"
    >
      <!-- Sun icon -->
      <svg v-if="current === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/>
      </svg>
      <!-- Moon icon -->
      <svg v-else-if="current === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
      <!-- Monitor icon (system) -->
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>
      </svg>
    </button>

    <Transition name="dropdown">
      <div v-if="open" class="theme-dropdown" role="menu">
        <button class="theme-option" :class="{ active: current === 'light' }" @click="setTheme('light')" role="menuitemradio" :aria-checked="current === 'light'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          <span>亮色</span>
        </button>
        <button class="theme-option" :class="{ active: current === 'dark' }" @click="setTheme('dark')" role="menuitemradio" :aria-checked="current === 'dark'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <span>暗色</span>
        </button>
        <button class="theme-option" :class="{ active: current === 'system' }" @click="setTheme('system')" role="menuitemradio" :aria-checked="current === 'system'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          <span>跟随系统</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.theme-switch {
  position: relative;
}

.theme-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.theme-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.theme-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 140px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  z-index: 1001;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: none;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.theme-option:hover {
  background: var(--vp-c-bg-mute);
}

.theme-option.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>