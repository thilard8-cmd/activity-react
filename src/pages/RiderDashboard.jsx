import { useState } from "react";

export default function RiderDashboard({ onLogout }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [bookings, setBookings] = useState([]);

  function handleAddBooking(event) {
    event.preventDefault();

    const newBooking = {
      id: Date.now(),
      pickup,
      dropoff,
    };

    setBookings((current) => [...current, newBooking]);
    setPickup("");
    setDropoff("");
  }

  return (
    <div className="bg-primary-subtle" style={{ minHeight: "100vh" }}>
      <header className="bg-dark fw-bold p-3>">

        <nav class="navbar navbar-expand-lg navbar-light bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand text-primary fw-bold" href="#">Padyak-All</a>
              <button class="navbar-toggler bg-light border-primary border-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>

            <div class="collapse navbar-collapse p-0" id="navbarNavAltMarkup">
              <div class="navbar-nav rounded-2 p-2 opacity-75">
                <a class="nav-link active text-light fw-light" aria-current="page" href="#">Home</a>
                <a class="nav-link text-light fw-light" href="#">Book Rides</a>
                <a class="nav-link text-light fw-light" href="#">My Rides</a>
                <a class="nav-link text-light fw-light" href="#" tabindex="-1" aria-disabled="true">Profile</a>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="flex-grow-1 text-center d-flex align-items-start flex-column px-5">
        <h1 className="fw-bold text-start text-primary" style={{fontFamily:'monospace'}}>Rider</h1>

        <div className="card w-100 p-4 mb-4 shadow-lg border-bottom border-primary border-3">
          <h4 className="fw-bold text-start text-primary mb-3" style={{fontFamily:'monospace'}}>Add Booking</h4>

          <form onSubmit={handleAddBooking}>
            <div className="mb-3 text-start">
              <label className="form-label">Pickup Time</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter pickup time"
                value={pickup}
                onChange={(event) => setPickup(event.target.value)}
              />
            </div>

            <div className="mb-3 text-start">
              <label className="form-label">Drop-off Time</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter drop-off time"
                value={dropoff}
                onChange={(event) => setDropoff(event.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Book Ride
            </button>
          </form>
        </div>

        <div className="w-100 mb-4">
          <h4 className="fw-bold text-start text-primary mb-3" style={{fontFamily:'monospace'}}>My Bookings</h4>

          {bookings.length === 0 ? (
            <p className="text-muted text-start">No bookings yet.</p>
          ) : (
            <ul className="list-group">
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    <strong>From:</strong> {booking.pickup} —{" "}
                    <strong>To:</strong> {booking.dropoff}
                  </span>
                  <span className="badge bg-warning text-dark">Pending</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {onLogout && (
          <button
            type="button"
            className="btn btn-outline-danger fixed-bottom mx-auto mb-4 w-50 btn-lg"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}