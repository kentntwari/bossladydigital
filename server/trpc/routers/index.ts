import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";
import * as s from "~/utils/zodSchemas";
import * as db from "~/utils/db";
import { stripe } from "~/utils/stripe";

async function handleAsyncWithTRPCError<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
      cause: error,
    });
  }
}

export const appRouter = router({
  getProducts: publicProcedure.query(() =>
    handleAsyncWithTRPCError(db.getProducts)
  ),

  getCustomerOrders: publicProcedure
    .input(s.getCustomerOrdersSchema)
    .query(({ input: { email } }) =>
      handleAsyncWithTRPCError(() => db.getCustomerOrders(email))
    ),

  createProduct: publicProcedure
    .input(s.productSchema)
    .mutation(({ input }) => db.createNewProduct(input)),

  createOrder: publicProcedure
    .input(s.createOrderSchema)
    .mutation(({ input: { customer, productId, sessionId, isPaymentDone } }) =>
      handleAsyncWithTRPCError(() =>
        db.createOrder(
          customer.name,
          customer.email,
          productId,
          sessionId,
          isPaymentDone
        )
      )
    ),

  getStoredSession: publicProcedure
    .input(s.getStoredSessionSchema)
    .query(({ input: { sessionId } }) =>
      handleAsyncWithTRPCError(() => db.getSessionFromDb(sessionId))
    ),

  getSessionOrders: publicProcedure
    .input(s.getSessionOrdersSchema)
    .query(({ input: { sessionId, customerEmail } }) =>
      handleAsyncWithTRPCError(() =>
        db.getOrdersBySession(sessionId, customerEmail)
      )
    ),

  updateSessionViewedState: publicProcedure
    .input(s.getStoredSessionSchema)
    .mutation(({ input: { sessionId } }) =>
      handleAsyncWithTRPCError(() => db.updateSessionViewedState(sessionId))
    ),

  createStripeSession: publicProcedure
    .input(s.createStripeSessionSchema)
    .mutation(async ({ input: { priceId, currentCustomer } }) => {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          nameOfCustomer: currentCustomer.name,
          emailOfCustomer: currentCustomer.email,
        },
        mode: "payment",
        success_url:
          "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/shop",
      });

      return session;
    }),

  updateProduct: publicProcedure
    .input(s.productSchema)
    .mutation(({ input }) =>
      handleAsyncWithTRPCError(() => db.updateProduct(input))
    ),

  deleteProduct: publicProcedure
    .input(s.deleteProductSchema)
    .mutation(({ input: { productId } }) =>
      handleAsyncWithTRPCError(() => db.deleteProduct(productId))
    ),
});
