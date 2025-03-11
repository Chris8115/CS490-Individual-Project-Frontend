import React, { useState, useEffect } from "react";
import "./styles.css";

const ActorDetails = ({ actor, onBack }) => {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    fetch(`actor_films/${actor.actor_id}`)
      .then((response) => response.json())
      .then((data) => setFilms(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [actor.actor_id]);

  return (
    <div className="details-panel"> {}
      <h2>{actor.actor_name}'s Details</h2>
      <p><strong>Actor ID:</strong> {actor.actor_id}</p>
      <p><strong>Films in Inventory:</strong> {actor.film_count}</p>

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

export default ActorDetails;
