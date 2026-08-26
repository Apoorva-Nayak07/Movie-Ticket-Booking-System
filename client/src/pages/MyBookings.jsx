import { useEffect, useState } from "react";
import api from "../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      const response = await api.get("/bookings");
      setBookings(response.data?.data || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      await api.post(`/bookings/${bookingId}/cancel`);

      await loadBookings();

      alert("Booking cancelled successfully.");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to cancel booking."
      );
    }
  };

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <p className="eyebrow">ACCOUNT</p>
          <h1>My Bookings</h1>
          <p>View and manage your movie reservations.</p>
        </div>
      </div>

      {loading && <p>Loading bookings...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <div className="empty-state">
          <h2>No bookings yet</h2>
          <p>Your confirmed bookings will appear here.</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="booking-list">
          {bookings.map((booking) => {
            const seats =
              booking.bookingSeats
                ?.map((item) => item.seat?.seatNumber)
                .filter(Boolean)
                .join(", ") || "N/A";

            return (
              <div className="booking-card" key={booking.id}>
                <div>
                  <p className="eyebrow">
                    {booking.status}
                  </p>

                  <h2>
                    {booking.show?.movie?.title || "Movie"}
                  </h2>

                  <p>
                    Seats: <strong>{seats}</strong>
                  </p>

                  <p>
                    Screen:{" "}
                    {booking.show?.screenName || "N/A"}
                  </p>

                  <p>
                    Booking ID:{" "}
                    <small>{booking.id}</small>
                  </p>
                </div>

                {booking.status === "CONFIRMED" && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}