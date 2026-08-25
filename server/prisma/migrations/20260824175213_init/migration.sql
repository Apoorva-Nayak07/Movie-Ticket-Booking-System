-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'BOOKED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "genre" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "poster_url" TEXT,
    "rating" DECIMAL(3,1),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shows" (
    "id" UUID NOT NULL,
    "movie_id" UUID NOT NULL,
    "show_date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "screen_name" TEXT NOT NULL,
    "total_seats" INTEGER NOT NULL DEFAULT 20,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" UUID NOT NULL,
    "show_id" UUID NOT NULL,
    "seat_number" TEXT NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "show_id" UUID NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelled_at" TIMESTAMP(3),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_seats" (
    "id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "seat_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "shows_movie_id_idx" ON "shows"("movie_id");

-- CreateIndex
CREATE INDEX "shows_show_date_idx" ON "shows"("show_date");

-- CreateIndex
CREATE INDEX "seats_show_id_status_idx" ON "seats"("show_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "seats_show_id_seat_number_key" ON "seats"("show_id", "seat_number");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_show_id_idx" ON "bookings"("show_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "booking_seats_booking_id_idx" ON "booking_seats"("booking_id");

-- CreateIndex
CREATE INDEX "booking_seats_seat_id_idx" ON "booking_seats"("seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_seats_booking_id_seat_id_key" ON "booking_seats"("booking_id", "seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_seats_seat_id_key" ON "booking_seats"("seat_id");

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
