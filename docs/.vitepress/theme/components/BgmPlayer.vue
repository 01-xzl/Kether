<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isPlaying = ref(false)
const hasMusic = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

let audio: HTMLAudioElement | null = null

function checkMusicFile() {
  // 尝试加载音乐文件
  const testAudio = new Audio()
  testAudio.src = '/Kether/music/bgm.mp3'
  testAudio.preload = 'metadata'
  testAudio.addEventListener('loadedmetadata', () => {
    hasMusic.value = true
  })
  testAudio.addEventListener('error', () => {
    hasMusic.value = false
  })
}

function togglePlay() {
  if (!audio) {
    audio = new Audio('/Kether/music/bgm.mp3')
    audio.loop = true
    audio.volume = 0.3

    // 恢复上次音量
    const savedVol = localStorage.getItem('blog-bgm-volume')
    if (savedVol) audio.volume = parseFloat(savedVol)

    audio.addEventListener('play', () => { isPlaying.value = true })
    audio.addEventListener('pause', () => { isPlaying.value = false })
    audio.addEventListener('ended', () => { isPlaying.value = false })
  }

  if (audio.paused) {
    audio.play().catch(() => {
      // 浏览器阻止自动播放，忽略
    })
  } else {
    audio.pause()
  }
}

onMounted(() => {
  checkMusicFile()
})

onUnmounted(() => {
  if (audio) {
    audio.pause()
    audio = null
  }
})
</script>

<template>
  <div class="bgm-player" :class="{ visible: hasMusic }" :title="isPlaying ? '暂停音乐' : '播放音乐'">
    <button class="bgm-btn" @click="togglePlay" :class="{ playing: isPlaying }">
      <svg v-if="!isPlaying" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="spinning">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="31.4 31.4"/>
        <path d="M12 6v6l4 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <span v-if="!hasMusic" class="bgm-hint">🎵 拖入 music/bgm.mp3</span>
  </div>
</template>

<style scoped>
.bgm-player {
  position: fixed;
  bottom: 90px;
  right: 32px;
  z-index: 998;
  display: none;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.bgm-player.visible {
  display: flex;
}

.bgm-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: rgba(var(--vp-c-bg-raw, 255 255 255), 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--vp-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s, color 0.2s;
}

.bgm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: var(--vp-c-brand-1);
}

.bgm-btn.playing {
  color: var(--vp-c-brand-1);
}

.spinning {
  animation: bgm-spin 3s linear infinite;
}

@keyframes bgm-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.bgm-hint {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .bgm-player {
    bottom: 72px;
    right: 16px;
  }
  .bgm-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
