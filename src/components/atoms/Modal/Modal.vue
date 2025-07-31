<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

function close() {
  emit("update:modelValue", false);
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" :class="$style.modal_overlay" @click.self="close">
      <div :class="$style.modal_content">
        <slot />
        <button :class="$style.close_btn" @click="close">✕</button>
      </div>
    </div>
  </Teleport>
</template>

<style src="./Modal.module.css" module></style>
