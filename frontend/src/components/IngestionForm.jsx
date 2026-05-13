import React, { useState } from 'react';
import { ingestDocument } from '../api';

const RouteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const CLASSIFICATION_FIELDS = [
  { key: 'continent', label: 'Continent', badgeClass: 'badge-purple' },
  { key: 'province', label: 'Province (Molecule)', badgeClass: 'badge-green' },
  { key: 'laboratory', label: 'Lab Context', badgeClass: 'badge-neutral' },
];

const IngestionForm = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await ingestDocument(text);
      setResult(response.classification);
      setText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confidence = result?.disease_confidence ?? 0;

  return (
    <div className="animate-in">
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <RouteIcon />
            Ingest Raw Document
          </div>
          <p className="card-desc">
            Paste unedited clinical trial observations, lab notes, or genomic sequences.
            BioMap will zero-shot classify and route the document — no extraction, no paraphrasing.
          </p>
        </div>

        <form onSubmit={handleIngest}>
          <div className="input-group">
            <label className="input-label" htmlFor="raw-doc">Raw Document Content</label>
            <textarea
              id="raw-doc"
              className="textarea-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`e.g., Date: 2021-04-12\nExperiment: Cell viability assay (MTS)\nTarget: EGFR inhibitor response in non-small cell lung cancer line A549...\n`}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-box">
              <AlertIcon /> {error}
            </div>
          )}

          {loading ? (
            <div className="processing-row">
              <div className="processing-dots">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
              <span className="processing-text">NLP Engine Processing…</span>
            </div>
          ) : (
            <button
              id="btn-ingest"
              type="submit"
              className="btn btn-primary"
              disabled={!text.trim()}
            >
              <RouteIcon />
              Ingest &amp; Route
            </button>
          )}
        </form>

        {result && (
          <div className="classification-result">
            <div className="classification-header">
              <CheckIcon />
              Routing Successful
            </div>

            <div className="classification-grid">
              {CLASSIFICATION_FIELDS.map(({ key, label, badgeClass }) => (
                <div className="classification-cell" key={key}>
                  <div className="classification-cell-label">{label}</div>
                  <span className={`badge ${badgeClass}`}>{result[key]}</span>
                </div>
              ))}

              {/* Disease identification — full-width */}
              <div className="classification-cell disease-cell">
                <div className="classification-cell-label">Disease Identified</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-amber">{result.disease}</span>
                  {confidence > 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                      {confidence}% Precision
                    </span>
                  )}
                </div>
                {confidence > 0 && (
                  <div className="confidence-bar-wrap">
                    <div
                      className="confidence-bar-fill"
                      style={{ width: `${Math.min(confidence, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngestionForm;
