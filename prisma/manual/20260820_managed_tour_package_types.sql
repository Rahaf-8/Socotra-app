-- REVIEW AND APPLY MANUALLY TO SUPABASE POSTGRESQL BEFORE DEPLOYING THE CODE.
-- This preserves every Tour row and its existing packageType value in place.
-- Do not run this through the checked-in legacy SQLite migration history.

BEGIN;

-- Abort before any schema change if the existing enum-backed values are not
-- exactly among the three values supported by the current production schema.
DO $guard_existing_package_types$
DECLARE
  unexpected_values TEXT;
BEGIN
  SELECT string_agg(DISTINCT "packageType"::TEXT, ', ' ORDER BY "packageType"::TEXT)
    INTO unexpected_values
  FROM "Tour"
  WHERE "packageType" IS NOT NULL
    AND "packageType"::TEXT NOT IN ('group', 'camping', 'comfy');

  IF unexpected_values IS NOT NULL THEN
    RAISE EXCEPTION
      'Aborting managed package type migration: unexpected Tour.packageType value(s): %',
      unexpected_values;
  END IF;
END
$guard_existing_package_types$;

-- Prisma defines no default for Tour.packageType. PostgreSQL cannot cast an
-- enum-dependent default while changing the column to TEXT, so explicitly
-- remove any live database default before the type conversion and do not
-- invent or restore a default that is absent from the target schema.
DO $drop_package_type_default$
DECLARE
  existing_default TEXT;
BEGIN
  SELECT pg_get_expr(ad.adbin, ad.adrelid)
    INTO existing_default
  FROM pg_attribute AS a
  JOIN pg_class AS c ON c.oid = a.attrelid
  JOIN pg_namespace AS n ON n.oid = c.relnamespace
  LEFT JOIN pg_attrdef AS ad
    ON ad.adrelid = a.attrelid
   AND ad.adnum = a.attnum
  WHERE n.nspname = current_schema()
    AND c.relname = 'Tour'
    AND a.attname = 'packageType'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'Aborting managed package type migration: Tour.packageType was not found in schema %',
      current_schema();
  END IF;

  IF existing_default IS NOT NULL THEN
    ALTER TABLE "Tour" ALTER COLUMN "packageType" DROP DEFAULT;
  END IF;
END
$drop_package_type_default$;

-- Remove the Tour column's dependency on the old enum before dropping that
-- enum. Existing values are cast in place; no Tour row is reassigned or nulled.
ALTER TABLE "Tour"
  ALTER COLUMN "packageType" TYPE TEXT
  USING "packageType"::TEXT;

DROP TYPE "TourPackageType";

-- Creating the table is now safe because its automatically created composite
-- type no longer conflicts with the old enum name.
CREATE TABLE "TourPackageType" (
  "key" TEXT NOT NULL,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "status" "PublicationStatus" NOT NULL DEFAULT 'published',
  CONSTRAINT "TourPackageType_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "TourPackageTypeTranslation" (
  "id" TEXT NOT NULL,
  "packageKey" TEXT NOT NULL,
  "locale" "Locale" NOT NULL,
  "label" TEXT NOT NULL,
  CONSTRAINT "TourPackageTypeTranslation_pkey" PRIMARY KEY ("id")
);

INSERT INTO "TourPackageType" ("key", "displayOrder", "status") VALUES
  ('group', 1, 'published'),
  ('camping', 2, 'published'),
  ('comfy', 3, 'published');

INSERT INTO "TourPackageTypeTranslation" ("id", "packageKey", "locale", "label") VALUES
  ('tour-package-type-group-en', 'group', 'en', 'Group'),
  ('tour-package-type-group-ar', 'group', 'ar', U&'\062C\0645\0627\0639\064A'),
  ('tour-package-type-camping-en', 'camping', 'en', 'Camping'),
  ('tour-package-type-camping-ar', 'camping', 'ar', U&'\062A\062E\064A\064A\0645'),
  ('tour-package-type-comfy-en', 'comfy', 'en', 'Comfy'),
  ('tour-package-type-comfy-ar', 'comfy', 'ar', U&'\0645\0631\064A\062D');

CREATE UNIQUE INDEX "TourPackageTypeTranslation_packageKey_locale_key"
  ON "TourPackageTypeTranslation"("packageKey", "locale");

CREATE INDEX "TourPackageType_status_displayOrder_idx"
  ON "TourPackageType"("status", "displayOrder");

ALTER TABLE "TourPackageTypeTranslation"
  ADD CONSTRAINT "TourPackageTypeTranslation_packageKey_fkey"
  FOREIGN KEY ("packageKey") REFERENCES "TourPackageType"("key")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Defensively verify the backfill before introducing the restrictive Tour FK.
DO $guard_package_type_backfill$
DECLARE
  unmapped_values TEXT;
BEGIN
  SELECT string_agg(DISTINCT t."packageType", ', ' ORDER BY t."packageType")
    INTO unmapped_values
  FROM "Tour" AS t
  LEFT JOIN "TourPackageType" AS pt ON pt."key" = t."packageType"
  WHERE t."packageType" IS NOT NULL
    AND pt."key" IS NULL;

  IF unmapped_values IS NOT NULL THEN
    RAISE EXCEPTION
      'Aborting managed package type migration: Tour.packageType value(s) lack a TourPackageType row: %',
      unmapped_values;
  END IF;
END
$guard_package_type_backfill$;

ALTER TABLE "Tour"
  ADD CONSTRAINT "Tour_packageType_fkey"
  FOREIGN KEY ("packageType") REFERENCES "TourPackageType"("key")
  ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
