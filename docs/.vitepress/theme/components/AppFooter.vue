<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">✦</span>
        <span class="footer-name">我的博客</span>
      </div>
      <div class="footer-info">
        <p>Copyright &copy; {{ currentYear }} My Blog. All rights reserved.</p>
        <p class="footer-powered">
          Powered by
          <a href="https://vitepress.dev/" target="_blank" rel="noopener">VitePress</a>
          &
          <a href="https://pages.github.com/" target="_blank" rel="noopener">GitHub Pages</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  margin-top: 4rem;
  padding: 2.5rem 24px;
  background: rgba(var(--vp-c-bg-raw, 255 255 255), 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--vp-c-divider);
}

.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-align: center;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.footer-logo {
  font-size: 1.1rem;
  color: var(--vp-c-brand-1);
}

.footer-info {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.footer-info p {
  margin: 0.25rem 0;
}

.footer-powered a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.footer-powered a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .app-footer {
    padding: 2rem 16px;
  }
}
</style>