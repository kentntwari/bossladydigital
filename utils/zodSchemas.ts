import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.object({
    id: z.string(),
    amount: z.number(),
  }),
  currency: z.string(),
  url: z.string(),
});

export const getCustomerOrdersSchema = z.object({ email: z.string().email() });

export const getStoredSessionSchema = z.object({ sessionId: z.string() });

export const deleteProductSchema = z.object({ productId: z.string() });

export const getSessionOrdersSchema = z.object({
  sessionId: z.string(),
  customerEmail: z.string().email(),
});

export const createOrderSchema = z.object({
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
  }),
  productId: z.string(),
  sessionId: z.string(),
  isPaymentDone: z.boolean(),
});

export const createStripeSessionSchema = z.object({
  priceId: z.string(),
  currentCustomer: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
});
