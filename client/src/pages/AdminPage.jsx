import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchDashboardStats } from "../api/adminApi";
import { fetchRequests, updateRequestStatus } from "../api/requestApi";
import PageContainer from "../components/PageContainer.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { NEXT_STATUS_OPTIONS } from "../requestMeta.js";

const AdminPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    fulfilled: 0,
    recentRequests: [],
  });
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [statsData, requestData] = await Promise.all([
        fetchDashboardStats(),
        fetchRequests(),
      ]);
      setStats(statsData);
      setRequests(requestData);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to load admin view.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const actionableRequests = requests.filter((request) =>
    ["Submitted", "Under Review", "Approved", "Fulfilled"].includes(request.status)
  );

  const handleStatusChange = async (requestId, status) => {
    setBusyId(requestId + status);

    try {
      await updateRequestStatus(requestId, {
        status,
        comment: `Admin updated request to ${status}`,
      });
      await loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to update status.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <PageContainer>
      <div className="section-heading">
        <div>
          <span className="eyebrow">Admin Control Center</span>
          <h1>Operations review board</h1>
          <p>Approve, reject, fulfill, and close requests while watching queue health.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="stats-grid">
        <StatCard
          label="Total"
          value={loading ? "--" : stats.total}
          caption="All requests in the system."
        />
        <StatCard
          label="Pending"
          value={loading ? "--" : stats.pending}
          caption="Awaiting review or decision."
        />
        <StatCard
          label="Approved"
          value={loading ? "--" : stats.approved}
          caption="Ready for fulfillment work."
        />
        <StatCard
          label="Fulfilled"
          value={loading ? "--" : stats.fulfilled}
          caption="Ready to be closed out."
        />
      </section>

      <div className="content-grid">
        <article className="card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Action Queue</span>
              <h3>Requests needing movement</h3>
            </div>
          </div>

          <div className="request-list">
            {actionableRequests.map((request) => (
              <div className="request-card" key={request._id}>
                <div className="request-card-head">
                  <div>
                    <span className="eyebrow">{request.userId?.username}</span>
                    <h3>{request.shortDescription}</h3>
                  </div>
                  <div className="request-row-meta">
                    <StatusBadge value={request.priority} variant="priority" />
                    <StatusBadge value={request.status} />
                  </div>
                </div>

                <p>{request.justification}</p>

                <div className="cluster-actions">
                  <Link className="ghost-button button-link" to={`/requests/${request._id}`}>
                    Open details
                  </Link>
                  {NEXT_STATUS_OPTIONS[request.status].map((status) => (
                    <button
                      className="primary-button"
                      key={status}
                      type="button"
                      disabled={busyId === request._id + status}
                      onClick={() => handleStatusChange(request._id, status)}
                    >
                      {busyId === request._id + status ? "Updating..." : status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Recent System Activity</span>
              <h3>Latest submissions</h3>
            </div>
          </div>

          <div className="request-list">
            {stats.recentRequests.map((request) => (
              <Link className="request-row" key={request._id} to={`/requests/${request._id}`}>
                <div>
                  <strong>{request.shortDescription}</strong>
                  <p>{request.userId?.username}</p>
                </div>
                <StatusBadge value={request.status} />
              </Link>
            ))}
          </div>
        </article>
      </div>
    </PageContainer>
  );
};

export default AdminPage;
