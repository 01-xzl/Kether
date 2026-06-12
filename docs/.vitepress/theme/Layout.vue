<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import NavBar from './components/NavBar.vue'
import Banner from './components/Banner.vue'
import AppFooter from './components/AppFooter.vue'
import BackToTop from './components/BackToTop.vue'
import Comments from './components/Comments.vue'
import { computed } from 'vue'

const { page, frontmatter } = useData()
const { Layout: DefaultLayout } = DefaultTheme

const isPost = computed(() => {
  const url = page.value.url
  if (!url) return false
  return url.startsWith('/posts/') && url !== '/posts/'
})
</script>

<template>
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
  </div>
</template>

<style>
/* Reset VitePress default nav and footer since we replace them */
.custom-layout :deep(.VPNav) {
  display: none !important;
}
.custom-layout :deep(.VPFooter) {
  display: none !important;
}

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