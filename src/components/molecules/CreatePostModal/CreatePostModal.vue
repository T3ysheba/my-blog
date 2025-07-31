<script setup lang="ts">
import { computed, ref } from "vue";

import api from "@/libraries/axios.ts";
import type { AxiosError } from "axios";
import { Button, Input, Modal } from "@/components";
import type { IPostBody, IPostData, IPostEditBody } from "@/types";

const props = defineProps<{
  modelValue: boolean;
  body?: string;
  title?: string;
  postId?: number;
  changePage: (val: number) => void;
  fetchedItems: IPostData[] | null;
}>();

const title = ref<string>(props.title || "");
const body = ref<string>(props.body || "");

const postResponse = ref<any>(null);
const loading = ref<boolean>(false);
const error = ref<AxiosError | null>(null);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "update:fetchedItems", value: IPostData[]): void;
}>();

const handlePostCreation = (data: IPostData) => {
  const updated = [data, ...(props.fetchedItems || [])];
  emit("update:fetchedItems", updated);
};

const handlePostEditing = (data: IPostData) => {
  const updated = (props.fetchedItems || []).map((element) =>
    element.id === data.id ? data : element,
  );
  emit("update:fetchedItems", updated);
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit("update:modelValue", val),
});

const createPost = async (data: IPostBody) => {
  try {
    loading.value = true;
    const response = await api.post("/posts", data);
    postResponse.value = response.data;
    emit("update:modelValue", false);
    props.changePage(1);
    handlePostCreation(response.data);
  } catch (e) {
    error.value = e as AxiosError;
  } finally {
    loading.value = false;
  }
};

const editPost = async (data: IPostEditBody) => {
  try {
    loading.value = true;
    const response = await api.put(`/posts/${data.id}`, data);
    postResponse.value = response.data;
    emit("update:modelValue", false);
    handlePostEditing(response.data);
  } catch (e) {
    error.value = e as AxiosError;
  } finally {
    loading.value = false;
  }
};

const handleSubmitting = () => {
  props.postId
    ? editPost({ title: title.value, body: body.value, id: props.postId })
    : createPost({ title: title.value, body: body.value, userId: 1 });
};
</script>

<template>
  <Modal v-model="isOpen">
    <div :class="$style.modal">
      <h3>{{ postId ? "Edit Post" : "Create Post" }}</h3>

      <form :class="$style.modal_container" @submit.prevent="handleSubmitting">
        <Input
          v-model="title"
          required
          :class="$style.input"
          placeholder="Title"
        />

        <textarea
          v-model="body"
          required
          :class="$style.textarea"
          placeholder="Subtitle"
        />

        <Button :disabled="loading" type="submit" :class="$style.button">
          {{ postId ? "Edit" : "Create" }}
        </Button>
      </form>
    </div>
  </Modal>
</template>

<style src="./CreateModal.module.css" module></style>
