// 暂时使用 VitePress 默认主题
// 后续阶段会覆盖为自定义主题
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'

export default {
    extends: DefaultTheme,
} satisfies Theme