<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../../posts/posts.data'

interface TagInfo {
  name: string
  count: number
  posts: { title: string; url: string; date: string }[]
}

const tagMap = computed(() => {
  const map = new Map<string, TagInfo>()
  for (const post of posts) {
    for (const tag of post.tags) {
      if (!map.has(tag)) {
        map.set(tag, { name: tag, count: 0, posts: [] })
      }
      const info = map.get(tag)!
      info.count++
      info.posts.push({
        title: post.title,
        url: post.url,
        date: post.date,
      })
    }
  }
  // Sort tags by post count descending
  return Array.from(map.values()).sort((a, b) => b.count - a.count)
})

const selectedTag = ref('')

function selectTag(tag: string) {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}

const filteredPosts = computed(() => {
  if (!selectedTag.value) return []
  const tag = tagMap.value.find(t => t.name === selectedTag.value)
  return tag ? tag.posts : []
})
</script>

<template>
  <div class="tag-list">
    <div v-if="tagMap.length === 0" class="tag-list-empty">
      暂无标签
    </div>

    <div class="tags-cloud">
      <button
        v-for="tag in tagMap"
        :key="tag.name"
        class="tag-chip"
        :class="{ active: selectedTag === tag.name }"
        @click="selectTag(tag.name)"
      >
        {{ tag.name }}
        <span class="tag-count">{{ tag.count }}</span>
      </button>
    </div>

    <!-- Filtered posts -->
    <div v-if="selectedTag && filteredPosts.length > 0" class="tag-posts">
      <h3>#{{ selectedTag }} 相关文章</h3>
      <ul>
        <li v-for="post in filteredPosts" :key="post.url">
          <a :href="withBase(post.url)">{{ post.title }}</a>
          <span class="post-date">{{ post.date }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.tag-list {
  max-width: 800px;
  margin: 0 auto;
}

.tag-list-empty {
  text-align: center;
  color: var(--vp-c-text-2);
  padding: 3rem 0;
  font-size: 1.1rem;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.tag-chip:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.tag-chip.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-text);
}

.tag-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: var(--vp-c-bg-mute);
  border-radius: 9px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.tag-chip.active .tag-count {
  background: rgba(255, 255, 255, 0.25);
  color: var(--vp-c-brand-text);
}

.tag-posts {
  margin-top: 1.5rem;
  padding: 1rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}

.tag-posts h3 {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
}

.tag-posts ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag-posts li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tag-posts li:last-child {
  border-bottom: none;
}

.tag-posts a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.tag-posts a:hover {
  text-decoration: underline;
}

.post-date {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  margin-left: 1rem;
}
</style>
