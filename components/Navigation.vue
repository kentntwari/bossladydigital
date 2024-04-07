<script lang="ts" setup>
  const isMobileMenu = ref(false);

  const defaultLinks = [
    {
      link: "shop",
      path: "/shop",
    },
    {
      link: "contact",
      path: "/contact",
    },
    {
      link: "terms and conditions",
      path: "/terms",
    },
  ];

  watch(
    () => isMobileMenu.value,
    () => {
      if (isMobileMenu.value) document.body.classList.add("overflow-hidden");
      if (!isMobileMenu.value)
        document.body.classList.remove("overflow-hidden");
    }
  );
</script>

<template>
  <nav
    class="px-5"
    :class="[
      isMobileMenu
        ? 'h-screen *:relative *:z-30 *:text-white after:w-full after:h-full after:bg-[#1a1a1a] after:fixed after:top-0 after:left-0 after:z-10'
        : 'h-auto',
    ]"
  >
    <div class="w-full flex items-center justify-between">
      <NuxtLink to="/" class="w-fit uppercase" @click="isMobileMenu = false">
        <p>
          Boss lady <br />
          digital wealth
        </p>
      </NuxtLink>

      <button
        type="button"
        role="menu"
        class="w-14 flex flex-col"
        :class="[isMobileMenu ? '*:bg-white gap-0' : '*:bg-[#1a1a1a] gap-2']"
        @click="isMobileMenu = !isMobileMenu"
      >
        <span
          class="w-full h-1"
          :class="[isMobileMenu ? 'rotate-45' : '']"
        ></span>
        <span
          class="w-full h-1"
          :class="[isMobileMenu ? '-rotate-45' : '']"
        ></span>
      </button>
    </div>

    <ul
      class="mt-20 flex flex-col items-center gap-12 *:font-medium *:text-xl"
      :class="[isMobileMenu ? 'flex' : 'hidden']"
    >
      <NuxtLink
        v-for="link in defaultLinks"
        :to="link.path"
        class="uppercase text-center"
        @click="isMobileMenu = false"
        >{{ link.link }}</NuxtLink
      >
      <p class="uppercase">Log In</p>
    </ul>
  </nav>
</template>
