const RequestTimeline = ({ history = [] }) => (
  <div className="timeline">
    {history.map((entry, index) => (
      <div className="timeline-item" key={`${entry.changedAt}-${index}`}>
        <div className="timeline-dot" />
        <div className="timeline-content">
          <strong>{entry.status}</strong>
          <p>{entry.comment}</p>
          <span>
            {entry.changedByName || "System"} on{" "}
            {new Date(entry.changedAt).toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default RequestTimeline;

