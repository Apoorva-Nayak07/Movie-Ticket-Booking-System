export default function SeatGrid({
  seats,
  selectedSeats,
  onToggle,
}) {
  return (
    <section className="seat-section">
      <div className="screen">
        <span>SCREEN</span>
      </div>

      <p className="seat-instruction">
        Select your preferred seats
      </p>

      <div className="seat-grid">
        {seats.map((seat) => {
          const isBooked = seat.status === "BOOKED";

          const isSelected = selectedSeats.includes(
            seat.seatNumber
          );

          return (
            <button
              key={seat.id}
              type="button"
              disabled={isBooked}
              onClick={() =>
                !isBooked && onToggle(seat.seatNumber)
              }
              className={`seat ${
                isBooked
                  ? "seat-booked"
                  : isSelected
                  ? "seat-selected"
                  : "seat-available"
              }`}
              title={
                isBooked
                  ? "Seat already booked"
                  : `Select ${seat.seatNumber}`
              }
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <span className="legend-box available" />
          <span>Available</span>
        </div>

        <div className="legend-item">
          <span className="legend-box selected" />
          <span>Selected</span>
        </div>

        <div className="legend-item">
          <span className="legend-box booked" />
          <span>Booked</span>
        </div>
      </div>
    </section>
  );
}