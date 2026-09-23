import { Link } from 'react-router-dom'

const routes = [
  { number: '01', title: 'Coastal Escape', distance: '32 KM', level: 'Easy', icon: 'bi-water' },
  { number: '02', title: 'Mountain Challenge', distance: '48 KM', level: 'Hard', icon: 'bi-triangle' },
  { number: '03', title: 'City Explorer', distance: '18 KM', level: 'Easy', icon: 'bi-buildings' },
]

export default function Landing() {
  return (
    <div className="pd-landing">
      <aside className="pd-landing-rail">
        <Link to="/" className="pd-landing-logo">PADYAK</Link>
        <span className="pd-landing-rail-line" />
        <div className="pd-landing-socials" aria-label="Social links">
          <a href="#community" aria-label="Facebook"><i className="bi bi-facebook" /></a>
          <a href="#community" aria-label="Instagram"><i className="bi bi-instagram" /></a>
          <a href="#community" aria-label="YouTube"><i className="bi bi-youtube" /></a>
        </div>
        <div className="pd-landing-rail-copy">EVERY ROAD<br />HAS A STORY.</div>
      </aside>

      <main>
        <section id="home" className="pd-landing-hero">
          <img src="/image/bike.jpg" alt="Cyclist riding beside the water at sunset" className="pd-landing-hero-image" />
          <div className="pd-landing-hero-shade" />
          <nav className="pd-landing-nav">
            <div className="pd-landing-mobile-logo">PADYAK</div>
            <div className="pd-landing-nav-links">
              <a className="active" href="#home">HOME</a>
              <a href="#explore">EXPLORE</a>
              <a href="#routes">ROUTES</a>
              <a href="#community">COMMUNITY</a>
              <a href="#about">ABOUT</a>
            </div>
            <Link to="/login" className="pd-landing-top-cta">GET STARTED</Link>
          </nav>

          <div className="pd-landing-hero-content">
            <p className="pd-eyebrow">RIDE. EXPLORE. DISCOVER.</p>
            <h1>RIDE BEYOND<br /><span>THE ORDINARY.</span></h1>
            <p className="pd-landing-lead">Discover new routes, explore beautiful destinations, and make every ride an adventure with Padyak.</p>
            <div className="pd-landing-actions">
              <a href="#routes" className="pd-btn pd-btn-dark">EXPLORE ROUTES <i className="bi bi-arrow-right" /></a>
              <Link to="/signup" className="pd-btn pd-btn-light">START YOUR RIDE</Link>
            </div>
          </div>

          <div className="pd-distance-card"><span>DISTANCE EXPLORED</span><strong><i className="bi bi-geo-alt-fill" /> 2,450+ KM</strong></div>
          <div className="pd-hero-index">01<span /></div>
          <div className="pd-hero-side-copy">MORE<br />PLACES<br />HAPPIER<br />RIDES</div>
        </section>

        <section id="explore" className="pd-section pd-intro">
          <div className="pd-section-number">01 / 04</div>
          <div><p className="pd-eyebrow">YOUR NEXT RIDE</p><h2>STARTS HERE.</h2></div>
          <p className="pd-section-copy">Padyak helps you discover cycling routes, explore new destinations, and keep every journey within reach.</p>
          <div className="pd-feature-grid">
            <article><span>01</span><i className="bi bi-compass" /><h3>DISCOVER</h3><p>Find routes and destinations worth exploring.</p></article>
            <article><span>02</span><i className="bi bi-bicycle" /><h3>RIDE</h3><p>Choose your route and make every kilometer count.</p></article>
            <article><span>03</span><i className="bi bi-map" /><h3>EXPLORE</h3><p>See more places and collect memorable rides.</p></article>
          </div>
        </section>

        <section id="routes" className="pd-section pd-routes">
          <div className="pd-section-heading">
            <div><p className="pd-eyebrow">EXPLORE THE ROAD</p><h2>FIND A ROUTE<br />WORTH RIDING.</h2></div>
            <p>From peaceful coastal roads to challenging climbs, choose a ride that fits your adventure.</p>
          </div>
          <div className="pd-route-grid">
            {routes.map((route) => (
              <article className="pd-route-card" key={route.number}>
                <div className="pd-route-icon"><i className={`bi ${route.icon}`} /></div>
                <span className="pd-route-number">{route.number}</span>
                <h3>{route.title}</h3>
                <div className="pd-route-meta"><strong>{route.distance}</strong><span>{route.level}</span></div>
                <Link to="/map">VIEW ROUTE <i className="bi bi-arrow-up-right" /></Link>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="pd-section pd-how">
          <div className="pd-section-number">02 / 04</div>
          <div className="pd-how-copy"><p className="pd-eyebrow">HOW IT WORKS</p><h2>THREE STEPS.<br />ONE ADVENTURE.</h2></div>
          <div className="pd-steps">
            <div><b>01</b><h3>DISCOVER</h3><p>Explore routes and destinations near you.</p></div>
            <div><b>02</b><h3>CHOOSE</h3><p>Pick a ride that matches your distance and difficulty.</p></div>
            <div><b>03</b><h3>PADYAK</h3><p>Hit the road and start your adventure.</p></div>
          </div>
        </section>

        <section id="community" className="pd-community">
          <div className="pd-community-overlay" />
          <div className="pd-community-content">
            <p className="pd-eyebrow">RIDE TOGETHER.</p>
            <h2>MORE RIDES.<br />MORE STORIES.</h2>
            <p>Connect with riders, discover popular routes, and share the places you've explored.</p>
            <div className="pd-stats">
              <div><strong>1,200+</strong><span>ROUTES</span></div>
              <div><strong>5,000+</strong><span>RIDERS</span></div>
              <div><strong>50+</strong><span>DESTINATIONS</span></div>
            </div>
          </div>
        </section>

        <section className="pd-destination">
          <div className="pd-destination-image"><img src="/image/images-1.jpg" alt="Scenic cycling destination" /></div>
          <div className="pd-destination-copy">
            <p className="pd-eyebrow">DESTINATION FEATURE</p>
            <h2>DISCOVER<br />DAVAO.</h2>
            <p>Explore scenic roads, local destinations, and unforgettable cycling experiences across Davao and beyond.</p>
            <Link to="/map" className="pd-btn pd-btn-dark">EXPLORE DESTINATION <i className="bi bi-arrow-right" /></Link>
          </div>
        </section>

        <section className="pd-final-cta">
          <p className="pd-eyebrow">THE ROAD IS WAITING.</p>
          <h2>YOUR NEXT ADVENTURE<br />STARTS WITH A PADYAK.</h2>
          <Link to="/signup" className="pd-btn pd-btn-light">START EXPLORING</Link>
        </section>

        <footer className="pd-footer">
          <div><strong>PADYAK</strong><span>Ride. Explore. Discover.</span></div>
          <div className="pd-footer-links"><a href="#home">Home</a><a href="#explore">Explore</a><a href="#routes">Routes</a><a href="#community">Community</a><a href="#about">About</a></div>
          <small>© 2026 Padyak. All rights reserved.</small>
        </footer>
      </main>
    </div>
  )
}


