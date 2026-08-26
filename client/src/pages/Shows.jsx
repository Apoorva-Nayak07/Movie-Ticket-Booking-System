import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadShows = async () => {
      try {
        const response = await api.get("/shows");
        setShows(response.data?.data || []);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Unable to load shows."
        );
      } finally {
        setLoading(false);
      }
    };

    loadShows();
  }, []);

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <p className="eyebrow">CINESYNC</p>
          <h1>Available Shows</h1>
          <p>Choose a showtime and reserve your seats.</p>
        </div>
      </div>

      {loading && <p>Loading shows...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && shows.length === 0 && (
        <div className="empty-state">
          <h2>No shows available</h2>
          <p>There are currently no shows available.</p>
        </div>
      )}

      {!loading && !error && shows.length > 0 && (
        <div className="show-grid">
          {shows.map((show) => (
            <div className="show-card" key={show.id}>
              <div>
                <p className="eyebrow">{show.screenName}</p>

                <h2>{show.movie?.title || "Movie"}</h2>

                <p>
                  Date:{" "}
                  {show.showDate
                    ? new Date(show.showDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <p>
                  Time:{" "}
                  {show.startTime
                    ? new Date(show.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </p>

                <p>
                  Seats: {show.totalSeats || 20}
                </p>
              </div>

              <Link
                to={`/booking/${show.id}`}
                className="btn btn-primary"
              >
                Select Seats
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}