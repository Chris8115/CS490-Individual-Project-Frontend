import React, { useState, useEffect } from "react";
import "./styles.css";

const TopRentedFilms = ({ onFilmClick }) => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetch("/top_rented_films")
      .then((response) => response.json())
      .then((data) => setFilms(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="top-5-container">
      <h2>Top 5 Most Rented Films</h2>
      <table className="top-5-table">
        <thead>
          <tr>
            <th>Film Name</th>
            <th>Rentals</th>
          </tr>
        </thead>
        <tbody>
          {films.map((film, index) => (
            <tr key={index} onClick={() => onFilmClick(film)} style={{ cursor: "pointer" }}>
              <td>{film.title}</td>
              <td>{film.rental_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopRentedFilms;
