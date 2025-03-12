import React, { useState, useEffect } from "react";
import "./styles.css";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("customer_id");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const historyPerPage = 5;


  const [customerData, setCustomerData] = useState({
    customer_id: "",
    store_id: "",
    first_name: "",
    last_name: "",
    email: "",
    address_id: "",
    active: "1",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const response = await fetch("/customers");
    const data = await response.json();
    setCustomers(data);
    setFilteredCustomers(data);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((customer) => {
        if (filterType === "customer_id") {
          return customer.customer_id.toString() === searchQuery.trim();
        } else {
          return customer[filterType]?.toString().toLowerCase().includes(searchQuery.toLowerCase());
        }
      });
      setFilteredCustomers(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, filterType, customers]);

  const handleDelete = async (customerId) => {
    const response = await fetch(`/delete_customer/${customerId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchCustomers();
      setConfirmDelete(null);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer.customer_id);
    setCustomerData({
      customer_id: customer.customer_id,
      store_id: customer.store_id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      address_id: customer.address_id,
      active: customer.active ? "1" : "0",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  
    const response = await fetch(`/edit_customer/${customerData.customer_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });
  
    if (response.ok) {
      fetchCustomers();
      setEditingCustomer(null);
    } else {
      console.error("Failed to update customer");
    }
  };
  
  
  const handleAddCustomer = async (e) => {
    e.preventDefault();
  
    const response = await fetch("/customers/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customerData),
    });
  
    if (response.ok) {
      fetchCustomers();
      setShowAddForm(false);
    }
  };

  const handleInputChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handleViewDetails = async (customer) => {
    setViewingCustomer(customer);
    setHistoryPage(1);
  
    try {
      const response = await fetch(`/customer/${customer.customer_id}/rental_history`);
      if (response.ok) {
        const data = await response.json();
        setRentalHistory(data);
      }
    } catch (error) {
      console.error("Error fetching rental history:", error);
    }
  };

  const handleCloseDetails = () => {
    setViewingCustomer(null);
    setRentalHistory([]);
    setHistoryPage(1);
  };

  const indexOfLastRecord = historyPage * historyPerPage;
  const indexOfFirstRecord = indexOfLastRecord - historyPerPage;
  const currentHistory = rentalHistory.slice(indexOfFirstRecord, indexOfLastRecord);

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  

  return (
    <div className="customer-dashboard">
      <h2>Customer Dashboard</h2>

      <div className="search-container">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="customer_id">Customer ID</option>
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${filterType.replace("_", " ")}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      {/* Add Customer Button */}
      <button className="button add-customer-btn" onClick={() => setShowAddForm(true)}>
        Add Customer
      </button>
      </div>

      <table className="customer-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Store ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Address ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer) => (
            <tr key={customer.customer_id}>
              <td>{customer.customer_id}</td>
              <td>{customer.store_id}</td>
              <td>{customer.first_name}</td>
              <td>{customer.last_name}</td>
              <td>{customer.email}</td>
              <td>{customer.address_id || "N/A"}</td>
              <td>
                <button className="button button-edit" onClick={() => handleEdit(customer)}>Edit</button>
                <button className="button button-delete" onClick={() => setConfirmDelete(customer.customer_id)}>Delete</button>
                <button className="button button-details" onClick={() => handleViewDetails(customer)}> View Details </button>
              </td>


            </tr>
          ))}
        </tbody>
      </table>


      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="button button-films">
          Previous
        </button>
        <span> Page {currentPage} </span>
        <button onClick={() => setCurrentPage(prev => prev + 1)} className="button button-films">
          Next
        </button>
      </div>
      
      
      {selectedCustomer && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Customer Details</h3>
          <p><strong>ID:</strong> {selectedCustomer.customer_id}</p>
          <p><strong>Name:</strong> {selectedCustomer.first_name} {selectedCustomer.last_name}</p>
          <p><strong>Email:</strong> {selectedCustomer.email}</p>
          <p><strong>Store ID:</strong> {selectedCustomer.store_id}</p>
          <p><strong>Address ID:</strong> {selectedCustomer.address_id}</p>

          <h4>Rental History</h4>
          {rentalHistory.length > 0 ? (
            <ul className="rental-list">
              {rentalHistory.map((rental) => (
                <li key={rental.rental_id}>
                  <strong>{rental.title}</strong> - Rented: {new Date(rental.rental_date).toLocaleDateString()} 
                  {rental.return_date ? `, Returned: ${new Date(rental.return_date).toLocaleDateString()}` : ' (Not Returned)'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No rental history found.</p>
          )}

          <div className="button-container">
            <button className="button button-cancel" onClick={() => setSelectedCustomer(null)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Add Customer Modal */}
    {showAddForm && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Add Customer</h3>
          <form onSubmit={handleAddCustomer} className="customer-form">
            <input type="text" name="first_name" placeholder="First Name" onChange={handleInputChange} required />
            <input type="text" name="last_name" placeholder="Last Name" onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
            <input type="number" name="store_id" placeholder="Store ID" onChange={handleInputChange} required />
            <input type="number" name="address_id" placeholder="Address ID" onChange={handleInputChange} required />

            <div className="button-container">
              <button type="submit" className="button button-save">Add Customer</button>
              <button type="button" className="button button-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )}


      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure?</h3>
            <p>Do you really want to delete this customer? This action cannot be undone.</p>
            <div className="button-container">
              <button className="button button-delete" onClick={() => handleDelete(confirmDelete)}>Yes, Delete</button>
              <button className="button button-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Rental History Modal */}
      {viewingCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> {viewingCustomer.first_name} {viewingCustomer.last_name}</p>
            <p><strong>Email:</strong> {viewingCustomer.email}</p>
            <p><strong>Store ID:</strong> {viewingCustomer.store_id}</p>

            <h4>Rental History</h4>
            {currentHistory.length > 0 ? (
              <ul className="rental-history-list">
                {currentHistory.map((rental, index) => (
                  <li key={index}>
                    <strong>Film:</strong> {rental.film_title} <br />
                    <strong>Rented On:</strong> {rental.rental_date} <br />
                    <strong>Returned:</strong> {rental.return_date ? rental.return_date : "Not Returned"}
                  </li>
                ))}
              </ul>
            ) : <p>No rental history available.</p>}
        
              {/* Pagination Buttons */}
              <div className="pagination">
                <button
                  onClick={() => setHistoryPage((prev) => Math.max(prev - 1, 1))}
                  disabled={historyPage === 1}
                  className="button button-films"
                >
                  Previous
                </button>
                <span> Page {historyPage} </span>
                <button
                  onClick={() => setHistoryPage((prev) =>
                    prev < Math.ceil(rentalHistory.length / historyPerPage) ? prev + 1 : prev
                  )}
                  disabled={historyPage >= Math.ceil(rentalHistory.length / historyPerPage)}
                  className="button button-films"
                >
                  Next
                </button>
              </div>
        
              <button className="button button-cancel" onClick={handleCloseDetails}>
                Close
              </button>
            </div>
          </div>
        )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Customer</h3>
            <form onSubmit={handleEditSubmit} className="customer-form">
              <input type="number" name="store_id" value={customerData.store_id} onChange={handleInputChange} required />
              <input type="text" name="first_name" value={customerData.first_name} onChange={handleInputChange} required />
              <input type="text" name="last_name" value={customerData.last_name} onChange={handleInputChange} required />
              <input type="email" name="email" value={customerData.email} onChange={handleInputChange} required />
              <input type="number" name="address_id" value={customerData.address_id} onChange={handleInputChange} required />

              <label>Active:
                <select name="active" value={customerData.active} onChange={handleInputChange}>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </label>

              <div className="button-container">
                <button type="submit" className="button button-save">Save Changes</button>
                <button type="button" className="button button-cancel" onClick={() => setEditingCustomer(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
