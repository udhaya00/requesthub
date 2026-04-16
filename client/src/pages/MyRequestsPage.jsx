import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { downloadRequestsCsv, fetchRequests } from "../api/requestApi";
import EmptyState from "../components/EmptyState.jsx";
import FilterBar from "../components/FilterBar.jsx";
import Modal from "../components/Modal.jsx";
import PageContainer from "../components/PageContainer.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { REQUEST_TYPES } from "../requestMeta.js";

const initialFilters = {
  type: "",
  status: "",
  priority: "",
  startDate: "",
  endDate: "",
};

const MyRequestsPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchRequests(filters);
        setRequests(data);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Unable to load requests.");
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [filters]);

  const summary = {
    total: requests.length,
    open: requests.filter((request) =>
      ["Submitted", "Under Review", "Approved", "Fulfilled"].includes(request.status)
    ).length,
  };

  const handleDownload = async () => {
    setExporting(true);

    try {
      const blob = await downloadRequestsCsv(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "smart-request-hub-requests.csv";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to export CSV.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageContainer>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Request portfolio</span>
          <h1>My requests</h1>
          <p>Filter, export, preview, and drill into the requests in your workspace.</p>
        </div>
        <div className="cluster-actions">
          <button className="secondary-button" type="button" onClick={handleDownload}>
            {exporting ? "Exporting..." : "Download CSV"}
          </button>
          <button
            className="ghost-button"
            type="button"
            onClick={() => setPreviewOpen(true)}
          >
            Preview PDF
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onReset={() => setFilters(initialFilters)}
        requestTypes={REQUEST_TYPES}
      />

      <div className="stats-inline card">
        <strong>{summary.total}</strong>
        <span>Total results</span>
        <strong>{summary.open}</strong>
        <span>Active requests</span>
      </div>

      {loading ? (
        <div className="card">Loading requests...</div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No requests match the current filters"
          description="Try widening the filters or create a new request."
          action={
            <Link className="primary-button button-link" to="/new-request">
              Create request
            </Link>
          }
        />
      ) : (
        <div className="request-list">
          {requests.map((request) => (
            <Link className="request-card" key={request._id} to={`/requests/${request._id}`}>
              <div className="request-card-head">
                <div>
                  <span className="eyebrow">{request.requestType}</span>
                  <h3>{request.shortDescription}</h3>
                </div>
                <div className="request-row-meta">
                  <StatusBadge value={request.priority} variant="priority" />
                  <StatusBadge value={request.status} />
                </div>
              </div>
              <p>{request.justification}</p>
              <div className="request-card-foot">
                <span>{request.requestId}</span>
                <span>
                  Target: {new Date(request.targetResolutionDate).toLocaleDateString("en-IN")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal
        open={previewOpen}
        title="PDF Preview Simulation"
        onClose={() => setPreviewOpen(false)}
      >
        <div className="pdf-preview">
          <div className="pdf-header">
            <h2>Smart Request Hub</h2>
            <p>Request Portfolio Snapshot</p>
          </div>
          {requests.slice(0, 8).map((request) => (
            <div className="pdf-row" key={request._id}>
              <strong>{request.requestId}</strong>
              <span>{request.shortDescription}</span>
              <span>{request.status}</span>
            </div>
          ))}
          {!requests.length && <p>No records available for preview.</p>}
        </div>
      </Modal>
    </PageContainer>
  );
};

export default MyRequestsPage;
