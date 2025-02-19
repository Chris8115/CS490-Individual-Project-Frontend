import React, { useState } from "react";
import "./styles.css";

const ReturnFilm = ({ onSuccess, onCancel }) => {
  const [identifier, setIdentifier] = useState(""); // The ID entered by the user
  const [returnMethod, setReturnMethod] = useState("rental"); // "rental" or "customer"
  const [error, setError] = useState("");

  const handleReturn = () => {
    // Build the payload based on the selected return method.
    const payload =
      returnMethod === "customer"
        ? { customer_id: identifier }
        : { rental_id: identifier };

    fetch("/return_film", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          onSuccess(data);
        }
      })
      .catch(() => {
        setError("An error occurred while returning the film.");
      });
  };

  return (
    <div className="return-film-container">
      <h3>Return Film</h3>
      <div className="return-method">
        <label>
          <input
            type="radio"
            value="rental"
            checked={returnMethod === "rental"}
            onChange={() => setReturnMethod("rental")}
          />
          Return by Rental ID
        </label>
        <label>
          <input
            type="radio"
            value="customer"
            checked={returnMethod === "customer"}
            onChange={() => setReturnMethod("customer")}
          />
          Return by Customer ID
        </label>
      </div>
      <label>
        Enter {returnMethod === "rental" ? "Rental ID" : "Customer ID"}:
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="return-input"
        />
      </label>
      {error && <p className="error-text">{error}</p>}
      <div className="button-container">
        <button className="button button-return" onClick={handleReturn}>
          Confirm Return
        </button>
        <button className="button button-back" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReturnFilm;
