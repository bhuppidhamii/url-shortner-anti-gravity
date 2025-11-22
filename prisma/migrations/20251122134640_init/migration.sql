-- CreateTable
CREATE TABLE "links" (
    "id" BIGINT NOT NULL,
    "original_url" TEXT NOT NULL,
    "short_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "user_id" UUID,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clicks" (
    "id" BIGSERIAL NOT NULL,
    "link_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "country" TEXT,

    CONSTRAINT "clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_short_code_key" ON "links"("short_code");

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
