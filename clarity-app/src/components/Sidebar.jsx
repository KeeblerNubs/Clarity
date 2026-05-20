import React from 'react';
import { useStore } from '../store/useStore';
import './Sidebar.css';

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { id: 'files', icon: 'ti-files', label: 'All Files' },
  { id: 'photos', icon: 'ti-photo', label: 'Photos' },
  { id: 'videos', icon: 'ti-movie', label: 'Videos' },
  { id: 'documents', icon: 'ti-file-text', label: 'Documents' },
  { id: 'people', icon: 'ti-users', label: 'People', badge: 'AI' },
  { id: 'duplicates', icon: 'ti-copy', label: 'Duplicates', badge: '!' },
];

const BOTTOM_ITEMS = [
  { id: 'sources', icon: 'ti-plug-connected', label: 'Sources' },
  { id: 'settings', icon: 'ti-settings', label: 'Settings' },
];

export default function Sidebar() {
  const { activePage, setActivePage, sources } = useStore();
  const connectedClouds = sources.filter(s => s.type === 'cloud' && s.connected);

  return (
    <aside className="sidebar">
      {/* Main navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Organize</div>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? 'sidebar-item--active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <i className={`ti ${item.icon} sidebar-icon`} aria-hidden="true" />
            <span className="sidebar-label">{item.label}</span>
            {item.badge && (
              <span className={`sidebar-badge ${item.badge === 'AI' ? 'sidebar-badge--ai' : 'sidebar-badge--alert'}`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Connected sources */}
      <div className="sidebar-sources">
        <div className="sidebar-section-label">
          Sources
          <button className="sidebar-add-btn" onClick={() => setActivePage('sources')} title="Manage sources">
            <i className="ti ti-plus" />
          </button>
        </div>
        {sources.map(source => (
          <button
            key={source.id}
            className={`sidebar-source ${!source.connected ? 'sidebar-source--disconnected' : ''}`}
            onClick={() => setActivePage('sources')}
          >
            <span className="sidebar-source-dot" style={{ background: source.connected ? source.color : 'var(--bg-4)' }} />
            <i className={`ti ti-${source.icon}`} style={{ color: source.connected ? source.color : 'var(--text-4)', fontSize: 14 }} aria-hidden="true" />
            <span className="sidebar-source-label">{source.label}</span>
            {!source.connected && <span className="sidebar-source-status">+</span>}
          </button>
        ))}
      </div>

      {/* Bottom */}
      <div className="sidebar-bottom">
        {BOTTOM_ITEMS.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? 'sidebar-item--active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <i className={`ti ${item.icon} sidebar-icon`} aria-hidden="true" />
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
