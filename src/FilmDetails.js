import React, { useState, useEffect } from "react";
import RentFilm from "./RentFilm";      // Component for renting a film
import ReturnFilm from "./ReturnFilm";  // Component for returning a film
import "./styles.css";

const FilmDetails = ({ film }) => {
  const [showRentForm, setShowRentForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [rentalSuccess, setRentalSuccess] = useState(null);
  const [currentRentalId, setCurrentRentalId] = useState(null);
  const [totalInventory, setTotalInventory] = useState(null);
  const [availableInventory, setAvailableInventory] = useState(null);
  const [refreshInventory, setRefreshInventory] = useState(false);

  // Function to fetch inventory info (both total and available copies) for this film
  const refreshInventoryCount = () => {
    fetch(`/film_inventory/${film.film_id}`)
      .then((res) => res.json())
      .then((data) => {
        setTotalInventory(data.total_inventory);
        setAvailableInventory(data.available_inventory);
      })
      .catch((err) =>
        console.error("Error fetching inventory count:", err)
      );
  };

  useEffect(() => {
    refreshInventoryCount();
  }, [film.film_id, refreshInventory]);

  // Calculate the number of rented copies
  const rentedCount =
    totalInventory !== null && availableInventory !== null
      ? totalInventory - availableInventory
      : 0;

  return (
    <div className="film-details-panel">
      <h2>{film.title} Details</h2>
      <p><strong>Description:</strong> {film.description}</p>
      <p><strong>Release Year:</strong> {film.release_year}</p>
      <p><strong>Language ID:</strong> {film.language_id}</p>
      <p><strong>Original Language ID:</strong> {film.original_language_id}</p>
      <p><strong>Rental Duration:</strong> {film.rental_duration} days</p>
      <p><strong>Rental Rate:</strong> ${film.rental_rate}</p>
      <p><strong>Length:</strong> {film.length} min</p>
      <p><strong>Replacement Cost:</strong> ${film.replacement_cost}</p>
      <p><strong>Rating:</strong> {film.rating}</p>
      <p><strong>Special Features:</strong> {film.special_features}</p>
      <p><strong>Last Update:</strong> {film.last_update}</p>
      {totalInventory !== null && availableInventory !== null && (
        <p>
          <strong>Available Copies:</strong> {availableInventory} / {totalInventory}
        </p>
      )}

      {/* Always show Return Film button if there are active rentals */}
      {rentedCount > 0 && !showReturnForm && (
        <button
          className="button button-return"
          onClick={() => setShowReturnForm(true)}
        >
          Return Film
        </button>
      )}

      {/* Rent Film Button: Only show if no active rental is being processed */}
      {!showRentForm && !showReturnForm && currentRentalId === null && (
        <button
          className="button button-rent"
          onClick={() => setShowRentForm(true)}
        >
          Rent Film
        </button>
      )}

      {showRentForm && (
        <RentFilm
          film={film}
          onSuccess={(data) => {
            setRentalSuccess(data);
            setCurrentRentalId(data.rental_id);
            setShowRentForm(false);
            // Trigger a refresh of inventory after renting
            setRefreshInventory((prev) => !prev);
          }}
          onCancel={() => setShowRentForm(false)}
        />
      )}

      {showReturnForm && (
        <ReturnFilm
          rentalId={currentRentalId}
          onSuccess={(data) => {
            // Clear the active rental and refresh inventory after returning
            setCurrentRentalId(null);
            setShowReturnForm(false);
            setRefreshInventory((prev) => !prev);
          }}
          onCancel={() => setShowReturnForm(false)}
        />
      )}

      {rentalSuccess && currentRentalId && (
        <p className="success-text">
          Film rented successfully! Rental ID: {currentRentalId}
        </p>
      )}
    </div>
  );
};

export default FilmDetails;
