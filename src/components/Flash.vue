<script setup lang="ts">
import { ref } from "vue";

const show = ref(true);
</script>

<template>
  <div
    v-if="show"
    class="text-sm p-2 rounded w-full gap-2 hover:opacity-80 flex items-center bg-amber-300 cursor-pointer"
    @click="show = false"
  >
    <u-icon class="" name="i-lucide-x" />
    <slot />
  </div>
</template>
