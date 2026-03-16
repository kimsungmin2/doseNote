-- CreateEnum
CREATE TYPE "DoseUnit" AS ENUM ('MG', 'ML', 'UNIT');

-- CreateEnum
CREATE TYPE "InjectionSite" AS ENUM ('ABDOMEN', 'THIGH', 'UPPER_ARM', 'OTHER');

-- CreateEnum
CREATE TYPE "SymptomType" AS ENUM ('NAUSEA', 'HEADACHE', 'CONSTIPATION', 'DIARRHEA', 'FATIGUE', 'APPETITE_LOSS', 'DIZZINESS', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "medication_name" TEXT NOT NULL,
    "default_dosage_value" DECIMAL(6,2) NOT NULL,
    "default_dosage_unit" "DoseUnit" NOT NULL,
    "schedule_interval_days" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "injection_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "medication_profile_id" TEXT NOT NULL,
    "injected_at" TIMESTAMP(3) NOT NULL,
    "dosage_value" DECIMAL(6,2) NOT NULL,
    "dosage_unit" "DoseUnit" NOT NULL,
    "injection_site" "InjectionSite" NOT NULL,
    "memo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "injection_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weight_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "weight_kg" DECIMAL(5,2) NOT NULL,
    "memo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "weight_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symptom_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "injection_record_id" TEXT,
    "symptom_type" "SymptomType" NOT NULL,
    "severity" INTEGER NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "memo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "symptom_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "medication_profiles_user_id_is_active_idx" ON "medication_profiles"("user_id", "is_active");

-- CreateIndex
CREATE INDEX "medication_profiles_user_id_created_at_idx" ON "medication_profiles"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "injection_records_user_id_injected_at_idx" ON "injection_records"("user_id", "injected_at" DESC);

-- CreateIndex
CREATE INDEX "injection_records_medication_profile_id_injected_at_idx" ON "injection_records"("medication_profile_id", "injected_at" DESC);

-- CreateIndex
CREATE INDEX "weight_records_user_id_recorded_at_idx" ON "weight_records"("user_id", "recorded_at" DESC);

-- CreateIndex
CREATE INDEX "symptom_records_user_id_recorded_at_idx" ON "symptom_records"("user_id", "recorded_at" DESC);

-- CreateIndex
CREATE INDEX "symptom_records_injection_record_id_recorded_at_idx" ON "symptom_records"("injection_record_id", "recorded_at" DESC);

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "medication_profiles" ADD CONSTRAINT "medication_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "injection_records" ADD CONSTRAINT "injection_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "injection_records" ADD CONSTRAINT "injection_records_medication_profile_id_fkey" FOREIGN KEY ("medication_profile_id") REFERENCES "medication_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weight_records" ADD CONSTRAINT "weight_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symptom_records" ADD CONSTRAINT "symptom_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symptom_records" ADD CONSTRAINT "symptom_records_injection_record_id_fkey" FOREIGN KEY ("injection_record_id") REFERENCES "injection_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
