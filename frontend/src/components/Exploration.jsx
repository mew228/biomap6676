import React, { useState } from 'react';
import { searchDocuments } from '../api';

const SearchIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const NodeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const LabIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2v6l-2 4v8h16V12L18 8V2"/><line x1="6" y1="2" x2="18" y2="2"/>
  </svg>
);

const Exploration = () => {
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState('EGFR');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || !province.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchDocuments(query, province);
      setResults(response.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in">
      {/* Search Panel */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <SearchIcon size={17} />
            Strict Semantic Search
          </div>
          <p className="card-desc">
            Query raw experimental data across the BioMap network. Results are strictly filtered by the
            specified Target Molecule (Province) using local embedding similarity.
          </p>
        </div>

        <form onSubmit={handleSearch}>
          <div className="search-row">
            <div className="input-group province-wrap">
              <label className="input-label" htmlFor="province-input">Target Molecule (Province)</label>
              <div className="input-icon-wrap">
                <span className="input-icon"><NodeIcon /></span>
                <input
                  id="province-input"
                  type="text"
                  className="text-input"
                  value={province}
                  onChange={(e) => setProvince(e.target.value.toUpperCase())}
                  placeholder="e.g., EGFR"
                />
              </div>
            </div>

            <div className="input-group query-wrap">
              <label className="input-label" htmlFor="query-input">Semantic Query</label>
              <input
                id="query-input"
                type="text"
                className="text-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., cell lysis response at 48 hours"
              />
            </div>

            <button
              id="btn-search"
              type="submit"
              className="btn btn-primary"
              disabled={loading || !query.trim() || !province.trim()}
              style={{ flexShrink: 0, alignSelf: 'flex-end', marginBottom: 0 }}
            >
              {loading ? (
                <>
                  <div className="processing-dots" style={{ display: 'flex', gap: 3 }}>
                    <div className="dot" /><div className="dot" /><div className="dot" />
                  </div>
                  Searching
                </>
              ) : (
                <>
                  <SearchIcon size={14} />
                  Explore Network
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-box" style={{ marginTop: '1rem' }}>
              <AlertIcon /> {error}
            </div>
          )}
        </form>
      </div>

      {/* Results count */}
      {hasSearched && !loading && !error && (
        <div style={{ fontSize: '0.775rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>
          {results.length > 0
            ? `${results.length} document${results.length > 1 ? 's' : ''} found within province "${province}"`
            : null}
        </div>
      )}

      {/* Empty state */}
      {hasSearched && !loading && results.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">
            <SearchIcon size={48} />
          </div>
          <div className="empty-title">No documents found</div>
          <div className="empty-subtitle">
            No data matching your query within province "{province}". Try ingesting more documents first.
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="results-grid">
          {results.map((result, index) => {
            const conf = result.metadata?.disease_confidence ?? 0;
            return (
              <div
                key={index}
                className="card result-card"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                {/* Badges */}
                <div className="result-header">
                  <span className="badge badge-green">{result.metadata?.province}</span>
                  <span className="badge badge-purple">{result.metadata?.continent}</span>
                  {result.metadata?.disease && result.metadata.disease !== 'General / Unknown' && (
                    <span className="badge badge-amber">{result.metadata.disease}</span>
                  )}
                </div>

                {/* Raw text body */}
                <div className="result-body">{result.text}</div>

                {/* Disease confidence mini bar */}
                {conf > 0 && (
                  <div className="disease-row">
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                      Precision
                    </span>
                    <div className="disease-bar">
                      <div className="disease-bar-fill" style={{ width: `${Math.min(conf, 100)}%` }} />
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-green)', whiteSpace: 'nowrap' }}>
                      {conf}%
                    </span>
                  </div>
                )}

                {/* Footer */}
                <div className="result-footer">
                  <span className="result-lab">
                    <LabIcon />
                    {result.metadata?.laboratory}
                  </span>
                  <span className="result-confidence">High Confidence</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Exploration;
