import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./styles.css";
import SearchFilms from "./SearchFilms";
import FilmDetails from "./FilmDetails";
import CustomerPage from "./CustomerPage";
import ActorDetails from "./ActorDetails";



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


function App() {
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);

  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <main className="content">
          <Routes>
            {/* Home Page: Show Top 5 Films & Top 5 Actors Side-by-Side */}
            <Route
              path="/"
              element={
                <div className="app-container">
                  {!selectedFilm && !selectedActor && (
                    <div className="top-5-wrapper">
                      <TopRentedFilms onFilmClick={setSelectedFilm} />
                      <TopActors onActorClick={setSelectedActor} />
                    </div>
                  )}

                  {/* Show Film Details when a film is selected */}
                  {selectedFilm && (
                    <div className="details-panel">
                      <FilmDetails film={selectedFilm} />
                      <div className="button-container">
                        <button className="button button-back" onClick={() => setSelectedFilm(null)}>
                          Back to Film List
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show Actor Details when an actor is selected */}
                  {selectedActor && (
                    <div className="details-panel">
                      <ActorDetails actor={selectedActor} />
                      <div className="button-container">
                        <button className="button button-back" onClick={() => setSelectedActor(null)}>
                          Back to Actor List
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              }
            />

            {/* Search Films Page */}
            <Route path="/search" element={<SearchFilms />} />

            {/* Customer Page */}
            <Route path="/customers" element={<CustomerPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const Header = () => {
  const location = useLocation();
  return (
    <header className="header-banner">
      <div className="nav-buttons">
        {/* Only show "Back to Home" when NOT on Home Page */}
        {location.pathname !== "/" && (
          <Link to="/" className="button button-back">
            Back to Home
          </Link>
        )}

        {/* Only show "Customer Page" when NOT on Customer Page */}
        {location.pathname !== "/customers" && (
          <Link to="/customers" className="button button-films">
            Customer Page
          </Link>
        )}
      </div>

      <h1>Sakila Rental Service</h1>

      {/* Only show "Search Films" when NOT on Search Page */}
      {location.pathname !== "/search" && (
        <Link to="/search" className="button button-films search-btn">
          Search Films
        </Link>
      )}
    </header>
  );
};


const Footer = () => (
  <footer className="footer-banner">
    <p>Chris DeFeo Individual Project</p>
  </footer>
);

export default App;