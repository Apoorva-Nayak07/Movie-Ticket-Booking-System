import { useLocation, useNavigate } from "react-router-dom";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const show = location.state?.show;

  if (!show) {
    return (
      <div>
        <h1>Booking</h1>
        <p>No show selected.</p>

        <button onClick={() => navigate("/shows")}>
          Browse Shows
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Book Tickets</h1>

      <h2>{show.movie?.title}</h2>

      <p>
        Screen: {show.screenName}
      </p>

      <p>
        Date: {show.showDate}
      </p>

      <p>
        Time: {show.startTime}
      </p>

      <p>
        Total Seats: {show.totalSeats}
      </p>
    </div>
  );
}

export default Booking;