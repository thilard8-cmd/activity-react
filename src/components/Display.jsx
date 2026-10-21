
import { useState, useEffect, useCallback } from 'react';
import { getAuth, signOut } from 'firebase/auth';

const API_URL = 'https://backend-5yvp.onrender.com/api';

export default function Display({ onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const fetchBookings = useCallback(async () => {
    try {
      setError('');

      const response = await fetch(`${API_URL}/bookings`);

      if (!response.ok) {
        throw new Error('Hindi makuha ang bookings mula sa server.');
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        'Hindi makakonekta sa backend. Siguraduhing tumatakbo ang server.js.'
      );
      console.error('Fetch bookings error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError('');

      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Hindi ma-update ang booking status.');
      }

      const updatedBooking = await response.json();

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === id ? updatedBooking : booking
        )
      );

      console.log('Booking status updated:', updatedBooking);
    } catch (err) {
      setError(err.message || 'May error sa pag-update ng booking.');
      console.error('Update booking error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError('');

      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hindi ma-delete ang booking.');
      }

      setBookings((currentBookings) =>
        currentBookings.filter((booking) => booking.id !== id)
      );

      console.log('Booking deleted - id:', id);
    } catch (err) {
      setError(err.message || 'May error sa pag-delete ng booking.');
      console.error('Delete booking error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      if (onLogout) {
        onLogout();
      } else {
        await signOut(getAuth());
      }
    } catch (err) {
      setError('Hindi matagumpay ang pag-logout.');
      console.error('Logout error:', err);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch = [
      booking.id,
      booking.pickup,
      booking.dropoff,
      booking.riderName,
      booking.riderEmail,
    ].some((value) => String(value || '').toLowerCase().includes(searchText));

    const matchesStatus =
      statusFilter === 'All' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === 'Pending'
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === 'Completed'
  ).length;
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === 'Cancelled'
  ).length;

  const totalRevenue = bookings
    .filter((booking) => booking.status === 'Completed')
    .reduce((total, booking) => total + (Number(booking.price) || 0), 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <i className="bi bi-bicycle"></i>
          </div>

          <div className="admin-brand-text">
            <h2>Padyak-All</h2>
            <span>Ride More, Worry Less</span>
          </div>
        </div>

        <div className="admin-nav-label">MAIN MENU</div>

        <nav className="admin-navigation">
          <a href="#dashboard" className="admin-nav-link active">
            <i className="bi bi-grid-1x2-fill"></i>
            <span>Dashboard</span>
          </a>

          <a href="#bookings" className="admin-nav-link">
            <i className="bi bi-calendar2-check"></i>
            <span>Ride Bookings</span>
            <span className="admin-nav-count">{pendingBookings}</span>
          </a>

          <a href="#reports" className="admin-nav-link">
            <i className="bi bi-bar-chart-line"></i>
            <span>Reports Overview</span>
          </a>
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-help">
            <i className="bi bi-headset"></i>
            <div>
              <strong>Admin Portal</strong>
              <span>Manage your rides</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main" id="dashboard">
        <header className="admin-topbar">
          <div className="admin-topbar-heading">
            <span className="admin-eyebrow">ADMINISTRATION</span>
            <h1>Dashboard Overview</h1>
            <p>Monitor bookings and manage your bike rental operations.</p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={fetchBookings}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise"></i>
            <span>Refresh</span>
          </button>
        </header>

        {error && (
          <div className="admin-error-message" role="alert">
            <i className="bi bi-exclamation-circle"></i>
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError('')}
              aria-label="Close error message"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        )}

        <section className="admin-stats-grid">
          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Total Bookings</span>
              <div className="admin-stat-icon blue">
                <i className="bi bi-calendar2-week"></i>
              </div>
            </div>
            <h2>{totalBookings}</h2>
            <p>All recorded ride bookings</p>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Pending Rides</span>
              <div className="admin-stat-icon orange">
                <i className="bi bi-hourglass-split"></i>
              </div>
            </div>
            <h2>{pendingBookings}</h2>
            <p>Awaiting completion</p>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Completed Rides</span>
              <div className="admin-stat-icon green">
                <i className="bi bi-check2-circle"></i>
              </div>
            </div>
            <h2>{completedBookings}</h2>
            <p>Successfully completed</p>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <span>Completed Revenue</span>
              <div className="admin-stat-icon purple">
                <i className="bi bi-wallet2"></i>
              </div>
            </div>
            <h2 className="admin-revenue-value">
              {formatCurrency(totalRevenue)}
            </h2>
            <p>From completed bookings only</p>
          </article>
        </section>

        <section className="admin-overview-grid" id="reports">
          <article className="admin-overview-card">
            <div className="admin-section-heading">
              <div>
                <h3>Booking Status Overview</h3>
                <p>Current distribution of ride bookings</p>
              </div>
              <i className="bi bi-pie-chart admin-heading-icon"></i>
            </div>

            <div className="admin-status-overview">
              <div className="admin-status-row">
                <span className="admin-status-dot pending"></span>
                <span>Pending</span>
                <strong>{pendingBookings}</strong>
              </div>

              <div className="admin-status-track">
                <div
                  className="admin-status-progress pending"
                  style={{
                    width: totalBookings
                      ? `${(pendingBookings / totalBookings) * 100}%`
                      : '0%',
                  }}
                ></div>
              </div>

              <div className="admin-status-row">
                <span className="admin-status-dot completed"></span>
                <span>Completed</span>
                <strong>{completedBookings}</strong>
              </div>

              <div className="admin-status-track">
                <div
                  className="admin-status-progress completed"
                  style={{
                    width: totalBookings
                      ? `${(completedBookings / totalBookings) * 100}%`
                      : '0%',
                  }}
                ></div>
              </div>

              <div className="admin-status-row">
                <span className="admin-status-dot cancelled"></span>
                <span>Cancelled</span>
                <strong>{cancelledBookings}</strong>
              </div>

              <div className="admin-status-track">
                <div
                  className="admin-status-progress cancelled"
                  style={{
                    width: totalBookings
                      ? `${(cancelledBookings / totalBookings) * 100}%`
                      : '0%',
                  }}
                ></div>
              </div>
            </div>
          </article>

          <article className="admin-overview-card admin-quick-summary">
            <div className="admin-section-heading">
              <div>
                <h3>Quick Summary</h3>
                <p>Current system activity</p>
              </div>
              <i className="bi bi-activity admin-heading-icon"></i>
            </div>

            <div className="admin-summary-item">
              <div className="admin-summary-icon">
                <i className="bi bi-bicycle"></i>
              </div>
              <div>
                <strong>{totalBookings} bookings</strong>
                <span>Total rides recorded by the system</span>
              </div>
            </div>

            <div className="admin-summary-item">
              <div className="admin-summary-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <div>
                <strong>{pendingBookings} awaiting completion</strong>
                <span>Bookings with Pending status</span>
              </div>
            </div>

            <div className="admin-summary-item">
              <div className="admin-summary-icon">
                <i className="bi bi-cash-stack"></i>
              </div>
              <div>
                <strong>{formatCurrency(totalRevenue)}</strong>
                <span>Revenue from completed rides</span>
              </div>
            </div>
          </article>
        </section>

        <section className="admin-bookings-panel" id="bookings">
          <div className="admin-bookings-heading">
            <div>
              <span className="admin-eyebrow">BOOKING MANAGEMENT</span>
              <h2>Recent Ride Bookings</h2>
              <p>View, filter, and manage rider reservations.</p>
            </div>

            <button
              type="button"
              className="admin-refresh-button"
              onClick={fetchBookings}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i>
              <span>Reload Data</span>
            </button>
          </div>

          <div className="admin-table-controls">
            <div className="admin-search-box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search rider, pickup, or destination..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search bookings"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <i className="bi bi-x-circle"></i>
                </button>
              )}
            </div>

            <select
              className="admin-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by booking status"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-bookings-table">
              <thead>
                <tr>
                  <th>Booking</th>
                  <th>Rider</th>
                  <th>Route</th>
                  <th>Date &amp; Time</th>
                  <th>Distance</th>
                  <th>Fare</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="admin-table-message">
                      <i className="bi bi-arrow-repeat"></i>
                      Loading bookings...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="admin-table-message">
                      <i className="bi bi-inbox"></i>
                      {bookings.length === 0
                        ? 'Wala pang booking na natatanggap.'
                        : 'Walang booking na tumutugma sa iyong search.'}
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <span className="admin-booking-id">
                          #{booking.id}
                        </span>
                      </td>

                      <td>
                        <div className="admin-rider-cell">
                          <div className="admin-rider-avatar">
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <div className="admin-rider-details">
                            <strong>
                              {booking.riderName || 'Rider'}
                            </strong>
                            <span>
                              {booking.riderEmail || 'No email provided'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="admin-route-cell">
                          <span>
                            <i className="bi bi-circle-fill pickup-dot"></i>
                            {booking.pickup || '—'}
                          </span>
                          <span>
                            <i className="bi bi-geo-alt-fill dropoff-dot"></i>
                            {booking.dropoff || '—'}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-date-cell">
                          <strong>{booking.date || '—'}</strong>
                          <span>{booking.time || '—'}</span>
                        </div>
                      </td>

                      <td>
                        <div className="admin-distance-cell">
                          <strong>{booking.distance || '—'}</strong>
                          <span>{booking.duration || '—'}</span>
                        </div>
                      </td>

                      <td className="admin-fare-cell">
                        {formatCurrency(Number(booking.price) || 0)}
                      </td>

                      <td>
                        <span
                          className={`admin-booking-status ${
                            String(booking.status || 'Pending').toLowerCase()
                          }`}
                        >
                          {booking.status || 'Pending'}
                        </span>
                      </td>

                      <td>
                        <div className="admin-action-buttons">
                          <select
                            className="admin-action-select"
                            value={booking.status || 'Pending'}
                            disabled={updatingId === booking.id}
                            onChange={(event) =>
                              updateStatus(booking.id, event.target.value)
                            }
                            aria-label={`Update status for booking ${booking.id}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() => handleDelete(booking.id)}
                            aria-label={`Delete booking ${booking.id}`}
                            title="Delete booking"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="admin-table-footer">
            <span>
              Showing <strong>{filteredBookings.length}</strong> of{' '}
              <strong>{bookings.length}</strong> bookings
            </span>
            <span className="admin-footer-note">
              <i className="bi bi-arrow-repeat"></i>
              Refresh to fetch the latest data
            </span>
          </div>
        </section>

        <footer className="admin-footer">
          <span>© {new Date().getFullYear()} Padyak-All</span>
          <span>Ride More, Worry Less.</span>
        </footer>
      </main>
    </div>
  );
}
