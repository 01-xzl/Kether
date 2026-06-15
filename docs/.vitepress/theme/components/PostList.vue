<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../../posts/posts.data'
import type { Post } from '../../../posts/posts.data'

const PAGE_SIZE = 5
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(posts.length / PAGE_SIZE))

const pagedPosts = computed((): Post[] => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return posts.slice(start, start + PAGE_SIZE)
})

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

// Reset to page 1 when posts change
watch(() => posts.length, () => {
  currentPage.value = 1
})

function goTo(page: number | string) {
  if (typeof page === 'number') {
    currentPage.value = page
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return dateStr
  }
}
</script>

<template>
  <div class="post-list">
    <div v-if="posts.length === 0" class="post-list-empty">
      暂无文章
    </div>

    <article
      v-for="post in pagedPosts"
      :key="post.url"
      class="post-card"
    >
      <div class="post-card-bar"></div>
      <div class="post-card-body">
        <h2 class="post-card-title">
          <a :href="withBase(post.url)">
            <span v-if="post.pinned" class="post-pinned" title="置顶">📌</span>
            {{ post.title }}
          </a>
        </h2>
        <div class="post-card-meta">
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        </div>
        <p v-if="post.description" class="post-card-desc">{{ post.description }}</p>
        <div class="post-card-tags">
          <a
            v-for="tag in post.tags"
            :key="tag"
            :href="withBase(`/tags/#${encodeURIComponent(tag)}`)"
            class="post-tag"
          >#{{ tag }}</a>
        </div>
      </div>
    </article>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >上一页</button>
      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="pagination-ellipsis">...</span>
        <button
          v-else
          class="pagination-btn"
          :class="{ active: currentPage === page }"
          @click="goTo(page)"
        >{{ page }}</button>
      </template>
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >下一页</button>
    </nav>
  </div>
</template>

<style scoped>
.post-list {
  max-width: 800px;
  margin: 0 auto;
}

.post-list-empty {
  text-align: center;
  color: var(--vp-c-text-2);
  padding: 3rem 0;
  font-size: 1.1rem;
}

.post-card {
  display: flex;
  margin-bottom: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--vp-c-divider);
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.post-card-bar {
  width: 4px;
  flex-shrink: 0;
  background: var(--vp-c-brand-1);
}

.post-card-body {
  padding: 1.25rem 1.5rem;
  flex: 1;
  min-width: 0;
}

.post-card-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  line-height: 1.5;
}

.post-card-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.post-card-title a:hover {
  color: var(--vp-c-brand-1);
}

.post-pinned {
  margin-right: 0.25rem;
}

.post-card-meta {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.post-card-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin: 0 0 0.75rem;
  line-height: 1.6;
}

.post-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-tag {
  display: inline-block;
  padding: 0.1rem 0.6rem;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  border-radius: 6px;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
}

.post-tag:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.pagination-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.9rem;
  transition: border-color 0.2s, color 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.pagination-btn.active {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-text);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-ellipsis {
  padding: 0.4rem 0.2rem;
  color: var(--vp-c-text-2);
}
</style>