import { z } from "zod";
import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import { zodProductSchema } from "./zodSchemas";

export async function getSessionFromDb(sessionId: string) {
  try {
    const session = await prisma.session.findUnique({
      where: {
        stripeSessionId: sessionId,
      },
    });

    await prisma.$disconnect();
    return session;
  } catch (error) {
    logErrors(error);
  }
}

export async function getOrdersBySession(sessionId: string, userEmail: string) {
  try {
    const currentSession = await getSessionFromDb(sessionId);

    const currentUser = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    console.log(userEmail);

    if (!currentUser) throw new Error("User not found");

    if (!currentSession) throw new Error("Session not found");

    const orders = await prisma.order.findFirst({
      where: {
        id: currentSession.orderId,
        userId: currentUser.id,
      },
      select: {
        product: true,
      },
    });

    if (!orders) throw new Error("Order not found");

    await prisma.$disconnect();
    return orders;
  } catch (error) {
    logErrors(error);
  }
}

export async function updateSessionViewedState(sessionId: string) {
  try {
    const session = await prisma.session.findUnique({
      where: {
        stripeSessionId: sessionId,
      },
      select: {
        hasBeenViewed: true,
      },
    });

    if (!session) throw new Error("Session not found");

    await prisma.session.update({
      where: {
        stripeSessionId: sessionId,
      },
      data: {
        hasBeenViewed: !session.hasBeenViewed ? true : false,
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    logErrors(error);
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany();
    await prisma.$disconnect();
    return products;
  } catch (error) {
    logErrors(error);
  }
}

export async function getCustomerOrders(email: string) {
  try {
    const orders = await prisma.$transaction(async (tx) => {
      const customer = await tx.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!customer) throw new Error("Customer not found");

      const purchasedProducts = await tx.order.findMany({
        where: {
          userId: customer.id,
        },
        select: {
          productId: true,
        },
      });

      return await Promise.all(
        purchasedProducts.map(
          async ({ productId }) =>
            await tx.product.findUnique({
              where: {
                id: productId,
              },
              select: {
                name: true,
                price: true,
                currency: true,
                description: true,
                checklistUrl: true,
              },
            })
        )
      );
    });

    await prisma.$disconnect();
    return orders;
  } catch (error) {
    logErrors(error);
  }
}

export async function createNewProduct(
  product: z.infer<typeof zodProductSchema>
) {
  try {
    await prisma.product.create({
      data: {
        name: product.name,
        price: product.price.amount,
        currency: product.currency,
        description: product.description,
        stripeProductId: product.id,
        stripePriceId: product.price.id,
        checklistUrl: product.url,
      },
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    logErrors(error);
  }
}

export async function createOrder(
  userName: string,
  userEmail: string,
  productId: string,
  sessionId: string,
  isPaymentDone: boolean
) {
  try {
    await prisma.$transaction(async (tx) => {
      //find user
      const currentUser = await tx.user.findUnique({
        where: { email: userEmail },
      });

      const productPurchased = await tx.product.findFirst({
        where: {
          stripeProductId: productId,
        },
      });

      const payment = await tx.payment.create({
        data: {
          isDone: isPaymentDone,
        },
      });

      if (!productPurchased) throw new Error("Product not found");

      if (!currentUser) {
        const newUser = await tx.user.create({
          data: {
            name: userName,
            email: userEmail,
          },
        });

        return await tx.order.create({
          data: {
            userId: newUser.id,
            productId: productPurchased.id,
            paymentId: payment.id,
            session: {
              create: {
                stripeSessionId: sessionId,
                paymentId: payment.id,
              },
            },
          },
        });
      }

      if (currentUser) {
        return await tx.order.create({
          data: {
            userId: currentUser.id,
            productId: productPurchased.id,
            paymentId: payment.id,
            session: {
              create: {
                stripeSessionId: sessionId,
                paymentId: payment.id,
              },
            },
          },
        });
      }
    });

    await prisma.$disconnect();
    return;
  } catch (error) {
    logErrors(error);
  }
}

export async function updateProduct(product: z.infer<typeof zodProductSchema>) {
  try {
    await prisma.product.upsert({
      where: {
        stripeProductId: product.id,
      },
      update: {
        name: product.name,
        price: product.price.amount,
        currency: product.currency,
        description: product.description,
        stripePriceId: product.price.id,
        checklistUrl: product.url,
      },
      create: {
        name: product.name,
        price: product.price.amount,
        currency: product.currency,
        description: product.description,
        stripeProductId: product.id,
        stripePriceId: product.price.id,
        checklistUrl: product.url,
      },
    });
  } catch (error) {
    logErrors(error);
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: {
        stripeProductId: id,
      },
    });
  } catch (error) {
    logErrors(error);
  }
}

function logErrors(error: unknown) {
  switch (true) {
    // This error is thrown when the query is invalid
    case error instanceof Prisma.PrismaClientKnownRequestError:
      console.error("PrismaClientKnownRequestError", error.message);
      break;

    // This error is thrown when the Prisma Client encounters an unknown error
    case error instanceof Prisma.PrismaClientUnknownRequestError:
      console.error("PrismaClientUnknownRequestError", error.message);
      break;

    // This error is thrown when the Prisma Client encounters a Rust panic
    case error instanceof Prisma.PrismaClientRustPanicError:
      console.error("PrismaClientRustPanicError", error.message);
      break;

    // This error is thrown when the Prisma Client could not be initialized
    case error instanceof Prisma.PrismaClientInitializationError:
      console.error("PrismaClientInitializationError", error.message);
      break;

    // This error is thrown when validation fails, read more here: https://www.prisma.io/docs/orm/reference/error-reference
    case error instanceof Prisma.PrismaClientValidationError:
      console.error("PrismaClientValidationError", error.message);
      break;

    // This error is thrown when you try to call `findMany` on an undefined object
    case error instanceof TypeError:
      console.error("TypeError", error.message);
      break;

    default:
      // Unknown error
      console.error("Unknown error", error);
      break;
  }
}
