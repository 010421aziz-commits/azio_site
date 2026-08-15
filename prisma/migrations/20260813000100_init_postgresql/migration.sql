-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "Admin" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "password" TEXT NOT NULL, "name" TEXT NOT NULL DEFAULT 'Administrator', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Admin_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Teacher" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "position" TEXT NOT NULL, "bio" TEXT, "image" TEXT, "order" INTEGER NOT NULL DEFAULT 0, "active" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Program" ("id" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL, "icon" TEXT NOT NULL DEFAULT 'BookOpen', "topics" TEXT[], "order" INTEGER NOT NULL DEFAULT 0, "active" BOOLEAN NOT NULL DEFAULT true, CONSTRAINT "Program_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Gallery" ("id" TEXT NOT NULL, "image" TEXT NOT NULL, "caption" TEXT, "alt" TEXT, "order" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id"));
CREATE TABLE "News" ("id" TEXT NOT NULL, "title" TEXT NOT NULL, "slug" TEXT NOT NULL, "excerpt" TEXT NOT NULL, "content" TEXT NOT NULL, "image" TEXT, "published" BOOLEAN NOT NULL DEFAULT false, "publishedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "News_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Setting" ("id" TEXT NOT NULL, "key" TEXT NOT NULL, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Setting_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Contact" ("id" TEXT NOT NULL, "address" TEXT NOT NULL, "phone" TEXT NOT NULL, "instagram" TEXT NOT NULL, "mapUrl" TEXT, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Contact_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Message" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT, "phone" TEXT NOT NULL, "message" TEXT NOT NULL, "read" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Message_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");
