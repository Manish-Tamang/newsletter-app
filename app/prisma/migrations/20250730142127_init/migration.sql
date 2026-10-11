-- CreateTable
CREATE TABLE "public"."Template" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "content" TEXT NOT NULL,
    "htmlContent" TEXT,
    "isHtml" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "usage" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);
