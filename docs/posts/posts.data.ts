import { createContentLoader } from 'vitepress'

export interface Post {
    title: string
    url: string
    date: string
    tags: string[]
    description?: string
    pinned?: boolean
}

export default createContentLoader('posts/**/*.md', {
    excerpt: true,
    transform(raw): Post[] {
        return raw
            .filter(page => page.url !== '/posts/')
            .map(page => ({
                title: page.frontmatter.title,
                url: page.url,
                date: page.frontmatter.date,
                tags: page.frontmatter.tags || [],
                description: page.frontmatter.description || '',
                pinned: page.frontmatter.pinned || false,
            }))
            .sort((a, b) => {
                // 置顶文章优先，然后按日期倒序
                if (a.pinned && !b.pinned) return -1
                if (!a.pinned && b.pinned) return 1
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            })
    }
})