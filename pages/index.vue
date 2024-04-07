<script lang="ts" setup></script>

<template>
  <div class="flex flex-col items-center space-y-20">
    <section class="w-full uppercase text-3xl">
      <div class="px-5 bg-[#FF9F40]">
        Make <br />
        money <br />
      </div>
      <div class="px-5 bg-white">
        online <br />
        with
      </div>
      <div class="px-5">digital products</div>
    </section>

    <Button type="button" role="go to products" @click="navigateTo('/shop')"
      >Get started</Button
    >
  </div>
</template>
