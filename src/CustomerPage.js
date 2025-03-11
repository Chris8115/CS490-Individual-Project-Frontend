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

  const handleShowAll = () => {
    setSearchQuery("");
    setFilteredCustomers(customers);
    setCurrentPage(1);
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
    }
  };

  const handleDelete = async (customerId) => {
    const response = await fetch(`/delete_customer/${customerId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchCustomers();
      setConfirmDelete(null); // Close the modal
    }
  };

  const handleInputChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

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
      </div>

      <button className="button button-films" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Cancel" : "Add Customer"}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddCustomer} className="customer-form">
          <input type="text" name="first_name" placeholder="First Name" onChange={handleInputChange} required />
          <input type="text" name="last_name" placeholder="Last Name" onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
          <input type="number" name="store_id" placeholder="Store ID" onChange={handleInputChange} required />
          <input type="number" name="address_id" placeholder="Address ID" onChange={handleInputChange} required />
          <button type="submit" className="button button-films">Add Customer</button>
        </form>
      )}

      <table className="customer-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Store ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
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
              <td>
                <button className="button button-edit" onClick={() => handleEdit(customer)}>Edit</button>
                <button className="button button-delete" onClick={() => setConfirmDelete(customer.customer_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCustomer && (
        <div className="customer-form">
          <h3>Edit Customer</h3>
          <form onSubmit={handleEditSubmit}>
            <input type="number" name="store_id" value={customerData.store_id} onChange={handleInputChange} required />
            <input type="text" name="first_name" value={customerData.first_name} onChange={handleInputChange} required />
            <input type="text" name="last_name" value={customerData.last_name} onChange={handleInputChange} required />
            <input type="email" name="email" value={customerData.email} onChange={handleInputChange} required />
            <input type="number" name="address_id" value={customerData.address_id} onChange={handleInputChange} required />
            <div className="button-container">
              <button type="submit" className="button button-save">Save Changes</button>
              <button type="button" className="button button-cancel" onClick={() => setEditingCustomer(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="pagination">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="button button-films">
          Previous
        </button>
        <span> Page {currentPage} </span>
        <button onClick={() => setCurrentPage(prev => prev + 1)} className="button button-films">
          Next
        </button>
      </div>
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

    </div>
  );
};

export default CustomerPage;
