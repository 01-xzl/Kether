import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PostList from './components/PostList.vue'
import TagList from './components/TagList.vue'
import Comments from './components/Comments.vue'
import Layout from './Layout.vue'
import './custom.css'

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
        app.component('PostList', PostList)
        app.component('TagList', TagList)
        app.component('Comments', Comments)
    },
} satisfies Theme
