require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const movies = [
  {
    title: "Neon Horizon",
    description: "A futuristic thriller about a city controlled by an unknown intelligence.",
    genre: "Sci-Fi",
    language: "English",
    durationMinutes: 128,
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    rating: 8.4,
  },
  {
    title: "The Last Signal",
    description: "A mysterious transmission changes the lives of a group of young engineers.",
    genre: "Thriller",
    language: "English",
    durationMinutes: 116,
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    rating: 8.1,
  },
  {
    title: "Midnight Protocol",
    description: "An undercover cybersecurity expert races against time to stop a global attack.",
    genre: "Action",
    language: "English",
    durationMinutes: 134,
    posterUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    rating: 8.7,
  },
  {
    title: "Echoes of Tomorrow",
    description: "A scientist discovers a way to communicate with her future self.",
    genre: "Drama",
    language: "English",
    durationMinutes: 121,
    posterUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c",
    rating: 8.5,
  },
];

async function main() {
  console.log("🌱 Starting CineSync database seed...");

  // Clear existing demo data.
  await prisma.bookingSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.show.deleteMany();
  await prisma.movie.deleteMany();

  for (const movieData of movies) {
    const movie = await prisma.movie.create({
      data: movieData,
    });

    console.log(`🎬 Created movie: ${movie.title}`);

    for (let showIndex = 0; showIndex < 2; showIndex++) {
      const showDate = new Date();
      showDate.setDate(showDate.getDate() + showIndex + 1);
      showDate.setHours(0, 0, 0, 0);

      const startTime = new Date();
      startTime.setHours(showIndex === 0 ? 18 : 21, 0, 0, 0);

      const show = await prisma.show.create({
        data: {
          movieId: movie.id,
          showDate,
          startTime,
          screenName: showIndex === 0 ? "Screen 1" : "Screen 2",
          totalSeats: 20,
        },
      });

      const seats = [];

      for (let i = 1; i <= 20; i++) {
        seats.push({
          showId: show.id,
          seatNumber: `A${i}`,
          status: "AVAILABLE",
        });
      }

      await prisma.seat.createMany({
        data: seats,
      });

      console.log(
        `   🪑 Created show ${show.id} with 20 seats`
      );
    }
  }

  console.log("✅ CineSync database seeded successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });