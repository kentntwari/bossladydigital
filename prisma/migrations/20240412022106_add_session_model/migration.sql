-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "stripe_session_id" TEXT NOT NULL,
    "hasBeenViewed" BOOLEAN NOT NULL DEFAULT false,
    "order_id" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_stripe_session_id_key" ON "Session"("stripe_session_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_order_id_key" ON "Session"("order_id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
