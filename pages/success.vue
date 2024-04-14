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
      customerEmail: z.string().email().parse(currentUserEmail),
    })
  );
</script>

<template>
  <ClientOnly>
    <div class="mx-5 space-y-4">
      <template v-if="data">
        <h1 class="uppercase text-xl text-balance">
          Thank you for your purchase
        </h1>
        <p>
          Your payment for
          <span class="font-bold italic underline">{{
            data.product.name
          }}</span>
          was successfully processed. Please read the following instructions to
          get you started with the course. Moreover, you will receive an email
          detailing these same instructions
        </p>
      </template>

      <template v-if="error">
        <p>
          Hmm, this ressource doesn't exist or may have been moved
          permanently
        </p>
      </template>
    </div>
  </ClientOnly>
</template>
