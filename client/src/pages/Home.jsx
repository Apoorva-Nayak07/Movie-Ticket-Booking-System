import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Ticket,
  ShieldCheck,
  Clock3,
  Sparkles,
  Star,
  ChevronRight,
} from "lucide-react";

function Home() {
  return (
    <main className="home-page">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="hero-section">
        <div className="hero-overlay" />

        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={15} />
            <span>PREMIUM MOVIE EXPERIENCE</span>
          </div>

          <h1>
            Your next movie
            <br />
            <span>starts here.</span>
          </h1>

          <p className="hero-description">
            Discover the latest movies, choose your perfect seats,
            and book your tickets in seconds with CineSync.
          </p>

          <div className="hero-actions">
            <Link to="/movies" className="hero-primary-btn">
              <Ticket size={18} />
              <span>Browse Movies</span>
              <ArrowRight size={17} />
            </Link>

            <Link to="/shows" className="hero-secondary-btn">
              <Play size={16} />
              <span>View Shows</span>
            </Link>
          </div>

          <div className="hero-stats">

            <div className="hero-stat">
              <strong>4+</strong>
              <span>Movies</span>
            </div>

            <div className="stat-divider" />

            <div className="hero-stat">
              <strong>8+</strong>
              <span>Shows</span>
            </div>

            <div className="stat-divider" />

            <div className="hero-stat">
              <strong>20</strong>
              <span>Seats / Screen</span>
            </div>

          </div>
        </div>

        {/* Decorative film strip */}
        <div className="hero-film-strip">
          <div className="film-hole" />
          <div className="film-hole" />
          <div className="film-hole" />
          <div className="film-hole" />
          <div className="film-hole" />
          <div className="film-hole" />
          <div className="film-hole" />
          <div className="film-hole" />
        </div>

        {/* Bottom fade */}
        <div className="hero-bottom-fade" />
      </section>


      {/* =====================================================
          FEATURE SECTION
      ===================================================== */}
      <section className="features-section">

        <div className="section-heading">
          <div className="section-eyebrow">
            WHY CINESYNC
          </div>

          <h2>
            Everything you need
            <br />
            <span>for movie night.</span>
          </h2>

          <p>
            A simple, secure and seamless movie booking experience
            designed for movie lovers.
          </p>
        </div>


        <div className="feature-grid">

          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-number">
              01
            </div>

            <div className="feature-icon">
              <Ticket size={22} />
            </div>

            <h3>Easy Booking</h3>

            <p>
              Select your movie, show and preferred seats
              with just a few clicks.
            </p>

            <div className="feature-link">
              Simple & fast
              <ChevronRight size={15} />
            </div>
          </div>


          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-number">
              02
            </div>

            <div className="feature-icon">
              <ShieldCheck size={22} />
            </div>

            <h3>Secure Reservations</h3>

            <p>
              Your seats are protected with reliable
              concurrency-safe reservation technology.
            </p>

            <div className="feature-link">
              Safe & reliable
              <ChevronRight size={15} />
            </div>
          </div>


          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-number">
              03
            </div>

            <div className="feature-icon">
              <Clock3 size={22} />
            </div>

            <h3>Instant Confirmation</h3>

            <p>
              Get your booking confirmed instantly after
              successfully selecting your seats.
            </p>

            <div className="feature-link">
              Instant confirmation
              <ChevronRight size={15} />
            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          EXPERIENCE STRIP
      ===================================================== */}
      <section className="experience-section">

        <div className="experience-glow" />

        <div className="experience-content">

          <div className="experience-rating">
            <Star size={15} fill="currentColor" />
            <span>BUILT FOR MOVIE LOVERS</span>
          </div>

          <h2>
            Your seat.
            <br />
            Your movie.
            <br />
            <span>Your experience.</span>
          </h2>

          <p>
            From choosing a show to receiving your confirmation,
            CineSync keeps the entire movie booking experience
            simple and seamless.
          </p>

        </div>

        <div className="experience-card">

          <div className="mini-ticket">
            <div className="mini-ticket-icon">
              <Ticket size={22} />
            </div>

            <div>
              <span className="mini-ticket-label">
                CINESYNC
              </span>

              <strong>
                MOVIE NIGHT
              </strong>
            </div>
          </div>

          <div className="ticket-divider" />

          <div className="ticket-details">
            <div>
              <span>STATUS</span>
              <strong>CONFIRMED</strong>
            </div>

            <div>
              <span>SEATS</span>
              <strong>A5 · A6</strong>
            </div>
          </div>

          <div className="ticket-confirmed">
            <ShieldCheck size={16} />
            Booking secured
          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="home-cta">

        <div className="cta-content">

          <div className="cta-eyebrow">
            READY FOR THE SHOW?
          </div>

          <h2>
            Pick a movie.
            <br />
            Grab a seat. <span>Enjoy.</span>
          </h2>

          <p>
            Your next cinema experience is only a few clicks away.
          </p>

        </div>

        <Link to="/movies" className="cta-button">
          <span>Explore Movies</span>
          <ArrowRight size={18} />
        </Link>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="home-footer">

        <div className="footer-brand">

          <div className="footer-logo">
            <Ticket size={17} />
          </div>

          <div>
            <strong>
              Cine<span>Sync</span>
            </strong>

            <p>
              Movie Ticket Booking System
            </p>
          </div>

        </div>

        <div className="footer-right">
          <span>
            Secure • Simple • Seamless
          </span>

          <span>
            © 2026 CineSync
          </span>
        </div>

      </footer>

    </main>
  );
}

export default Home;