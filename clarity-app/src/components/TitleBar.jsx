import React from 'react';
import './TitleBar.css';

export default function TitleBar() {
  const isElectron = !!window.electronAPI;

  return (
    <div className="titlebar" style={{ WebkitAppRegion: 'drag' }}>
      <div className="titlebar-left">
        <div className="titlebar-logo">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="7" height="7" rx="2" fill="#4f8ef7"/>
            <rect x="10" y="1" width="7" height="7" rx="2" fill="#4f8ef7" opacity="0.5"/>
            <rect x="1" y="10" width="7" height="7" rx="2" fill="#4f8ef7" opacity="0.5"/>
            <rect x="10" y="10" width="7" height="7" rx="2" fill="#4f8ef7" opacity="0.3"/>
          </svg>
          <span className="titlebar-name">Clarity</span>
        </div>
      </div>

      <div className="titlebar-drag-area" />

      {isElectron && (
        <div className="titlebar-controls" style={{ WebkitAppRegion: 'no-drag' }}>
          <button
            className="titlebar-btn"
            onClick={() => window.electronAPI.minimize()}
            title="Minimize"
          >
            <i className="ti ti-minus" />
          </button>
          <button
            className="titlebar-btn"
            onClick={() => window.electronAPI.maximize()}
            title="Maximize"
          >
            <i className="ti ti-square" />
          </button>
          <button
            className="titlebar-btn titlebar-btn--close"
            onClick={() => window.electronAPI.close()}
            title="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
      )}
    </div>
  );
}
