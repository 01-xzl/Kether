import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    lang: 'zh-CN',
    title: '我的博客',
    description: '基于 VitePress 构建的个人博客',

    // 部署到 GitHub Pages 根路径（username.github.io），base 设为 '/'
    // 如果部署到子路径（username.github.io/repo/），改为 '/repo/'
    base: '/',

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
            { icon: 'github', link: 'https://github.com/' }
        ],

        // 页脚
        footer: {
            message: '',
            copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/">My Blog</a>.`
        },
    },
})