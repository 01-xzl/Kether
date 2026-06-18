import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: '我的博客',
  description: '基于 VitePress 构建的个人博客',

  // 部署到 GitHub Pages 根路径（username.github.io），base 设为 '/'
  // 如果部署到子路径（username.github.io/repo/），改为 '/repo/'
  base: '/Kether/',

  // 防闪烁内联脚本 — 在页面渲染前预检测主题
  head: [
    ['script', {}, `
        (function() {
          var stored = localStorage.getItem('blog-theme-mode');
          if (stored === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
          } else if (stored === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            // 跟随系统
            var mq = window.matchMedia('(prefers-color-scheme: dark)');
            document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
          }
        })();
      `]
  ],

  themeConfig: {
    // 搜索功能 - VitePress 1.x 内置本地搜索
    search: {
      provider: 'local'
    },

    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '标签', link: '/tags/' },
    ],

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/01-xzl' }
    ],

    // 页脚
    footer: {
      message: '',
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/01-xzl">My Blog</a>.`
    },
  },
})