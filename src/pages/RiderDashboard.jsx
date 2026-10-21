import { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const LOCATIONS = {
  calapan: {
    name: "Calapan City",
    fullName: "Calapan City, Oriental Mindoro",
    position: [13.4117, 121.1803],
  },
  naujan: {
    name: "Naujan",
    fullName: "Naujan, Oriental Mindoro",
    position: [13.3219, 121.3026],
  },
  baco: {
    name: "Baco",
    fullName: "Baco, Oriental Mindoro",
    position: [13.3587, 121.0981],
  },
  victoria: {
    name: "Victoria",
    fullName: "Victoria, Oriental Mindoro",
    position: [13.1775, 121.2788],
  },
  pinamalayan: {
    name: "Pinamalayan",
    fullName: "Pinamalayan, Oriental Mindoro",
    position: [13.0358, 121.4889],
  },
  roxas: {
    name: "Roxas",
    fullName: "Roxas, Oriental Mindoro",
    position: [12.5833, 121.5167],
  },
};

const NAV_ITEMS = [
  {
    page: "dashboard",
    icon: "bi-house-fill",
    label: "Dashboard",
  },
  {
    page: "booking",
    icon: "bi-bicycle",
    label: "Book a Ride",
  },
  {
    page: "rides",
    icon: "bi-file-earmark-text",
    label: "My Rides",
  },
  {
    page: "profile",
    icon: "bi-person",
    label: "My Profile",
  },
  {
    page: "settings",
    icon: "bi-gear",
    label: "Settings",
  },
];

const AVAILABLE_BIKES = [
  [13.383, 121.16],
  [13.3, 121.22],
  [13.2, 121.3],
  [13.1, 121.4],
  [13.0, 121.46],
  [13.36, 121.08],
];

const bikeIcon = L.divIcon({
  className: "padyak-bike-marker",
  html: `
    <div class="padyak-bike-marker-inner">
      <i class="bi bi-bicycle"></i>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(event) {
      onMapClick(event.latlng);
    },
  });

  return null;
}

const ORIENTAL_MINDORO_CENTER = [13.25, 121.28];

function isValidLocation(location) {
  return (
    location &&
    typeof location.lat === "number" &&
    Number.isFinite(location.lat) &&
    typeof location.lng === "number" &&
    Number.isFinite(location.lng)
  );
}

function RideMap({
  pickupLocation,
  dropoffLocation,
  selectingLocation,
  onMapClick,
}) {
  const validPickup = isValidLocation(pickupLocation)
    ? [pickupLocation.lat, pickupLocation.lng]
    : null;

  const validDropoff = isValidLocation(dropoffLocation)
    ? [dropoffLocation.lat, dropoffLocation.lng]
    : null;

  const route =
    validPickup && validDropoff
      ? [
          validPickup,
          [13.35, 121.22],
          [13.25, 121.27],
          [13.18, 121.29],
          validDropoff,
        ]
      : [];

  return (
    <MapContainer
      center={ORIENTAL_MINDORO_CENTER}
      zoom={9}
      scrollWheelZoom={true}
      className="padyak-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onMapClick={onMapClick} />

      {AVAILABLE_BIKES.map((position, index) => (
        <Marker
          key={`bike-${index}`}
          position={position}
          icon={bikeIcon}
        >
          <Popup>
            <strong>Padyak Bike</strong>
            <br />
            Available for booking
          </Popup>
        </Marker>
      ))}

      {validPickup && (
        <Marker position={validPickup}>
          <Popup>
            <strong>Pickup Location</strong>
            <br />
            {pickupLocation?.name ||
              `${pickupLocation.lat.toFixed(
                5
              )}, ${pickupLocation.lng.toFixed(5)}`}
          </Popup>
        </Marker>
      )}

      {validDropoff && (
        <Marker position={validDropoff}>
          <Popup>
            <strong>Drop-off Location</strong>
            <br />
            {dropoffLocation?.name ||
              `${dropoffLocation.lat.toFixed(
                5
              )}, ${dropoffLocation.lng.toFixed(5)}`}
          </Popup>
        </Marker>
      )}

      {route.length >= 2 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: "#2875f0",
            weight: 6,
            opacity: 0.9,
          }}
        />
      )}

      <div className="padyak-map-status">
        <i className="bi bi-bicycle"></i>
        <div>
          <span>Available Bikes</span>
          <strong>12</strong>
        </div>
      </div>

      <div className="padyak-map-mode">
        <span className="active">Map</span>
        <span>Satellite</span>
      </div>

      <div className="padyak-map-selection">
        <i
          className={
            selectingLocation === "pickup"
              ? "bi bi-geo-alt-fill"
              : "bi bi-flag-fill"
          }
        ></i>

        {selectingLocation === "pickup"
          ? "Click map to select pickup"
          : "Click map to select drop-off"}
      </div>
    </MapContainer>
  );
}

export default function RiderDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [selectingLocation, setSelectingLocation] = useState("pickup");

  const [pickupLocation, setPickupLocation] = useState(
    LOCATIONS.calapan
  );

  const [dropoffLocation, setDropoffLocation] = useState(
    LOCATIONS.naujan
  );

  const [bookings, setBookings] = useState([
    {
      id: 1,
      pickup: "Calapan City",
      dropoff: "Naujan",
      date: "Apr 24, 2025",
      time: "09:15 AM",
      distance: "18.4 km",
      duration: "42 min",
      status: "Completed",
    },
    {
      id: 2,
      pickup: "Baco",
      dropoff: "Puerto Galera",
      date: "Apr 24, 2025",
      time: "02:30 PM",
      distance: "32.7 km",
      duration: "1 hr 10 min",
      status: "Completed",
    },
    {
      id: 3,
      pickup: "Pinamalayan",
      dropoff: "Roxas",
      date: "Apr 18, 2025",
      time: "11:20 AM",
      distance: "24.5 km",
      duration: "58 min",
      status: "Pending",
    },
    {
      id: 4,
      pickup: "Calapan City",
      dropoff: "Victoria",
      date: "Apr 15, 2025",
      time: "04:10 PM",
      distance: "16.8 km",
      duration: "36 min",
      status: "Pending",
    },
  ]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setMobileNav(false);
      }
    }

    function onResize() {
      if (window.innerWidth > 992) {
        setMobileNav(false);
      }
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileNav ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNav]);

  const riderName =
    user?.displayName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Rider";

  const riderEmail = user?.email || "rider@email.com";

  const totalBookings = bookings.length;

  const pendingRides = bookings.filter(
    (ride) => ride.status === "Pending"
  ).length;

  const completedRides = bookings.filter(
    (ride) => ride.status === "Completed"
  ).length;

  const selectedDistance = useMemo(() => {
    if (
      pickupLocation?.name === "Calapan City" &&
      dropoffLocation?.name === "Naujan"
    ) {
      return "18.4 km";
    }

    if (
      pickupLocation?.name === "Calapan City" &&
      dropoffLocation?.name === "Victoria"
    ) {
      return "16.8 km";
    }

    if (
      pickupLocation?.name === "Pinamalayan" &&
      dropoffLocation?.name === "Roxas"
    ) {
      return "24.5 km";
    }

    return "—";
  }, [pickupLocation, dropoffLocation]);

  function handleMapClick(latlng) {
    if (
      !latlng ||
      typeof latlng.lat !== "number" ||
      typeof latlng.lng !== "number" ||
      !Number.isFinite(latlng.lat) ||
      !Number.isFinite(latlng.lng)
    ) {
      return;
    }

    const location = {
      lat: latlng.lat,
      lng: latlng.lng,
      name: "Selected location",
    };

    if (selectingLocation === "pickup") {
      setPickupLocation(location);
      setSelectingLocation("dropoff");
    } else {
      setDropoffLocation(location);
      setSelectingLocation("pickup");
    }
  }

  function selectPickup(location) {
    setPickupLocation(location);
    setSelectingLocation("dropoff");
  }

  function selectDropoff(location) {
    setDropoffLocation(location);
    setSelectingLocation("pickup");
  }

  function handleBookRide() {
    if (!pickupLocation || !dropoffLocation) {
      alert("Please select pickup and drop-off locations.");
      return;
    }

    const newBooking = {
      id: Date.now(),
      pickup:
        pickupLocation.name ||
        `${pickupLocation.lat.toFixed(
          4
        )}, ${pickupLocation.lng.toFixed(4)}`,
      dropoff:
        dropoffLocation.name ||
        `${dropoffLocation.lat.toFixed(
          4
        )}, ${dropoffLocation.lng.toFixed(4)}`,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      distance:
        selectedDistance === "—"
          ? "Estimated"
          : selectedDistance,
      duration: "Estimated",
      status: "Pending",
    };

    setBookings((current) => [newBooking, ...current]);

    alert("Your ride has been booked successfully!");

    setActivePage("rides");
  }

  function navigate(page) {
    setActivePage(page);
    setMobileNav(false);
  }

  function Sidebar() {
    return (
      <>
        {mobileNav && (
          <div
            className="padyak-sidebar-overlay"
            onClick={() => setMobileNav(false)}
          />
        )}

        <aside
          className={`padyak-sidebar ${
            mobileNav ? "padyak-sidebar-open" : ""
          }`}
        >
          <div className="padyak-logo">
            <div className="padyak-logo-icon">
              <i className="bi bi-bicycle"></i>
            </div>

            <div>
              <strong>Padyak-All</strong>
              <small>Ride More. Explore More.</small>
            </div>
          </div>

          <nav className="padyak-sidebar-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                className={
                  activePage === item.page ? "active" : ""
                }
                onClick={() => navigate(item.page)}
                title={item.label}
                aria-label={item.label}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="padyak-sidebar-bottom">
            <div className="padyak-theme-switch">
              <i className="bi bi-sun"></i>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={darkMode ? "dark" : ""}
              >
                <span></span>
              </button>

              <i className="bi bi-moon"></i>
            </div>

            <div className="padyak-online">
              <span></span>
              Online
            </div>

            <div className="padyak-user">
              <div className="padyak-avatar">
                {riderName.charAt(0).toUpperCase()}
              </div>

              <div className="padyak-user-info">
                <strong>{riderName}</strong>
                <span>Rider</span>
                <small>{riderEmail}</small>
              </div>
            </div>

            <button
              className="padyak-logout"
              onClick={onLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
              Logout
            </button>
          </div>
        </aside>
      </>
    );
  }

  function Topbar() {
    return (
      <header className="padyak-topbar">
        <button
          className="padyak-mobile-menu"
          onClick={() =>
            setMobileNav((open) => !open)
          }
          aria-label="Toggle navigation menu"
          aria-expanded={mobileNav}
        >
          <i className="bi bi-list"></i>
        </button>

        <div className="padyak-search">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search locations in Oriental Mindoro..."
          />
        </div>

        <button className="padyak-notification">
          <i className="bi bi-bell"></i>
          <span></span>
        </button>
      </header>
    );
  }

  function StatCard({
    icon,
    title,
    value,
    type,
    text,
  }) {
    return (
      <div className={`padyak-stat-card ${type}`}>
        <div className="padyak-stat-icon">
          <i className={`bi ${icon}`}></i>
        </div>

        <div>
          <span>{title}</span>
          <strong>{value}</strong>
          <small>{text}</small>
        </div>
      </div>
    );
  }

  function BookingMapSection() {
    return (
      <section className="padyak-book-card">
        <div className="padyak-card-heading">
          <div>
            <h2>
              <i className="bi bi-bicycle"></i>
              Book a Ride
            </h2>

            <p>
              Select your pickup and drop-off locations on the map.
            </p>
          </div>

          <div className="padyak-location-badge">
            <i className="bi bi-geo-alt-fill"></i>
            Oriental Mindoro
            <i className="bi bi-chevron-down"></i>
          </div>
        </div>

        <div className="padyak-map-wrapper">
          <RideMap
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            selectingLocation={selectingLocation}
            onMapClick={handleMapClick}
          />
        </div>

        <div className="padyak-location-row">
          <button
            className="padyak-location-box"
            onClick={() =>
              setSelectingLocation("pickup")
            }
          >
            <div className="padyak-location-icon pickup">
              <i className="bi bi-geo-alt-fill"></i>
            </div>

            <div>
              <span>Pickup Location</span>

              <strong>
                {pickupLocation?.name || "Select on map"}
              </strong>
            </div>

            <i className="bi bi-x"></i>
          </button>

          <button
            className="padyak-location-box"
            onClick={() =>
              setSelectingLocation("dropoff")
            }
          >
            <div className="padyak-location-icon dropoff">
              <i className="bi bi-geo-alt-fill"></i>
            </div>

            <div>
              <span>Drop-off Location</span>

              <strong>
                {dropoffLocation?.name || "Select on map"}
              </strong>
            </div>

            <i className="bi bi-x"></i>
          </button>

          <div className="padyak-distance-box">
            <div>
              <i className="bi bi-signpost-2"></i>
              <span>Distance</span>
              <strong>{selectedDistance}</strong>
            </div>

            <div>
              <i className="bi bi-clock"></i>
              <span>Est. Time</span>

              <strong>
                {selectedDistance === "—"
                  ? "—"
                  : "42 min"}
              </strong>
            </div>
          </div>
        </div>

        <button
          className="padyak-book-button"
          onClick={handleBookRide}
        >
          <i className="bi bi-bicycle"></i>
          Book Ride
        </button>
      </section>
    );
  }

  function RecentRides() {
    return (
      <div className="padyak-side-card">
        <div className="padyak-side-heading">
          <h3>
            <i className="bi bi-clock-history"></i>
            Recent Rides
          </h3>

          <button onClick={() => navigate("rides")}>
            View All
          </button>
        </div>

        <div className="padyak-rides-list">
          {bookings.slice(0, 4).map((ride) => (
            <div
              className="padyak-ride-item"
              key={ride.id}
            >
              <div className="padyak-ride-route">
                <div className="route-dot blue">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>

                <div className="route-line"></div>

                <div className="route-dot pink">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
              </div>

              <div className="padyak-ride-info">
                <div className="padyak-ride-top">
                  <strong>
                    {ride.pickup}
                    <i className="bi bi-arrow-right"></i>
                    {ride.dropoff}
                  </strong>

                  <span
                    className={`padyak-status ${ride.status.toLowerCase()}`}
                  >
                    {ride.status}
                  </span>
                </div>

                <small>
                  {ride.date} • {ride.time}
                </small>

                <div className="padyak-ride-meta">
                  <span>
                    <i className="bi bi-bicycle"></i>
                    {ride.distance}
                  </span>

                  <span>
                    <i className="bi bi-clock"></i>
                    {ride.duration}
                  </span>
                </div>
              </div>

              <i className="bi bi-chevron-right ride-arrow"></i>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function QuickActions() {
    return (
      <div className="padyak-side-card">
        <div className="padyak-side-heading">
          <h3>
            <i className="bi bi-lightning-charge-fill"></i>
            Quick Actions
          </h3>
        </div>

        <div className="padyak-actions-grid">
          <button onClick={() => navigate("booking")}>
            <i className="bi bi-bicycle"></i>
            <span>Book a Ride</span>
          </button>

          <button onClick={() => navigate("rides")}>
            <i className="bi bi-file-earmark-text"></i>
            <span>View My Rides</span>
          </button>

          <button onClick={() => navigate("profile")}>
            <i className="bi bi-person"></i>
            <span>Edit Profile</span>
          </button>

          <button onClick={() => navigate("settings")}>
            <i className="bi bi-gear"></i>
            <span>Settings</span>
          </button>
        </div>
      </div>
    );
  }

  function ExploreCard() {
    return (
      <div className="padyak-explore-card">
        <div>
          <span>Explore Oriental Mindoro</span>
          <strong>More routes. More adventures.</strong>
          <i className="bi bi-bicycle"></i>
        </div>
      </div>
    );
  }

  function DashboardHome() {
    return (
      <>
        <div className="padyak-welcome">
          <div>
            <h1 className="text-light">
              Good morning, {riderName}! 
            </h1>

            <p className="text-info">
              Ready for your next adventure?
              Book a ride and explore Oriental
              Mindoro!
            </p>
          </div>

          <div className="padyak-date">
            <strong>
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </strong>

            <span className="text-light">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </span>
          </div>
        </div>

        <div className="padyak-stats-grid">
          <StatCard
            icon="bi-bicycle"
            title="Total Bookings"
            value={totalBookings}
            type="blue"
            text="Your ride history"
          />

          <StatCard
            icon="bi-clock"
            title="Pending Rides"
            value={pendingRides}
            type="orange"
            text="Waiting for confirmation"
          />

          <StatCard
            icon="bi-check-circle-fill"
            title="Completed Rides"
            value={completedRides}
            type="green"
            text="Great job!"
          />
        </div>

        <div className="padyak-dashboard-grid">
          <div>
            <BookingMapSection />
          </div>

          <div className="padyak-right-column">
            <RecentRides />
            <QuickActions />
            <ExploreCard />
          </div>
        </div>
      </>
    );
  }

  function BookingPage() {
    return (
      <>
        <div className="padyak-page-title">
          <h1>Book a Ride</h1>

          <p>
            Choose your pickup and drop-off
            locations in Oriental Mindoro.
          </p>
        </div>

        <BookingMapSection />
      </>
    );
  }

  function RidesPage() {
    return (
      <>
        <div className="padyak-page-title">
          <h1>My Rides</h1>

          <p>
            View all of your Padyak-All
            bookings.
          </p>
        </div>

        <div className="padyak-full-card">
          {bookings.length === 0 ? (
            <div className="padyak-empty">
              <i className="bi bi-bicycle"></i>

              <h3>No rides yet</h3>

              <p>
                Book your first ride and
                start exploring.
              </p>

              <button
                onClick={() => navigate("booking")}
              >
                Book a Ride
              </button>
            </div>
          ) : (
            <div className="padyak-all-rides">
              {bookings.map((ride) => (
                <div
                  className="padyak-full-ride"
                  key={ride.id}
                >
                  <div className="padyak-full-ride-icon">
                    <i className="bi bi-bicycle"></i>
                  </div>

                  <div className="padyak-full-ride-info">
                    <div>
                      <strong>
                        {ride.pickup}
                        <i className="bi bi-arrow-right"></i>
                        {ride.dropoff}
                      </strong>

                      <span
                        className={`padyak-status ${ride.status.toLowerCase()}`}
                      >
                        {ride.status}
                      </span>
                    </div>

                    <small>
                      {ride.date} • {ride.time}
                    </small>

                    <p>
                      <i className="bi bi-signpost-2"></i>
                      {ride.distance}
                      <span>•</span>
                      <i className="bi bi-clock"></i>
                      {ride.duration}
                    </p>
                  </div>

                  <i className="bi bi-chevron-right"></i>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  }

  function ProfilePage() {
    return (
      <>
        <div className="padyak-page-title">
          <h1>My Profile</h1>

          <p>
            Manage your Padyak-All rider
            information.
          </p>
        </div>

        <div className="padyak-profile-card">
          <div className="padyak-profile-header">
            <div className="padyak-profile-avatar">
              {riderName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>{riderName}</h2>
              <p>Rider Account</p>
            </div>
          </div>

          <div className="padyak-profile-grid">
            <div>
              <span>Name</span>
              <strong>{riderName}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{riderEmail}</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>Rider</strong>
            </div>

            <div>
              <span>Status</span>
              <strong className="online-text">
                ● Active
              </strong>
            </div>
          </div>
        </div>
      </>
    );
  }

  function SettingsPage() {
    return (
      <>
        <div className="padyak-page-title">
          <h1>Settings</h1>

          <p>
            Customize your Padyak-All
            experience.
          </p>
        </div>

        <div className="padyak-settings-card">
          <div className="padyak-setting-row">
            <div>
              <i className="bi bi-moon-stars"></i>

              <div>
                <strong>Dark Mode</strong>

                <span>
                  Change the dashboard
                  appearance.
                </span>
              </div>
            </div>

            <button
              className={`padyak-toggle ${
                darkMode ? "active" : ""
              }`}
              onClick={() =>
                setDarkMode(!darkMode)
              }
            >
              <span></span>
            </button>
          </div>

          <div className="padyak-setting-row">
            <div>
              <i className="bi bi-circle-fill"></i>

              <div>
                <strong>Rider Status</strong>

                <span>
                  Your current availability.
                </span>
              </div>
            </div>

            <span className="padyak-online">
              <span></span>
              Online
            </span>
          </div>
        </div>
      </>
    );
  }

  function PageContent() {
    switch (activePage) {
      case "booking":
        return BookingPage();

      case "rides":
        return RidesPage();

      case "profile":
        return ProfilePage();

      case "settings":
        return SettingsPage();

      case "dashboard":
      default:
        return DashboardHome();
    }
  }

  return (
    <div
      className={`padyak-dashboard ${
        darkMode ? "padyak-dark" : ""
      }`}
    >
      {Sidebar()}

      <main className="padyak-main">
        {Topbar()}

        <div className="padyak-content">
          {PageContent()}
        </div>
      </main>
    </div>
  );
}