<script setup lang="ts">
import { Loader } from '@/components'
</script>

<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <Loader />
    </template>
  </Suspense>
</template>
