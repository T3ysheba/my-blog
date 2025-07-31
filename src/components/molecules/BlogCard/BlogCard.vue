<script lang="ts" setup>
import { computed } from 'vue'

import type { IBlogCardProps } from './types.ts'

const props = defineProps<IBlogCardProps>()

const highlight = (text: string, search?: string) => {
  if (!search || search.trim() === '') return text
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape regex
  const regex = new RegExp(`(${escapedSearch})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const highlightedTitle = computed(() => highlight(props.title, props.search))

const highlightedBody = computed(() => highlight(props.body, props.search))
</script>

<template>
  <div :class="$style.post">
    <p :class="$style.post_title" v-html="highlightedTitle" />
    <p :class="$style.post_body" v-html="highlightedBody" />
  </div>
</template>

<style src="./BlogCard.module.css" module></style>
