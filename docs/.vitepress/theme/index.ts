import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import mediumZoom from 'medium-zoom'
import 'medium-zoom/dist/style.css'
import { nextTick } from 'vue'
import PostList from './components/PostList.vue'
import TagList from './components/TagList.vue'
import Comments from './components/Comments.vue'
import Layout from './Layout.vue'
import './custom.css'

let zoomInstance: ReturnType<typeof mediumZoom> | null = null

function initZoom() {
  if (typeof window === 'undefined') return
  if (zoomInstance) {
    zoomInstance.detach()
  }
  zoomInstance = mediumZoom('.vp-doc img', {
    background: 'rgba(0, 0, 0, 0.8)',
    margin: 24,
  })
}

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app, router }) {
        app.component('PostList', PostList)
        app.component('TagList', TagList)
        app.component('Comments', Comments)

        // 路由切换后重新绑定图片灯箱
        if (typeof window !== 'undefined') {
          router.onAfterRouteChanged = () => {
            nextTick(() => initZoom())
          }
          // 首次加载
          nextTick(() => initZoom())
        }
    },
} satisfies Theme
