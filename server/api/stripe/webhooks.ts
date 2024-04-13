import { caller } from "~/server/trpc/caller";
import { stripe } from "~/utils/stripe";
import Stripe from "stripe";

// Utility function to normalize the signature header
function getNormalizedSignature(
  signatureHeader: string | string[] | Buffer | undefined
): string | Buffer | string[] {
  if (Array.isArray(signatureHeader)) {
    return signatureHeader;
  }

  if (Buffer.isBuffer(signatureHeader)) {
    return signatureHeader;
  }

  if (typeof signatureHeader === "string") {
    return signatureHeader;
  }
  return "";
}

export default defineEventHandler(async (event) => {
  let body = await readRawBody(event, "utf-8");
  const signature = event.node.req.headers["stripe-signature"];
  let webhookEvent: Stripe.Event;

  switch (true) {
    case body !== undefined && process.env.STRIPE_WEBHOOK_SECRET !== undefined:
      try {
        webhookEvent = stripe.webhooks.constructEvent(
          body,
          getNormalizedSignature(signature),
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (error) {
        throw createError({
          statusCode: 400,
          message: `⚠️  Webhook signature verification failed.`,
          cause: error,
        });
      }

      const data: Stripe.Event.Data = webhookEvent.data;
      const eventType: Stripe.Event.Type = webhookEvent.type;

      if (eventType === "product.updated") {
        const payload = data.object as Stripe.Product;

        const product = await stripe.products.retrieve(payload.id, {
          expand: ["default_price"],
        });

        const price = await product.default_price;

        if (price && typeof price !== "string")
          await caller({}).updateProduct({
            id: product.id,
            name: product.name,
            description: product.description ?? "NO_DESCRIPTION",
            price: {
              id: price.id,
              amount: price.unit_amount ?? 0,
            },
            currency: price.currency,
            url: product.metadata?.url ?? "NO_URL",
          });
      }

      if (eventType === "product.deleted") {
        const payload = data.object as Stripe.Product;

        await caller({}).deleteProduct(payload.id);
      }

      if (eventType === "checkout.session.completed") {
        const session = data.object as Stripe.Checkout.Session;

        const productPurchasedId = await stripe.checkout.sessions
          .retrieve(session.id, {
            expand: ["line_items"],
          })
          .then((p) => p.line_items?.data[0].price?.product);

        if (typeof productPurchasedId === "string") {
          await caller({}).createOrder({
            user: {
              name: session.metadata?.nameOfUser!,
              email: session.metadata?.emailOfUser!,
            },
            productId: productPurchasedId,
            sessionId: session.id,
            isPaymentDone: session.payment_status === "paid" ? true : false,
          });
        }
      }

      setResponseStatus(event, 200);
      return;

    default:
      throw createError({
        status: 400,
        message: "invalid request",
      });
  }
});
