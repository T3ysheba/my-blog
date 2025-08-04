<template>
  <nav class="pagination" v-if="totalPages > 1">
    <button :disabled="modelValue === 1" @click="changePage(modelValue - 1)">
      «
    </button>

    <button
      v-for="item in paginatedRange"
      :key="item + '-' + Math.random()"
      :disabled="item === '...'"
      :class="{ active: item === modelValue }"
      @click="typeof item === 'number' && changePage(item)"
    >
      {{ item }}
    </button>

    <button
      :disabled="modelValue === totalPages"
      @click="changePage(modelValue + 1)"
    >
      »
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();

const siblings = 1; // number of pages to show on each side of current

const paginatedRange = computed<(number | string)[]>(() => {
  const total = props.totalPages;
  const current = props.modelValue;

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const range: (number | string)[] = [];
  const showLeftDots = current > 3 + siblings;
  const showRightDots = current < total - (2 + siblings);

  range.push(1);

  if (showLeftDots) {
    range.push("...");
  }

  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (showRightDots) {
    range.push("...");
  }

  if (total > 1) {
    range.push(total);
  }

  return range;
});

function changePage(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    emit("update:modelValue", page);
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 16px;
  flex-wrap: wrap;
}

button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
  min-width: 32px;
  transition: 0.2s;
}

button.active {
  background: #333;
  color: white;
  font-weight: bold;
}

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
