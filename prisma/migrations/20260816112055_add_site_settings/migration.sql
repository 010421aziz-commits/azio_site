-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "heroLocation" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "aboutTitle" TEXT NOT NULL,
    "aboutText" TEXT NOT NULL,
    "featuresTitle" TEXT NOT NULL,
    "programsTitle" TEXT NOT NULL,
    "teachersTitle" TEXT NOT NULL,
    "galleryTitle" TEXT NOT NULL,
    "contactTitle" TEXT NOT NULL,
    "stats" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
