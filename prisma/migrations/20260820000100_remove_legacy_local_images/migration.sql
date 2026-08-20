ALTER TABLE "SiteSettings"
  ALTER COLUMN "logo" SET DEFAULT '',
  ALTER COLUMN "aboutImage" SET DEFAULT '';

UPDATE "Teacher"
SET "image" = NULL
WHERE "image" IN (
  '/images/mudur.jpeg',
  '/images/ustaz2.jpeg',
  '/images/hero-graduation.png',
  '/images/home.jpeg'
);

DELETE FROM "Gallery"
WHERE "image" IN (
  '/images/mudur.jpeg',
  '/images/ustaz2.jpeg',
  '/images/hero-graduation.png',
  '/images/home.jpeg'
);

UPDATE "SiteSettings"
SET
  "logo" = CASE WHEN "logo" = '/images/logo.png' THEN '' ELSE "logo" END,
  "aboutImage" = CASE WHEN "aboutImage" = '/images/hero-graduation.png' THEN '' ELSE "aboutImage" END;