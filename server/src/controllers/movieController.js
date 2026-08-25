const prisma = require("../config/database");

// GET /api/movies
const getMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            shows: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    console.error("Get movies error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch movies",
    });
  }
};

// GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await prisma.movie.findUnique({
      where: {
        id,
      },
      include: {
        shows: {
          orderBy: [
            {
              showDate: "asc",
            },
            {
              startTime: "asc",
            },
          ],
        },
      },
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error("Get movie error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch movie",
    });
  }
};

// GET /api/shows
const getShows = async (req, res) => {
  try {
    const shows = await prisma.show.findMany({
      orderBy: [
        {
          showDate: "asc",
        },
        {
          startTime: "asc",
        },
      ],
      include: {
        movie: true,
        _count: {
          select: {
            seats: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: shows,
    });
  } catch (error) {
    console.error("Get shows error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch shows",
    });
  }
};

// GET /api/shows/:id/seats
const getShowSeats = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await prisma.show.findUnique({
      where: {
        id,
      },
      include: {
        movie: true,
        seats: {
          orderBy: {
            seatNumber: "asc",
          },
        },
      },
    });

    if (!show) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    const availableSeats = show.seats.filter(
      (seat) => seat.status === "AVAILABLE"
    );

    res.status(200).json({
      success: true,
      data: {
        show: {
          id: show.id,
          movie: show.movie,
          showDate: show.showDate,
          startTime: show.startTime,
          screenName: show.screenName,
          totalSeats: show.totalSeats,
        },
        seats: show.seats,
        availableSeats: availableSeats.length,
      },
    });
  } catch (error) {
    console.error("Get seats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch show seats",
    });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  getShows,
  getShowSeats,
};