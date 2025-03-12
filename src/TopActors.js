import React, { useState, useEffect } from "react";
import "./styles.css";

const TopActors = ({ onActorClick }) => {
  const [actors, setActors] = useState([]);

  useEffect(() => {
    fetch("/top_actors")
      .then((response) => response.json())
      .then((data) => setActors(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="top-5-container">
      <h2>Top 5 Actors of Our Inventory</h2>
      <table className="top-5-table">
        <thead>
          <tr>
            <th>Actor Name</th>
            <th>Films</th>
          </tr>
        </thead>
        <tbody>
          {actors.map((actor, index) => (
            <tr key={index} onClick={() => onActorClick(actor)} style={{ cursor: "pointer" }}>
              <td>{actor.actor_name}</td>
              <td>{actor.film_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopActors;
