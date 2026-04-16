import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { fetchDashboardStats } from "../api/adminApi";
import { fetchRequests } from "../api/requestApi";
import EmptyState from "../components/EmptyState.jsx";
import PageContainer from "../components/PageContainer.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    fulfilled: 0,
    recentRequests: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        if (user.role === "admin") {
          const adminStats = await fetchDashboardStats();
          setStats(adminStats);
        } else {
          const requests = await fetchRequests();
          setStats({
            total: requests.length,
            pending: requests.filter((request) =>
              ["Submitted", "Under Review"].includes(request.status)
            ).length,
            approved: requests.filter((request) => request.status === "Approved").length,
            fulfilled: requests.filter((request) => request.status === "Fulfilled").length,
            recentRequests: requests.slice(0, 6),
          });
        }
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user.role]);

  return (
    <PageContainer>
      <section className="hero-panel card">
        <div>
          <span className="eyebrow">Operations Overview</span>
          <h1>Request intelligence with real workflow control.</h1>
          <p>
            Track intake volume, review bottlenecks, fulfillment pace, and team
            activity from one clean command center.
          </p>
        </div>
        <Link className="primary-button button-link" to="/new-request">
          Create New Request
        </Link>
      </section>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="stats-grid">
        <StatCard
          label="Total Requests"
          value={loading ? "--" : stats.total}
          caption="All requests in scope for your account."
        />
        <StatCard
          label="Pending Review"
          value={loading ? "--" : stats.pending}
          caption="Submitted and under-review work items."
        />
        <StatCard
          label="Approved"
          value={loading ? "--" : stats.approved}
          caption="Requests already cleared for action."
        />
        <StatCard
          label="Fulfilled"
          value={loading ? "--" : stats.fulfilled}
          caption="Requests completed by operations teams."
        />
      </section>

      <section className="content-grid">
        <article className="card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Recent Activity</span>
              <h3>Latest requests</h3>
            </div>
            <Link to="/my-requests">View all</Link>
          </div>

          {stats.recentRequests.length === 0 ? (
            <EmptyState
              title="No requests yet"
              description="Create your first request to start the workflow."
              action={
                <Link className="primary-button button-link" to="/new-request">
                  Start a request
                </Link>
              }
            />
          ) : (
            <div className="request-list">
              {stats.recentRequests.map((request) => (
                <Link
                  className="request-row"
                  key={request._id}
                  to={`/requests/${request._id}`}
                >
                  <div>
                    <strong>{request.shortDescription}</strong>
                    <p>{request.requestId}</p>
                  </div>
                  <div className="request-row-meta">
                    <StatusBadge value={request.priority} variant="priority" />
                    <StatusBadge value={request.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </article>

        <article className="card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Service Catalog</span>
              <h3>Supported request types</h3>
            </div>
          </div>
          <div className="catalog-list">
            {[
              {
                title: "System Access Request",
                text: "Applications, entitlements, VPN, and account provisioning.",
              },
              {
                title: "Equipment Request",
                text: "Workplace hardware, peripherals, and device lifecycle needs.",
              },
              {
                title: "Facility Request",
                text: "Workspace, rooms, site services, parking, and maintenance needs.",
              },
              {
                title: "General Service Request",
                text: "Shared services intake for operational requests outside the main flows.",
              },
            ].map((item) => (
              <div className="catalog-card" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </PageContainer>
  );
};

export default DashboardPage;
