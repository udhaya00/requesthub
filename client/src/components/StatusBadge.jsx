const StatusBadge = ({ value, variant = "status" }) => (
  <span className={`badge badge-${variant} badge-${String(value).toLowerCase().replace(/\s+/g, "-")}`}>
    {value}
  </span>
);

export default StatusBadge;

