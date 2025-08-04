<template>
  <div class="empty-state">
    <img v-if="icon" :src="icon" alt="Empty icon" class="empty-icon" />
    <p class="empty-message">{{ message }}</p>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  message?: string;
  icon?: string;
}>();
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #888;
  border: 1px dashed #ccc;
  border-radius: 8px;
  background-color: #fafafa;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-message {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
</style>
