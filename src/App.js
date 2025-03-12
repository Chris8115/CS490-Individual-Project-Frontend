import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./styles.css";
import SearchFilms from "./SearchFilms";
import FilmDetails from "./FilmDetails";
import CustomerPage from "./CustomerPage";
import ActorDetails from "./ActorDetails";
import TopRentedFilms from "./TopRentedFilms";
import TopActors from "./TopActors";



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
      {/* Title */}
      <h1 className="site-title">Sakila Rental Service</h1>

      {/* Navigation Buttons*/}
      <div className="nav-buttons">
        {/* Back to Home */}
        {location.pathname !== "/" && (
          <Link to="/" className="button button-back">
            Back to Home
          </Link>
        )}

        {/* Customer Page */}
        {location.pathname !== "/customers" && (
          <Link to="/customers" className="button button-films customer-btn">
            Customer Page
          </Link>
        )}

        {/* Search Films */}
        {location.pathname !== "/search" && (
          <Link to="/search" className="button button-films search-btn">
            Search Films
          </Link>
        )}
      </div>
    </header>
  );
};



const Footer = () => (
  <footer className="footer-banner">
    <p>Chris DeFeo Individual Project</p>
  </footer>
);

export default App;