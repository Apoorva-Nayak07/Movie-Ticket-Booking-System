import { useEffect, useState } from "react";
import { Search, Film } from "lucide-react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const response = await api.get("/movies");

      setMovies(response.data?.data || []);
    } catch (error) {
      console.error("Failed to load movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Film size={14} />
            CINESYNC MOVIE EXPERIENCE
          </div>

          <h1>
            Your next
            <br />
            <span>great story</span>
            <br />
            starts here.
          </h1>

          <p className="hero-description">
            Discover the latest movies, explore available
            shows, choose your perfect seats, and book your
            cinema experience in seconds.
          </p>

          <div className="hero-actions">
            <a href="#movies" className="btn btn-primary">
              Explore Movies
            </a>

            <a href="/shows" className="btn btn-secondary">
              View Shows
            </a>
          </div>
        </div>
      </section>

      <section
        className="movie-section"
        id="movies"
      >
        <div className="section-header">
          <div>
            <div className="eyebrow">
              CINEMA COLLECTION
            </div>

            <h2>Now Showing</h2>

            <p>
              Pick a movie and reserve your seats.
            </p>
          </div>

          <div
            style={{
              position: "relative",
              marginTop: "20px",
            }}
          >
            <Search
              size={17}
              style={{
                position: "absolute",
                left: 13,
                top: 13,
                color: "#737b8d",
              }}
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search movies..."
              style={{
                width: 230,
                height: 43,
                padding: "0 14px 0 40px",
                borderRadius: 9,
                outline: "none",
                border:
                  "1px solid rgba(255,255,255,.1)",
                background: "#0f1626",
                color: "#fff",
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">
            Loading movies...
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="empty-state">
            <Film
              size={38}
              style={{ margin: "0 auto 15px" }}
            />

            <h3>No movies found</h3>

            <p style={{ marginTop: 8 }}>
              Try another search.
            </p>
          </div>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}