ALTER TABLE "Message" ADD COLUMN "answers" JSONB NOT NULL DEFAULT '{}';

CREATE TABLE "FormConfig" (
  "id" TEXT NOT NULL DEFAULT 'main',
  "title" TEXT NOT NULL DEFAULT 'Бизге жазыңыз',
  "subtitle" TEXT NOT NULL DEFAULT 'Суроолоруңузга жооп беребиз',
  "buttonText" TEXT NOT NULL DEFAULT 'Кабар жөнөтүү',
  "successMessage" TEXT NOT NULL DEFAULT 'Кабарыңыз жөнөтүлдү. Жакында байланышабыз!',
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FormConfig_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FormField" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "required" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  "configId" TEXT NOT NULL DEFAULT 'main',
  CONSTRAINT "FormField_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FormField_name_key" ON "FormField"("name");
ALTER TABLE "FormField" ADD CONSTRAINT "FormField_configId_fkey" FOREIGN KEY ("configId") REFERENCES "FormConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "FormConfig" ("id", "title", "subtitle", "buttonText", "successMessage", "updatedAt")
VALUES ('main', 'Бизге жазыңыз', 'Суроолоруңузга жооп беребиз', 'Кабар жөнөтүү', 'Кабарыңыз жөнөтүлдү. Жакында байланышабыз!', CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "FormField" ("id", "label", "name", "type", "required", "order", "configId") VALUES
  ('form-field-name', 'Аты-жөнүңүз', 'name', 'text', true, 0, 'main'),
  ('form-field-phone', 'Телефон номериңиз', 'phone', 'phone', true, 1, 'main'),
  ('form-field-email', 'Email (милдеттүү эмес)', 'email', 'email', false, 2, 'main'),
  ('form-field-message', 'Сурооңуз', 'message', 'textarea', true, 3, 'main')
ON CONFLICT ("name") DO NOTHING;