<script lang="ts" setup>
import { ref, onBeforeMount, watch, computed, nextTick } from "vue";
import type { AxiosError } from "axios";
import { useRoute, useRouter } from "vue-router";
import { useDebounce } from "@vueuse/core";
import gsap from "gsap";
import Flip from "gsap/Flip";

import api from "@/libraries/axios.ts";
import type { IPostData } from "@/types";
import {
  BlogCard,
  Button,
  Input,
  CreatePostModal,
  Skeleton,
  EmptyState,
  Pagination,
} from "@/components";

const LIMIT_PER_PAGE = 5;

const route = useRoute();
const router = useRouter();

const listRef = ref<HTMLDivElement | null>(null);
const searchQuery = ref<string>("");
const isModalOpen = ref<boolean>(false);
const debouncedSearchQuery = useDebounce(searchQuery, 500);
const loading = ref<boolean>(false);
const error = ref<AxiosError | null>(null);
const fetchedPosts = ref<IPostData[] | null>(null);
const currentPage = ref<number>(Number(route.query.page) || 1);

const lastPage = computed(() => {
  if (!fetchedPosts.value) return 1;
  return Math.ceil(Number(fetchedPosts.value?.length) / LIMIT_PER_PAGE);
});
const isEmpty = computed(
  () => Array.isArray(fetchedPosts.value) && fetchedPosts.value.length === 0,
);

const toggleModal = (value: boolean) => {
  isModalOpen.value = value;
  searchQuery.value = "";
};

const changePage = (page: number) => {
  currentPage.value = page;
};

const postsToShow = computed(() => {
  if (!fetchedPosts.value) return [];
  const start = (currentPage.value - 1) * LIMIT_PER_PAGE;
  const end = start + LIMIT_PER_PAGE;
  return fetchedPosts.value.slice(start, end);
});

const fetchPosts = async (searchQuery?: string) => {
  try {
    loading.value = true;
    const url = searchQuery?.trim()
      ? `/posts?q=${encodeURIComponent(searchQuery)}`
      : "/posts";
    const response = await api.get(url);
    fetchedPosts.value = response.data;
  } catch (e) {
    error.value = e as AxiosError;
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  fetchPosts();
});

watch(currentPage, (newPage) => {
  router.replace({ query: { ...route.query, page: String(newPage) } });
});

watch(debouncedSearchQuery, (val) => {
  currentPage.value = 1;
  fetchPosts(val);
});

gsap.registerPlugin(Flip);

const animateSort = async (newPosts: IPostData[]) => {
  const state = Flip.getState(".blog-list > *");

  fetchedPosts.value = newPosts;

  await nextTick();

  Flip.from(state, {
    duration: 0.3,
    ease: "power1.inOut",
    stagger: 0.01,
  });
};
</script>

<template>
  <main :class="$style.wrapper">
    <header :class="$style.header">
      <h1 :class="$style.title">My blog</h1>
    </header>

    <section :class="$style.section">
      <div :class="$style.search">
        <Input
          :class="$style.input"
          v-model="searchQuery"
          placeholder="Search..."
        />

        <Button :class="$style.button" @click="toggleModal(true)">
          Create Post
        </Button>
      </div>

      <div ref="listRef" class="blog-list" :class="$style.container">
        <template v-for="n in 5" :key="n">
          <Skeleton v-if="loading" width="100%" height="150px" radius="8px" />
        </template>
        <template :key="post.id" v-for="post in postsToShow">
          <BlogCard
            v-if="!loading"
            :body="post.body"
            :title="post.title"
            :id="post.id"
            :search="searchQuery"
            :changePage="changePage"
            @animate-sort="animateSort"
            v-model:fetchedItems="fetchedPosts"
          />
        </template>

        <EmptyState v-if="!loading && isEmpty">
          There is no results for "{{ debouncedSearchQuery }}"
        </EmptyState>
      </div>

      <Pagination
        v-if="!loading && !isEmpty"
        v-model="currentPage"
        :totalPages="lastPage"
      />
    </section>
  </main>

  <CreatePostModal
    v-model:fetchedItems="fetchedPosts"
    :changePage="changePage"
    v-model="isModalOpen"
  />
</template>

<style src="./Home.module.css" module></style>
