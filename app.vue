<script setup lang="ts">
  const route = useRoute();
</script>

<template>
  <div
    class="py-4 min-h-screen flex flex-col justify-between text-base text-[#1a1a1a]"
    :class="[route.path === '/' ? 'bg-[#cdcdcd]' : 'bg-[#f5f5f5]']"
  >
    <header class="w-full">
      <Navigation />
    </header>
    <main class="flex-1 mt-[60px]">
      <NuxtPage />
    </main>
    <footer class="mt-24 px-5 w-full flex items-center justify-between">
      <span class="text-base">2024</span>
    </footer>
  </div>
</template>
