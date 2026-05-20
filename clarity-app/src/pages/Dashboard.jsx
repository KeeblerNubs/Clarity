import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { formatSize, getTypeColor, groupFilesByType } from '../utils/fileUtils';
import './Dashboard.css';

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ color, background: color + '18' }}>
        <i className={`ti ${icon}`} aria-hidden="true" />
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        <div className="stat-card-label">{label}</div>
        {sub && <div className="stat-card-sub">{sub}</div>}
      </div>
    </div>
  );
}

function ActivityItem({ icon, text, time, color }) {
  return (
    <div className="activity-item">
      <div className="activity-dot" style={{ background: color }} />
      <div className="activity-content">
        <span className="activity-text">{text}</span>
        <span className="activity-time">{time}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { files, stats, isScanning, scanStatus, scanProgress, addWatchedFolder, watchedFolders, setActivePage } = useStore();
  const [activity] = useState([
    { icon: 'ti-sparkles', text: 'AI labeled 48 vacation photos', time: '2m ago', color: '#4f8ef7' },
    { icon: 'ti-user-check', text: 'Recognized "Mom" in 12 new photos', time: '15m ago', color: '#a78bfa' },
    { icon: 'ti-copy', text: '3 duplicate sets found — review pending', time: '1h ago', color: '#fbbf24' },
    { icon: 'ti-check', text: 'Desktop scan complete — 2,341 files indexed', time: '2h ago', color: '#34d399' },
  ]);

  const grouped = groupFilesByType(files);
  const typeBreakdown = Object.entries(grouped).map(([type, files]) => ({
    type,
    count: files.length,
    size: files.reduce((s, f) => s + (f.size || 0), 0),
    color: getTypeColor(type),
  })).sort((a, b) => b.count - a.count);

  const totalSize = files.reduce((s, f) => s + (f.size || 0), 0);

  const handleAddFolder = async () => {
    if (!window.electronAPI) {
      alert('Folder picking works in the desktop app. In the browser preview, files are simulated.');
      return;
    }
    const folder = await window.electronAPI.selectFolder();
    if (folder) addWatchedFolder({ path: folder, name: folder.split(/[\\/]/).pop() });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-sub">Your digital world, organized</p>
        </div>
        <div className="dashboard-actions">
          {isScanning ? (
            <div className="scan-progress-pill">
              <div className="scan-spinner" />
              <span>{scanStatus || 'Scanning…'}</span>
              <strong>{Math.round(scanProgress)}%</strong>
            </div>
          ) : (
            <button className="btn-primary" onClick={handleAddFolder}>
              <i className="ti ti-folder-plus" aria-hidden="true" />
              Add folder
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid">
        <StatCard icon="ti-files" label="Total files" value={files.length.toLocaleString() || '—'} color="#4f8ef7" sub={formatSize(totalSize) || 'No files scanned yet'} />
        <StatCard icon="ti-copy" label="Duplicates found" value={stats.duplicates || '—'} color="#fbbf24" sub={stats.duplicates ? 'Tap to review' : 'Run a scan'} />
        <StatCard icon="ti-users" label="People recognized" value={stats.faces || '—'} color="#a78bfa" sub="Face AI active" />
        <StatCard icon="ti-tags" label="AI-tagged files" value={stats.tagged || '—'} color="#34d399" sub="Auto-labeled" />
      </div>

      <div className="dashboard-main">
        {/* File type breakdown */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">File breakdown</h2>
            <button className="link-btn" onClick={() => setActivePage('files')}>View all →</button>
          </div>
          {typeBreakdown.length === 0 ? (
            <div className="empty-state">
              <i className="ti ti-folder-open empty-state-icon" aria-hidden="true" />
              <p>No files scanned yet</p>
              <button className="btn-primary" onClick={handleAddFolder}>
                <i className="ti ti-plus" /> Add your first folder
              </button>
            </div>
          ) : (
            <div className="type-list">
              {typeBreakdown.map(({ type, count, size, color }) => {
                const pct = files.length > 0 ? (count / files.length) * 100 : 0;
                return (
                  <div key={type} className="type-row" onClick={() => setActivePage('files')}>
                    <div className="type-dot" style={{ background: color }} />
                    <span className="type-name">{type}</span>
                    <div className="type-bar-track">
                      <div className="type-bar-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className="type-count">{count.toLocaleString()}</span>
                    <span className="type-size">{formatSize(size)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="dashboard-right">
          {/* Watched folders */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="dashboard-card-title">Watched folders</h2>
              <button className="link-btn" onClick={handleAddFolder}>+ Add</button>
            </div>
            {watchedFolders.length === 0 ? (
              <div className="folder-empty">
                <p className="folder-empty-text">No folders added yet.<br/>Add folders to start organizing.</p>
              </div>
            ) : (
              <div className="folder-list">
                {watchedFolders.map(f => (
                  <div key={f.path} className="folder-item">
                    <i className="ti ti-folder" style={{ color: '#fbbf24' }} aria-hidden="true" />
                    <div className="folder-item-info">
                      <span className="folder-item-name">{f.name}</span>
                      <span className="folder-item-path">{f.path}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="dashboard-card-title">Recent activity</h2>
            </div>
            <div className="activity-list">
              {activity.map((item, i) => (
                <ActivityItem key={i} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
