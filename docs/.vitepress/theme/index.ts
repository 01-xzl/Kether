import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PostList from './components/PostList.vue'
import TagList from './components/TagList.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('PostList', PostList)
        app.component('TagList', TagList)
    },
} satisfies Theme