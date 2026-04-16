import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  addRequestComment,
  fetchRequestById,
  updateRequest,
  updateRequestStatus,
} from "../api/requestApi";
import PageContainer from "../components/PageContainer.jsx";
import RequestForm from "../components/RequestForm.jsx";
import RequestTimeline from "../components/RequestTimeline.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { NEXT_STATUS_OPTIONS, REQUEST_TYPES } from "../requestMeta.js";

const RequestDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [editValues, setEditValues] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadRequest = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchRequestById(id);
        setRequest(data);
        setEditValues({
          requestType: data.requestType,
          shortDescription: data.shortDescription,
          justification: data.justification,
          priority: data.priority,
          suggestedAction: data.suggestedAction,
          targetResolutionDate: new Date(data.targetResolutionDate).toISOString().slice(0, 10),
        });
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Unable to load request.");
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [id]);

  const refreshRequest = async () => {
    const data = await fetchRequestById(id);
    setRequest(data);
    setEditValues({
      requestType: data.requestType,
      shortDescription: data.shortDescription,
      justification: data.justification,
      priority: data.priority,
      suggestedAction: data.suggestedAction,
      targetResolutionDate: new Date(data.targetResolutionDate).toISOString().slice(0, 10),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateRequest(id, {
        ...editValues,
        targetResolutionDate: new Date(editValues.targetResolutionDate).toISOString(),
      });
      setSuccess("Request updated successfully.");
      await refreshRequest();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to update request.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateRequestStatus(id, {
        status,
        comment: comment || `Status changed to ${status}`,
      });
      setComment("");
      setSuccess(`Request moved to ${status}.`);
      await refreshRequest();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to change status.");
    } finally {
      setSaving(false);
    }
  };

  const handleComment = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await addRequestComment(id, { comment });
      setComment("");
      setSuccess("Comment added successfully.");
      await refreshRequest();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to add comment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageContainer><div className="card">Loading request...</div></PageContainer>;
  }

  if (!request) {
    return (
      <PageContainer>
        <div className="card">
          <p>Request not found.</p>
          <Link to="/my-requests">Back to requests</Link>
        </div>
      </PageContainer>
    );
  }

  const canEdit = request.status === "Submitted";
  const isAdmin = user.role === "admin";

  return (
    <PageContainer>
      <div className="section-heading">
        <div>
          <span className="eyebrow">{request.requestId}</span>
          <h1>{request.shortDescription}</h1>
          <p>Detailed workflow, request metadata, and operational timeline.</p>
        </div>
        <div className="request-row-meta">
          <StatusBadge value={request.priority} variant="priority" />
          <StatusBadge value={request.status} />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="content-grid detail-grid">
        <article className="card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Request Details</span>
              <h3>Editable while submitted</h3>
            </div>
          </div>

          <RequestForm
            formValues={editValues}
            setFormValues={setEditValues}
            requestTypes={REQUEST_TYPES}
            disabled={!canEdit}
          />

          <div className="meta-strip">
            <span>Requester: {request.userId?.name || request.userId?.username}</span>
            <span>
              Target: {new Date(request.targetResolutionDate).toLocaleDateString("en-IN")}
            </span>
            <span>Created: {new Date(request.createdAt).toLocaleString("en-IN")}</span>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={handleSave}
            disabled={!canEdit || saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </article>

        <article className="card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Workflow History</span>
              <h3>Status timeline</h3>
            </div>
          </div>
          <RequestTimeline history={request.history} />
        </article>
      </div>

      {isAdmin && (
        <section className="card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Admin Actions</span>
              <h3>Review, comment, and progress the request</h3>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              rows="3"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Add reviewer notes or fulfillment comments"
            />
          </div>

          <div className="cluster-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={handleComment}
              disabled={!comment.trim() || saving}
            >
              Add Comment
            </button>

            {NEXT_STATUS_OPTIONS[request.status].map((status) => (
              <button
                className="primary-button"
                key={status}
                type="button"
                onClick={() => handleStatusChange(status)}
                disabled={saving}
              >
                Mark as {status}
              </button>
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  );
};

export default RequestDetailsPage;
