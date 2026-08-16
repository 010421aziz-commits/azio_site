-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "aboutImage" TEXT NOT NULL DEFAULT '/images/hero-graduation.png',
ADD COLUMN     "logo" TEXT NOT NULL DEFAULT '/images/logo.png';
