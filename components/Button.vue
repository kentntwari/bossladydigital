<script lang="ts" setup>
  const props = defineProps<{
    type: "button" | "submit" | "reset";
  }>();
</script>

<template>
  <button
    :type="props.type"
    class="min-w-40 h-[60px] bg-transparent uppercase text-base text-[#1a1a1a] text-center border border-[#1a1a1a] [border-radius:100px/40px]"
  >
    <slot></slot>
  </button>
</template>
