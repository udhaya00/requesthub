import { useState } from "react";

import { analyzePrompt, createRequest } from "../api/requestApi";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PageContainer from "../components/PageContainer.jsx";
import RequestForm from "../components/RequestForm.jsx";
import { REQUEST_TYPES } from "../requestMeta.js";

const emptyDraft = {
  requestType: REQUEST_TYPES[0],
  shortDescription: "",
  justification: "",
  priority: "normal",
  suggestedAction: "",
  targetResolutionDate: "",
};

const formatDateInput = (dateValue) => new Date(dateValue).toISOString().slice(0, 10);

const NewRequestPage = () => {
  const [prompt, setPrompt] = useState("");
  const [formValues, setFormValues] = useState(emptyDraft);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAnalyze = async () => {
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const analysis = await analyzePrompt(prompt);
      setFormValues({
        requestType: analysis.requestType,
        shortDescription: analysis.shortDescription,
        justification: analysis.justification,
        priority: analysis.priority,
        suggestedAction: analysis.suggestedAction,
        targetResolutionDate: formatDateInput(analysis.targetResolutionDate),
      });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to analyze prompt.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createRequest({
        ...formValues,
        originalPrompt: prompt,
        targetResolutionDate: new Date(formValues.targetResolutionDate).toISOString(),
      });
      setSuccess("Request submitted successfully.");
      setPrompt("");
      setFormValues(emptyDraft);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to submit request.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageContainer>
      <section className="section-heading">
        <div>
          <span className="eyebrow">AI-assisted intake</span>
          <h1>Create a new request</h1>
          <p>Describe the need in plain language. The backend will classify and draft it.</p>
        </div>
      </section>

      <div className="content-grid">
        <article className="card">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Step 1</span>
              <h3>Describe what you need</h3>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="prompt">Request Prompt</label>
            <textarea
              id="prompt"
              rows="9"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Example: I need urgent VPN and CRM access for a new joiner starting tomorrow so the sales onboarding plan does not slip."
            />
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={handleAnalyze}
            disabled={processing || prompt.trim().length < 10}
          >
            {processing ? "Analyzing..." : "Generate Draft"}
          </button>

          {processing && <LoadingSpinner label="AI is structuring your request" />}
        </article>

        <form className="card" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">Step 2</span>
              <h3>Review and submit</h3>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <RequestForm
            formValues={formValues}
            setFormValues={setFormValues}
            requestTypes={REQUEST_TYPES}
          />

          <div className="stack-actions">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? "Submitting..." : "Submit Request"}
            </button>
            <p className="muted-copy">
              Requests remain editable while they are still in Submitted status.
            </p>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};

export default NewRequestPage;
