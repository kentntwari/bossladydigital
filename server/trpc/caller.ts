import { createCallerFactory } from "@/server/trpc/trpc";
import { appRouter } from "./routers";

export const caller = createCallerFactory(appRouter);
