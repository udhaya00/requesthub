const FilterBar = ({ filters, setFilters, onReset, requestTypes }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div className="filter-bar card">
      <div className="input-group">
        <label htmlFor="type">Type</label>
        <select id="type" name="type" value={filters.type} onChange={handleChange}>
          <option value="">All types</option>
          {requestTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={filters.status} onChange={handleChange}>
          <option value="">All statuses</option>
          {["Submitted", "Under Review", "Approved", "Rejected", "Fulfilled", "Closed"].map(
            (status) => (
              <option key={status} value={status}>
                {status}
              </option>
            )
          )}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={filters.priority}
          onChange={handleChange}
        >
          <option value="">All priorities</option>
          {["urgent", "high", "normal"].map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="startDate">From</label>
        <input
          id="startDate"
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="input-group">
        <label htmlFor="endDate">To</label>
        <input
          id="endDate"
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>

      <button className="ghost-button align-end" type="button" onClick={onReset}>
        Reset filters
      </button>
    </div>
  );
};

export default FilterBar;

