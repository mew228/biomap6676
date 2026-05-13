import React, { useState } from 'react';
import IngestionForm from './components/IngestionForm';
import Exploration from './components/Exploration';
import NeuralNetworkBg from './components/NeuralNetworkBg';
import './index.css';

// SVG Icons
const UploadIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const SearchIcon = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CPUIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
    <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
    <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
);

const PAGE_META = {
  ingestion: { title: 'Data Ingestion Pipeline', subtitle: 'Paste & route raw clinical / genomic records' },
  exploration: { title: 'Data Exploration Engine', subtitle: 'Strictly scoped semantic search across provinces' },
};

function App() {
  const [activeTab, setActiveTab] = useState('ingestion');
  const meta = PAGE_META[activeTab];

  return (
    <div className="app-container">
      <NeuralNetworkBg />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">BM</div>
          <div className="brand-name">Bio<span>Map</span></div>
        </div>

        <div className="nav-section-label">Navigation</div>
        <nav className="nav-menu">
          <button
            id="nav-ingestion"
            className={`nav-item ${activeTab === 'ingestion' ? 'active' : ''}`}
            onClick={() => setActiveTab('ingestion')}
          >
            <UploadIcon />
            Ingestion
          </button>

          <button
            id="nav-exploration"
            className={`nav-item ${activeTab === 'exploration' ? 'active' : ''}`}
            onClick={() => setActiveTab('exploration')}
          >
            <SearchIcon />
            Exploration
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="engine-status">
            <div className="status-dot" />
            <span className="engine-status-text">Offline AI Active</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="page-title">{meta.title}</h1>
            <p className="page-subtitle">{meta.subtitle}</p>
          </div>
          <div className="topbar-badge">
            <CPUIcon /> NLI Engine
          </div>
        </header>

        <section className="content-area">
          {activeTab === 'ingestion' && <IngestionForm />}
          {activeTab === 'exploration' && <Exploration />}
        </section>
      </main>
    </div>
  );
}

export default App;
