import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PostList from './components/PostList.vue'
import TagList from './components/TagList.vue'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component('PostList', PostList)
        app.component('TagList', TagList)
    },
} satisfies Theme
