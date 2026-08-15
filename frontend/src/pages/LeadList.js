import React, { useState } from "react";

function LeadList({
  leads,
  fetchLeads,
  fetchStats,
  setSelectedLead,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // -------------------------
  // FILTER LOGIC
  // -------------------------
  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      lead.name?.toLowerCase().includes(term) ||
      lead.email?.toLowerCase().includes(term) ||
      lead.company?.toLowerCase().includes(term);

    const matchesStage =
      stageFilter === "All" || lead.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  // -------------------------
  // DELETE LEAD
  // -------------------------
  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;

    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete lead");
      }

      alert("Lead deleted successfully!");

      await fetchLeads();

      if (fetchStats) {
        await fetchStats();
      }
    } catch (err) {
      console.log("Error deleting lead:", err);
      alert("Delete failed");
    }
  };

  // -------------------------
  // CONVERT LEAD TO CUSTOMER
  // -------------------------
  const convertToCustomer = async (lead) => {
    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: lead.name,
          email: lead.email,
          company: lead.company,
          sourceleadid: lead._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        throw new Error(
          errorData.message || "Failed to convert lead to customer"
        );
      }

      alert("Lead converted to Customer successfully!");
    } catch (err) {
      console.log("Error converting lead:", err);
      alert(err.message || "Conversion failed");
    }
  };

  // -------------------------
  // EXPORT CSV
  // -------------------------
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Company", "Stage"];

    const rows = filteredLeads.map((lead) => [
      lead.name || "",
      lead.email || "",
      lead.company || "",
      lead.stage || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) =>
          row
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);

    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads_report.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* SEARCH + FILTER + EXPORT */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-md-5">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="🔍 Search name, email, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-3">
          <select
            className="form-select form-select-sm"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="All">All Stages</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="col-6 col-md-4">
          <button
            className="btn btn-success btn-sm w-100 shadow-sm fw-bold"
            onClick={exportToCSV}
          >
            📄 Export CSV
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table
          className="table table-bordered table-hover bg-white shadow-sm mb-0"
          style={{ minWidth: "600px" }}
        >
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Stage</th>
              <th style={{ minWidth: "250px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead._id} className="align-middle">
                  <td className="fw-bold">{lead.name}</td>

                  <td>{lead.email}</td>

                  <td>{lead.company}</td>

                  <td>
                    <span
                      className={`badge ${
                        lead.stage === "Won"
                          ? "bg-success"
                          : lead.stage === "Qualified"
                          ? "bg-warning text-dark"
                          : lead.stage === "Lost"
                          ? "bg-danger"
                          : "bg-info text-dark"
                      }`}
                    >
                      {lead.stage}
                    </span>
                  </td>

                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {/* EDIT */}
                      <button
                        className="btn btn-primary btn-sm px-2 shadow-sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        className="btn btn-danger btn-sm px-2 shadow-sm"
                        onClick={() => deleteLead(lead._id)}
                      >
                        Delete
                      </button>

                      {/* CONVERT */}
                      <button
                        className="btn btn-success btn-sm px-2 shadow-sm"
                        onClick={() => convertToCustomer(lead)}
                      >
                        Convert
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-muted"
                >
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeadList;