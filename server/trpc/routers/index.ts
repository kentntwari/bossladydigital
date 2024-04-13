import { z } from "zod";
import { zodProductSchema } from "~/utils/zodSchemas";
import { publicProcedure, router } from "../trpc";
import * as db from "~/utils/db";
import { stripe } from "~/utils/stripe";

export const appRouter = router({
  getProducts: publicProcedure.query(() => db.getProducts()),

  getCustomerOrders: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(({ input: { email } }) => db.getCustomerOrders(email)),

  createProduct: publicProcedure
    .input(zodProductSchema)
    .mutation(({ input }) => db.createNewProduct(input)),

  createOrder: publicProcedure
    .input(
      z.object({
        user: z.object({
          name: z.string().min(1),
          email: z.string().email(),
        }),
        productId: z.string(),
        sessionId: z.string(),
        isPaymentDone: z.boolean(),
      })
    )
    .mutation(({ input: { user, productId, sessionId, isPaymentDone } }) =>
      db.createOrder(user.name, user.email, productId, sessionId, isPaymentDone)
    ),

  getStoredSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .query(({ input: { sessionId } }) => db.getSessionFromDb(sessionId)),

  getSessionOrders: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        userEmail: z.string().email(),
      })
    )
    .query(({ input: { sessionId, userEmail } }) =>
      db.getOrdersBySession(sessionId, userEmail)
    ),

  updateSessionViewedState: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(({ input: { sessionId } }) =>
      db.updateSessionViewedState(sessionId)
    ),

  createStripeSession: publicProcedure
    .input(
      z.object({
        priceId: z.string(),
        currentUser: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
      })
    )
    .mutation(async ({ input: { priceId, currentUser } }) => {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          nameOfUser: currentUser.name,
          emailOfUser: currentUser.email,
        },
        mode: "payment",
        success_url:
          "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/shop",
      });

      return session;
    }),

  updateProduct: publicProcedure
    .input(zodProductSchema)
    .mutation(({ input }) => db.updateProduct(input)),

  deleteProduct: publicProcedure
    .input(z.string())
    .mutation(({ input }) => db.deleteProduct(input)),
});
