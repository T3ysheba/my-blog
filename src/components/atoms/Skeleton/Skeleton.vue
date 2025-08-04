<script lang="ts" setup>
import { defineProps } from "vue";

const props = withDefaults(
  defineProps<{
    width?: string;
    height?: string;
    radius?: string;
    circle?: boolean;
  }>(),
  {
    width: "100%",
    height: "1rem",
    radius: "4px",
    circle: false,
  },
);
</script>

<template>
  <div
    :class="['skeleton', { circle: props?.circle }]"
    :style="{
      width: props?.width,
      height: props?.height,
      borderRadius: props?.circle ? '50%' : props?.radius,
    }"
  ></div>
</template>

<style scoped>
@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 5s infinite;
}
</style>
