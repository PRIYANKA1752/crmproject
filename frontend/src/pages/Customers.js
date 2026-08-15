import React, { useEffect, useState } from "react";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`);

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();

      setCustomers(
        (data || []).map((c) => ({
          ...c,
          _id: c._id || c.id,
        }))
      );
    } catch (err) {
      console.log("Error fetching customers:", err);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      alert("Customer deleted successfully!");

      fetchCustomers();
    } catch (err) {
      console.log("Error deleting customer:", err);
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="container-fluid p-0">
      <h3 className="fw-bold mb-3">
        Converted Customers Database
      </h3>

      <div className="table-responsive">
        <table
          className="table table-bordered table-hover bg-white shadow-sm mb-0"
          style={{ minWidth: "500px" }}
        >
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th style={{ width: "100px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.length > 0 ? (
              customers.map((c) => (
                <tr key={c._id} className="align-middle">
                  <td className="fw-bold">{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.company}</td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm shadow-sm px-3"
                      onClick={() => deleteCustomer(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-muted"
                >
                  No converted customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;