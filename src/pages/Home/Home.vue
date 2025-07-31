<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import type { AxiosError } from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { useDebounce } from '@vueuse/core'

import api from '@/libraries/axios.ts'
import type { IPostData } from '@/types'
import { BlogCard } from '@/components'

const LIMIT_PER_PAGE = 5

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const debouncedSearchQuery = useDebounce(searchQuery, 500)
const loading = ref<boolean>(false)
const error = ref<AxiosError | null>(null)
const fetchedPosts = ref<IPostData[] | null>(null)
const currentPage = ref<number>(Number(route.query.page) || 1)

const lastPage = computed(() => Math.ceil(Number(fetchedPosts.value?.length) / LIMIT_PER_PAGE))

const isNextPageDisabled = computed(() => currentPage.value > lastPage.value)
const isPrevPageDisabled = computed(() => currentPage.value > 1)

const onNextPageClick = () => {
  if (currentPage.value < lastPage.value) {
    currentPage.value++
  }
}

const onPrevPageClick = () => {
  if (currentPage.value !== 1) {
    currentPage.value--
  }
}

const postsToShow = computed(() => {
  if (!fetchedPosts.value) return []
  const start = (currentPage.value - 1) * LIMIT_PER_PAGE
  const end = start + LIMIT_PER_PAGE
  return fetchedPosts.value.slice(start, end)
})

const fetchPosts = async (searchQuery?: string) => {
  loading.value = true

  try {
    const url = searchQuery?.trim() ? `/posts?q=${encodeURIComponent(searchQuery)}` : '/posts'
    const response = await api.get(url)
    fetchedPosts.value = response.data
  } catch (e) {
    error.value = e as AxiosError
  } finally {
    loading.value = true
  }
}

onMounted(() => {
  fetchPosts()
})

watch(currentPage, (newPage) => {
  router.replace({ query: { ...route.query, page: String(newPage) } })
})

watch(debouncedSearchQuery, (val) => {
  currentPage.value = 1
  fetchPosts(val)
})
</script>

<template>
  <main :class="$style.wrapper">
    <header :class="$style.header">
      <h1 :class="$style.title">My blog</h1>
    </header>

    <section :class="$style.section">
      <input :class="$style.input" v-model="searchQuery" placeholder="Search..." />

      <div :class="$style.container">
        <BlogCard
          :body="post.body"
          :title="post.title"
          :key="post.id"
          v-for="post in postsToShow"
          :search="searchQuery"
        />
      </div>

      <div :class="$style.button_container">
        <button :disabled="isPrevPageDisabled" @click="onPrevPageClick" :class="$style.button">
          Prev
        </button>

        <button :disabled="isNextPageDisabled" @click="onNextPageClick" :class="$style.button">
          Next
        </button>
      </div>
    </section>
  </main>
</template>

<style src="./Home.module.css" module></style>
