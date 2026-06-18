<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

const enabled = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let particles: Particle[] = []

const PALETTE = ['#6c63ff', '#ff6b9d', '#ffd93d', '#6bcb77', '#4d96ff', '#ff922b', '#e040fb']

function getParticleCount() {
  return window.innerWidth < 768 ? 35 : 70
}

function spawnFirework(x: number, y: number) {
  const count = getParticleCount()
  const originY = window.innerHeight - 20
  // 从底部发射
  const rocket: Particle = {
    x: x,
    y: originY,
    vx: (x - originY * 0.3) * 0.008,
    vy: -12 - Math.random() * 4,
    life: 40,
    maxLife: 40,
    color: '#ffffff',
    size: 3,
  }

  // 爆炸粒子
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 1 + Math.random() * 5
    const life = 40 + Math.random() * 30
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      size: 1.5 + Math.random() * 2.5,
    })
  }

  // 二次爆炸（小圈）
  if (Math.random() > 0.4) {
    const innerCount = Math.floor(count * 0.4)
    for (let i = 0; i < innerCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 0.5 + Math.random() * 2
      const life = 20 + Math.random() * 20
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        color: '#ffffff',
        size: 0.8 + Math.random() * 1.5,
      })
    }
  }
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 半透明拖尾
  ctx.fillStyle = 'rgba(0,0,0,0.08)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  particles = particles.filter(p => p.life > 0)

  for (const p of particles) {
    p.life--
    const alpha = p.life / p.maxLife
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.06 // 重力
    p.vx *= 0.99 // 空气阻力
    p.vy *= 0.99

    ctx.globalAlpha = alpha
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.globalAlpha = 1

  if (enabled.value && (particles.length > 0 || true)) {
    animId = requestAnimationFrame(animate)
  }
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function handleClick(e: MouseEvent) {
  if (!enabled.value) return
  spawnFirework(e.clientX, e.clientY)
}

function toggle() {
  enabled.value = !enabled.value
  localStorage.setItem('blog-fireworks', enabled.value ? 'on' : 'off')
  if (enabled.value) {
    if (animId === 0) {
      animId = requestAnimationFrame(animate)
    }
  }
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  document.addEventListener('click', handleClick)

  // 恢复上次状态
  const saved = localStorage.getItem('blog-fireworks')
  if (saved === 'on') {
    enabled.value = true
    animId = requestAnimationFrame(animate)
  }
})

onUnmounted(() => {
  if (animId) cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
  document.removeEventListener('click', handleClick)
})
</script>

<template>
  <canvas ref="canvasRef" class="fireworks-canvas" :class="{ active: enabled }"></canvas>
  <button class="fireworks-toggle" :class="{ active: enabled }" @click="toggle" :title="enabled ? '关闭烟花' : '开启烟花'">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
      <path d="M5.64 5.64l2.83 2.83M15.5 15.5l2.83 2.83M5.64 18.36l2.83-2.83M15.5 8.5l2.83-2.83"/>
    </svg>
  </button>
</template>

<style scoped>
.fireworks-canvas {
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  display: none;
}

.fireworks-canvas.active {
  display: block;
}

.fireworks-toggle {
  position: fixed;
  bottom: 146px;
  right: 32px;
  z-index: 998;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background: rgba(var(--vp-c-bg-raw, 255 255 255), 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--vp-c-text-3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, color 0.2s, border-color 0.2s;
}

.fireworks-toggle:hover {
  transform: translateY(-2px);
  color: var(--vp-c-brand-1);
}

.fireworks-toggle.active {
  color: #ff6b9d;
  border-color: #ff6b9d;
}

@media (max-width: 768px) {
  .fireworks-toggle {
    bottom: 124px;
    right: 16px;
  }
}
</style>
