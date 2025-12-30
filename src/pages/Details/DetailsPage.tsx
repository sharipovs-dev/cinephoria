import { useParams, useNavigate} from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ApiContext from "../../Contexts/apiContext";
import "./DetailsPage.css";

export default function DetailsPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const api = useContext(ApiContext);
  if (!api) return null;
  const { fetchData, API_ENDPOINTS } = api;
  const { id } = useParams();
  const numericId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Helpers
  const img = (path: string, size: string = "w780") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : "";
  const formatRuntime = (min: number) => {
    if (!min && min !== 0) return "—";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  };
  const currency = (n: number | string) =>
    typeof n === "number"
      ? n.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })
      : "—";
  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString() : "—";

  useEffect(() => {
    if(!numericId) return;
    setLoading(true);
    fetchData(API_ENDPOINTS.details, { id:numericId })
      .then((data) => setMovie(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, fetchData, API_ENDPOINTS]);

  if (loading) {
    return (
      <div className="details-page">
        <div className="hero shimmer" />
        <div className="content shimmer" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="details-page">
        <div className="error-card">
          <h2>Couldn’t load this movie</h2>
          <p>Please try again later.</p>
          <button className="pill-btn" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  const {
    title,
    original_title,
    tagline,
    overview,
    poster_path,
    backdrop_path,
    release_date,
    runtime,
    vote_average,
    vote_count,
    imdb_id,
    homepage,
    genres = [],
    production_companies = [],
    production_countries = [],
    spoken_languages = [],
    budget,
    revenue,
    status,
    origin_country = [],
    original_language,
  } = movie;

  return (
    <div className="details-page">
      {/* Hero / banner */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${img(backdrop_path, "w1280")})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-inner">
          <button className="pill-btn ghost" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="poster-and-title">
            <img
              className="poster"
              src={img(poster_path, "w500")}
              alt={`${title} poster`}
              loading="lazy"
            />
            <div className="titles">
              <h1 className="movie-title">{title}</h1>
              {original_title && original_title !== title && (
                <p className="original-title">{original_title}</p>
              )}
              {tagline && <p className="tagline">“{tagline}”</p>}
              <div className="meta">
                <span className="chip">{formatDate(release_date)}</span>
                <span className="dot">•</span>
                <span className="chip">{formatRuntime(runtime)}</span>
                <span className="dot">•</span>
                <span className="chip">{status || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="content">
        <div className="left">
          <div className="card glass">
            <h3>Overview</h3>
            <p className="overview">{overview || "No overview provided."}</p>
          </div>

          <div className="card glass">
            <h3>Genres</h3>
            <div className="chips">
              {genres.length ? (
                genres.map((g) => (
                  <span key={g.id} className="chip">
                    {g.name}
                  </span>
                ))
              ) : (
                <span className="chip">—</span>
              )}
            </div>
          </div>

          <div className="card glass">
            <h3>Stats</h3>
            <div className="stats">
              <div className="stat">
                <span className="label">Rating</span>
                <span className="value">{vote_average?.toFixed(1) ?? "—"}</span>
              </div>
              <div className="stat">
                <span className="label">Votes</span>
                <span className="value">
                  {vote_count?.toLocaleString() ?? "—"}
                </span>
              </div>
              <div className="stat">
                <span className="label">Budget</span>
                <span className="value">{currency(budget)}</span>
              </div>
              <div className="stat">
                <span className="label">Revenue</span>
                <span className="value">{currency(revenue)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="card glass">
            <h3>Production</h3>
            <div className="list">
              <div className="row">
                <span className="label">Companies</span>
                <span className="value">
                  {production_companies.length
                    ? production_companies.map((c) => c.name).join(", ")
                    : "—"}
                </span>
              </div>
              <div className="row">
                <span className="label">Countries</span>
                <span className="value">
                  {production_countries.length
                    ? production_countries.map((c) => c.name).join(", ")
                    : "—"}
                </span>
              </div>
              <div className="row">
                <span className="label">Origin</span>
                <span className="value">
                  {origin_country?.join(", ") || "—"}
                </span>
              </div>
              <div className="row">
                <span className="label">Language</span>
                <span className="value">
                  {spoken_languages.length
                    ? spoken_languages
                        .map((l) => l.english_name ?? l.name)
                        .join(", ")
                    : original_language || "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="card glass">
            <h3>Links</h3>
            <div className="links">
              {imdb_id ? (
                <a
                  className="pill-btn"
                  href={`https://www.imdb.com/title/${imdb_id}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  IMDb
                </a>
              ) : (
                <span className="chip">IMDb —</span>
              )}
              {homepage ? (
                <a
                  className="pill-btn"
                  href={homepage}
                  target="_blank"
                  rel="noreferrer"
                >
                  Official site
                </a>
              ) : (
                <span className="chip">Homepage —</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
