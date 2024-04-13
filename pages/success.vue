<script lang="ts" setup>
  import { z } from "zod";

  definePageMeta({
    middleware: ["protected"],
  });
  const { $client } = useNuxtApp();

  const query = useRoute().query;

  const currentUserEmail = useAuth().user?.email;

  const { data, error } = useAsyncData("purchasedProducts", () =>
    $client.getSessionOrders.query({
      sessionId: z.string().parse(query.session_id),
      userEmail: z.string().email().parse(currentUserEmail),
    })
  );
</script>

<template>
  <ClientOnly>
    <div v-if="data" class="mx-5 space-y-4">
      <h1 class="uppercase text-xl text-balance">
        Thank you for your purchase
      </h1>
      <p>
        Your payment for
        <span class="font-bold italic underline">{{ data.product.name }}</span>
        was successfully processed. Please read the following instructions to
        get you started with the course. Moreover, you will receive an email
        detailing these same instructions
      </p>
    </div>
  </ClientOnly>
</template>
