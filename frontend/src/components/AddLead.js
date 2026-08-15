import React, { useEffect, useState } from "react";
import API_URL from "../config";

function AddLead({
  selectedLead,
  setSelectedLead,
  fetchLeads,
  fetchStats,
  onClose,
}) {
  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    stage: "New",
  });

  const [loading, setLoading] = useState(false);

  // Prefill when editing
  useEffect(() => {
    if (selectedLead) {
      setLead({
        name: selectedLead.name || "",
        email: selectedLead.email || "",
        phone: selectedLead.phone || "",
        company: selectedLead.company || "",
        stage: selectedLead.stage || "New",
      });
    }
  }, [selectedLead]);

  // Handle input changes
  const handleChange = (e) => {
    setLead({
      ...lead,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update Lead using MongoDB backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = selectedLead
        ? `${API_URL}/leads/${selectedLead._id}`
        : `${API_URL}/leads`;

      const method = selectedLead ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          phone: lead.phone || "0000000000",
          company: lead.company,
          stage: lead.stage || "New",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save lead");
      }

      alert(
        selectedLead
          ? "Lead Updated Successfully!"
          : "Lead Added Successfully!"
      );

      if (setSelectedLead) {
        setSelectedLead(null);
      }

      if (fetchLeads) {
        fetchLeads();
      }

      if (fetchStats) {
        fetchStats();
      }

      setLead({
        name: "",
        email: "",
        phone: "",
        company: "",
        stage: "New",
      });

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Error saving lead:", err);
      alert(err.message || "Failed to save lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 p-md-4 mt-3 shadow-sm border-0 rounded-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0 fs-5">
          {selectedLead ? "Edit Lead Details" : "Add New Lead"}
        </h4>

        {(selectedLead || onClose) && (
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              if (setSelectedLead) {
                setSelectedLead(null);
              }

              if (onClose) {
                onClose();
              }
            }}
          ></button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label small fw-bold text-secondary">
            Full Name *
          </label>

          <input
            className="form-control"
            name="name"
            placeholder="John Doe"
            value={lead.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row g-2 mb-2">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary">
              Email Address *
            </label>

            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="john@example.com"
              value={lead.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary">
              Phone Number
            </label>

            <input
              type="text"
              className="form-control"
              name="phone"
              placeholder="9876543210"
              value={lead.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary">
              Company Name
            </label>

            <input
              className="form-control"
              name="company"
              placeholder="TechCorp"
              value={lead.company}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-secondary">
              Lead Stage
            </label>

            <select
              className="form-select"
              name="stage"
              value={lead.stage}
              onChange={handleChange}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
          type="submit"
          disabled={loading}
        >
          {loading
            ? selectedLead
              ? "Updating..."
              : "Adding..."
            : selectedLead
            ? "Update Lead"
            : "Add Lead"}
        </button>
      </form>
    </div>
  );
}

export default AddLead;