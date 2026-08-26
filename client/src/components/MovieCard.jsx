import { CalendarDays, Star, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const title = movie?.title || "Untitled Movie";

  const poster =
    movie?.posterUrl ||
    movie?.poster ||
    `https://placehold.co/500x750/111827/ffffff?text=${encodeURIComponent(
      title
    )}`;

  return (
    <article className="movie-card">
      <div className="movie-poster">
        <img
          src={poster}
          alt={title}
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/500x750/111827/ffffff?text=${encodeURIComponent(
              title
            )}`;
          }}
        />

        <div className="movie-poster-overlay">
          <span className="hero-badge">
            <Star size={13} fill="currentColor" />
            Featured
          </span>
        </div>
      </div>

      <div className="movie-info">
        <h3>{title}</h3>

        <div className="movie-meta">
          <span>
            <Star
              size={13}
              fill="currentColor"
              className="movie-rating"
            />{" "}
            4.8
          </span>

          <span>•</span>

          <span>
            <CalendarDays size={13} />
          </span>

          <span>Now Showing</span>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%" }}
          onClick={() =>
            navigate(
              `/movies/${movie?.id || ""}`
            )
          }
        >
          <Ticket size={16} />
          Book Tickets
        </button>
      </div>
    </article>
  );
}