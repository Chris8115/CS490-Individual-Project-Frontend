import React, { useState } from "react";
import FilmDetails from "./FilmDetails";
import "./styles.css";

const SearchFilms = () => {
  const [searchType, setSearchType] = useState("film");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`/search?type=${searchType}&query=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error("Error searching:", err));
  };

  if (selectedFilm) {
    return (
      <div className="search-container">
        <FilmDetails film={selectedFilm} />
        <div className="button-container">
          <button
            className="button button-back"
            onClick={() => setSelectedFilm(null)}
          >
            Back to Search Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="search-container">
      <h2>Search Films</h2>
      <form onSubmit={handleSearch} className="search-form">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="search-select"
        >
          <option value="film">Film Name</option>
          <option value="actor">Actor Name</option>
          <option value="genre">Genre</option>
        </select>
        <input
          type="text"
          placeholder="Enter search text..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="button button-films">
          Search
        </button>
      </form>
      <div className="search-results">
        {results.length > 0 ? (
          <ul>
            {results.map((film, index) => (
              <li
                key={index}
                className="search-result-item"
                onClick={() => setSelectedFilm(film)}
                style={{ cursor: "pointer" }}
              >
                <h3>{film.title}</h3>
                <p>{film.description}</p>
                <p>
                  <strong>Release Year:</strong> {film.release_year}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchFilms;
