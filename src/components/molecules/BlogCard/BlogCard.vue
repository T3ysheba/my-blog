<script lang="ts" setup>
import { computed, ref } from "vue";
import gsap from "gsap";
import type { AxiosError } from "axios";

import api from "@/libraries/axios.ts";
import type { IPostData } from "@/types";
import { Button, CreatePostModal } from "@/components";

import type { IBlogCardProps } from "./types.ts";

const props = defineProps<IBlogCardProps>();
const isModalOpen = ref<boolean>(false);

const postResponse = ref<any>(null);
const loading = ref<boolean>(false);
const error = ref<AxiosError | null>(null);
const postRef = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  (e: "update:fetchedItems", value: IPostData[]): void;
  (e: "animate-sort", value: IPostData[]): void;
}>();

const toggleModal = (value: boolean) => {
  isModalOpen.value = value;
};

const handlePostDelete = () => {
  const updated = (props.fetchedItems || []).filter(
    (element) => element.id !== props.id,
  );
  emit("update:fetchedItems", updated);
  emit("animate-sort", updated);
};

const deletePost = async () => {
  try {
    loading.value = true;
    const response = await api.delete(`/posts/${props.id}`);
    postResponse.value = response.data;

    if (postRef.value) {
      await gsap.to(postRef.value, {
        opacity: 0,
        x: -100,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    handlePostDelete();
  } catch (e) {
    error.value = e as AxiosError;
  } finally {
    loading.value = false;
  }
};

const highlight = (text: string, search?: string) => {
  if (!search || search.trim() === "") return text;
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex
  const regex = new RegExp(`(${escapedSearch})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};

const highlightedTitle = computed(() => highlight(props.title, props.search));
const highlightedBody = computed(() => highlight(props.body, props.search));

const fetchedPosts = computed({
  get: () => props.fetchedItems,
  set: (val: IPostData[]) => emit("update:fetchedItems", val),
});
</script>

<template>
  <div ref="postRef" :class="$style.post">
    <div :class="$style.post_container">
      <p :class="$style.post_title" v-html="highlightedTitle" />

      <div :class="$style.button_container">
        <Button :disabled="loading" @click="toggleModal(true)"> Edit </Button>
        <Button
          :disabled="loading"
          :class="$style.delete"
          @click="deletePost()"
        >
          Delete
        </Button>
      </div>
    </div>
    <p :class="$style.post_body" v-html="highlightedBody" />
  </div>

  <CreatePostModal
    :title="props.title"
    :body="props.body"
    :postId="props.id"
    v-model="isModalOpen"
    :changePage="props.changePage"
    v-model:fetchedItems="fetchedPosts"
  />
</template>

<style src="./BlogCard.module.css" module></style>
