-- AlterTable
ALTER TABLE "public"."Campaign" ADD COLUMN     "designJson" TEXT,
ADD COLUMN     "htmlContent" TEXT;

-- AlterTable
ALTER TABLE "public"."Template" ADD COLUMN     "designJson" TEXT;

-- CreateTable
CREATE TABLE "public"."EmailDesign" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "htmlContent" TEXT NOT NULL,
    "designJson" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'draft',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailDesign_pkey" PRIMARY KEY ("id")
);
