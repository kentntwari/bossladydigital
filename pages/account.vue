<script lang="ts" setup>
  definePageMeta({
    middleware: ["protected"],
  });

  const { $client } = useNuxtApp();

  const { user } = useAuth();

  const { data: orders } = useAsyncData("orders", async () =>
    user
      ? await $client.getCustomerOrders.query({
          email: user.email,
        })
      : []
  );
</script>

<template>
  <ClientOnly>
    <section class="space-y-12">
      <div class="space-y-4">
        <h1 class="mx-5 uppercase text-xl text-balance">Account</h1>
        <div class="px-5 flex flex-col gap-2 text-base">
          <span>{{ user?.given_name }} {{ user?.family_name }}</span>
          <span>{{ user?.email }}</span>
        </div>
      </div>
      <section>
        <div class="h-8 flex items-center border-black border-y-[1px]">
          <h3 class="px-5 uppercase text-base">Orders</h3>
        </div>
        <div v-if="!orders || orders.length === 0"></div>
        <div v-else>
          <article
            v-for="(order, index) in orders"
            class="px-5 py-4 min-h-40 flex flex-col justify-between items-end border-b"
          >
            <span class="block w-full uppercase font-bold text-base">{{
              order?.name
            }}</span>
            <Button type="button">download</Button>
          </article>
        </div>
      </section>
    </section>
  </ClientOnly>
</template>
