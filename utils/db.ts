import { z } from "zod";
import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import { zodProductSchema } from "./zodSchemas";

export async function getProducts() {
  try {
    const products = await prisma.product.findMany();
    await prisma.$disconnect();
    return products;
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
