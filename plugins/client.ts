import { createTRPCNuxtClient, httpBatchLink } from "trpc-nuxt/client";
import { appRouter } from "~/server/trpc/routers";

export default defineNuxtPlugin(() => {
  /**
   * createTRPCNuxtClient adds a `useQuery` composable
   * built on top of `useAsyncData`.
   */
  const client = createTRPCNuxtClient<typeof appRouter>({
    links: [
      httpBatchLink({
        url: "/api/trpc",
      }),
    ],
  });

  return {
    provide: {
      client,
    },
  };
});
