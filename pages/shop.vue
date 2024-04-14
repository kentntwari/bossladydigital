<script lang="ts" setup>
  const { $client } = useNuxtApp();

  const { data: products } = useAsyncData("products", () =>
    $client.getProducts.query()
  );
</script>

<template>
  <section class="space-y-12">
    <h1 class="ml-5 uppercase text-xl">Products</h1>
    <div class="grid grid-cols-1">
      <template v-if="products">
        <article
          v-for="(product, index) in products"
          :key="product.id"
          class="px-5 py-6 space-y-10 border-[#1a1a1a]"
          :class="[
            index === products.length - 1 ? 'border-t border-b' : 'border-t',
          ]"
        >
          <div class="flex flex-col gap-4">
            <p class="font-bold uppercase text-base">{{ product.name }}</p>
            <span class="text-base">{{ product.description }}</span>
          </div>

          <div class="w-full flex items-center justify-between">
            <span class="text-base">${{ +product.price / 100 }}</span>
            <Button
              type="button"
              @click="
                async (event) => {
                  if (!$auth.loggedIn)
                    return navigateTo('/api/login', { external: true });

                  const session = await $client.createStripeSession.mutate({
                    priceId: product.stripePriceId,
                    currentCustomer: {
                      name: `${$auth.user.given_name} ${$auth.user.family_name}`,
                      email: $auth.user.email,
                    },
                  });

                  return await navigateTo(session.url, { external: true });
                }
              "
              >purchase</Button
            >
          </div>
        </article>
      </template>
    </div>
  </section>
</template>
