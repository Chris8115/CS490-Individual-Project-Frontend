import React, { useState, useEffect } from "react";
import "./styles.css"; // Import the CSS file
import SearchFilms from "./SearchFilms";
import FilmDetails from "./FilmDetails";

// TopRentedFilms Component
const TopRentedFilms = ({ onFilmClick }) => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetch("top_rented_films")
      .then((response) => response.json())
      .then((data) => setFilms(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="top-5-container">
      <h2>Top 5 Most Rented Films</h2>
      <ul>
        {films.map((film, index) => (
          <li
            key={index}
            onClick={() => onFilmClick(film)}
            style={{ cursor: "pointer", color: "lightblue" }}
          >
            {film.title} - {film.rental_count} rentals
          </li>
        ))}
      </ul>
    </div>
  );
};

// TopActors Component
const TopActors = ({ onActorClick }) => {
  const [actors, setActors] = useState([]);

  useEffect(() => {
    fetch("top_actors")
      .then((response) => response.json())
      .then((data) => setActors(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="top-5-container">
      <h2>Top 5 Actors of Our Inventory</h2>
      <ul>
        {actors.map((actor, index) => (
          <li
            key={index}
            onClick={() => onActorClick(actor)}
            style={{ cursor: "pointer", color: "lightblue" }}
          >
            {actor.actor_name} - {actor.film_count} films
          </li>
        ))}
      </ul>
    </div>
  );
};

// ActorDetails Component
const ActorDetails = ({ actor }) => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetch(`actor_films/${actor.actor_id}`) // Fetch top 5 rented films for this actor
      .then((response) => response.json())
      .then((data) => setFilms(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [actor.actor_id]);

  return (
    <div>
      <h2>{actor.actor_name}'s Details</h2>
      <p>
        <strong>Actor ID:</strong> {actor.actor_id}
      </p>
      <p>
        <strong>Films in Inventory:</strong> {actor.film_count}
      </p>

      <h3>Top 5 Rented Films</h3>
      <ul>
        {films.map((film, index) => (
          <li key={index} style={{ color: "blue" }}>
            {film.title} - {film.rental_count} rentals
          </li>
        ))}
      </ul>
    </div>
  );
};


function App() {
  const [showTopFilms, setShowTopFilms] = useState(false);
  const [showTopActors, setShowTopActors] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [showSearchPage, setShowSearchPage] = useState(false);

  return (
    <div className="app-wrapper">
      <header className="header-banner">
        <h1>Sakila Rental Service</h1>
        <button
          className="button button-films search-btn"
          onClick={() => {
            setShowSearchPage(!showSearchPage);
            // Reset other views when toggling search page
            setShowTopFilms(false);
            setShowTopActors(false);
            setSelectedFilm(null);
            setSelectedActor(null);
          }}
        >
          {showSearchPage ? "Back to Home" : "Search Films"}
        </button>
      </header>

      <main className="content">
        {/* Use a different container class when the search page is active */}
        <div className={showSearchPage ? "scrollable-container" : "app-container"}>
          {showSearchPage ? (
            <SearchFilms />
          ) : (
            <>
              <div className="button-container">
                <button
                  className={`button button-films ${showTopFilms ? "active" : ""}`}
                  onClick={() => {
                    setShowTopFilms(!showTopFilms);
                    setShowTopActors(false);
                    setSelectedFilm(null);
                    setSelectedActor(null);
                  }}
                >
                  {showTopFilms ? "Hide" : "Show"} Top 5 Most Rented Films
                </button>

                <button
                  className={`button button-actors ${showTopActors ? "active" : ""}`}
                  onClick={() => {
                    setShowTopActors(!showTopActors);
                    setShowTopFilms(false);
                    setSelectedFilm(null);
                    setSelectedActor(null);
                  }}
                >
                  {showTopActors ? "Hide" : "Show"} Top 5 Actors of Our Inventory
                </button>
              </div>

              {showTopFilms && !selectedFilm && (
                <TopRentedFilms onFilmClick={setSelectedFilm} />
              )}
              {selectedFilm && (
                <div>
                  <FilmDetails film={selectedFilm} />
                  <div className="button-container">
                    <button
                      className="button button-back"
                      onClick={() => setSelectedFilm(null)}
                    >
                      Back to Film List
                    </button>
                  </div>
                </div>
              )}

              {showTopActors && !selectedActor && (
                <TopActors onActorClick={setSelectedActor} />
              )}
              {selectedActor && (
                <div>
                  <ActorDetails actor={selectedActor} />
                  <div className="button-container">
                    <button
                      className="button button-back"
                      onClick={() => setSelectedActor(null)}
                    >
                      Back to Actor List
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="footer-banner">
        <p>Chris DeFeo Individual Project</p>
      </footer>
    </div>
  );
}

export default App;
