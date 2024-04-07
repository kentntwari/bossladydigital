import { z } from "zod";
import prisma from "~/utils/prisma";
import { zodProductSchema } from "~/utils/zodSchemas";
import { publicProcedure, router } from "../trpc";
import * as db from "~/utils/db";

export const appRouter = router({
  getProducts: publicProcedure.query(() => db.getProducts()),

  createProduct: publicProcedure
    .input(zodProductSchema)
    .mutation(({ input }) => db.createNewProduct(input)),

  updateProduct: publicProcedure
    .input(zodProductSchema)
    .mutation(({ input }) => db.updateProduct(input)),

  deleteProduct: publicProcedure
    .input(z.string())
    .mutation(({ input }) => db.deleteProduct(input)),
});
