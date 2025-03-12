import React, { useState } from "react";
import "./styles.css";

const RentFilm = ({ film, onSuccess, onCancel }) => {
  const [customerId, setCustomerId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/rent_film", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        film_id: film.film_id,
        customer_id: customerId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          onSuccess(data);
        }
      })
      .catch((err) => {
        setError("An error occurred while processing the rental.");
      });
  };

  return (
    <div className="rent-film-container">
      <h3>Rent "{film.title}"</h3>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Customer ID:
            <input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </label>
        </div>
        <div className="button-container">
          <button type="submit" className="button button-rent">
            Rent Film
          </button>
          <button type="button" className="button button-back" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RentFilm;
