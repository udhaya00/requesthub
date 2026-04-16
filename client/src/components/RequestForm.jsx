const RequestForm = ({
  formValues,
  setFormValues,
  requestTypes,
  disabled = false,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  return (
    <div className="form-grid">
      <div className="input-group">
        <label htmlFor="requestType">Request Type</label>
        <select
          id="requestType"
          name="requestType"
          value={formValues.requestType}
          onChange={handleChange}
          disabled={disabled}
        >
          {requestTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={formValues.priority}
          onChange={handleChange}
          disabled={disabled}
        >
          {["urgent", "high", "normal"].map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group full-span">
        <label htmlFor="shortDescription">Short Description</label>
        <input
          id="shortDescription"
          name="shortDescription"
          value={formValues.shortDescription}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      <div className="input-group full-span">
        <label htmlFor="justification">Justification</label>
        <textarea
          id="justification"
          name="justification"
          rows="5"
          value={formValues.justification}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      <div className="input-group full-span">
        <label htmlFor="suggestedAction">Suggested Action</label>
        <textarea
          id="suggestedAction"
          name="suggestedAction"
          rows="4"
          value={formValues.suggestedAction}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      <div className="input-group">
        <label htmlFor="targetResolutionDate">Target Resolution Date</label>
        <input
          id="targetResolutionDate"
          type="date"
          name="targetResolutionDate"
          value={formValues.targetResolutionDate}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default RequestForm;

