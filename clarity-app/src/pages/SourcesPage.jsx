import React from 'react';
import { useStore } from '../store/useStore';
import './SourcesPage.css';

function SourceCard({ source, onConnect }) {
  return (
    <div className={`source-card ${source.connected ? 'source-card--connected' : ''}`}>
      <div className="source-card-icon" style={{ color: source.color, background: source.color + '18' }}>
        <i className={`ti ti-${source.icon}`} aria-hidden="true" />
      </div>
      <div className="source-card-body">
        <div className="source-card-name">{source.label}</div>
        <div className="source-card-type">{source.type === 'cloud' ? 'Cloud storage' : 'Local'}</div>
      </div>
      <div className="source-card-action">
        {source.connected ? (
          <div className="source-connected-badge">
            <i className="ti ti-check" />
            Connected
          </div>
        ) : (
          <button className="source-connect-btn" onClick={() => onConnect(source.id)}>
            <i className="ti ti-plug-connected" />
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

export default function SourcesPage() {
  const { sources, connectSource, addWatchedFolder, watchedFolders, removeWatchedFolder } = useStore();
  const [oauthMessage, setOauthMessage] = React.useState('');

  const handleAddFolder = async () => {
    if (!window.electronAPI) {
      alert('Folder picking requires the desktop app.');
      return;
    }
    const folder = await window.electronAPI.selectFolder();
    if (folder) addWatchedFolder({ path: folder, name: folder.split(/[\\/]/).pop() });
  };

  const handleConnect = async (id) => {
    if (id === 'google-drive' || id === 'google-photos') {
      if (!window.electronAPI?.startGoogleOAuth) {
        setOauthMessage('Cloud OAuth requires the Electron desktop runtime.');
        return;
      }

      const result = await window.electronAPI.startGoogleOAuth(id);
      setOauthMessage(result.message || 'Google OAuth response received.');

      if (result.success) {
        connectSource(id);
      }
      return;
    }

    connectSource(id);
  };

  const cloudSources = sources.filter(s => s.type === 'cloud');

  return (
    <div className="sources-page">
      <div className="sources-header">
        <h1 className="sources-title">Storage sources</h1>
        <p className="sources-sub">Connect all your storage locations so Clarity can find and organize files across everything.</p>
      </div>

      {/* Local folders */}
      <section className="sources-section">
        <div className="sources-section-header">
          <div>
            <h2 className="sources-section-title">Local folders</h2>
            <p className="sources-section-desc">Folders on this PC, external drives, and USB drives</p>
          </div>
          <button className="btn-primary" onClick={handleAddFolder}>
            <i className="ti ti-folder-plus" /> Add folder
          </button>
        </div>

        {watchedFolders.length === 0 ? (
          <div className="sources-empty">
            <i className="ti ti-folder-open" aria-hidden="true" />
            <p>No local folders added yet</p>
          </div>
        ) : (
          <div className="watched-list">
            {watchedFolders.map(folder => (
              <div key={folder.path} className="watched-item">
                <div className="watched-item-icon">
                  <i className="ti ti-folder" style={{ color: '#fbbf24' }} />
                </div>
                <div className="watched-item-info">
                  <span className="watched-item-name">{folder.name}</span>
                  <span className="watched-item-path">{folder.path}</span>
                </div>
                <div className="watched-item-status">
                  <span className="status-dot status-dot--green" />
                  <span>Watching</span>
                </div>
                <button
                  className="watched-item-remove"
                  onClick={() => removeWatchedFolder(folder.path)}
                  title="Remove folder"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cloud storage */}
      <section className="sources-section">
        <div className="sources-section-header">
          <div>
            <h2 className="sources-section-title">Cloud storage</h2>
            <p className="sources-section-desc">Connect cloud accounts to find and consolidate files across all locations</p>
          </div>
        </div>

        <div className="source-cards">
          {cloudSources.map(source => (
            <SourceCard key={source.id} source={source} onConnect={handleConnect} />
          ))}
        </div>
        {oauthMessage ? <p className="sources-section-desc" style={{ marginTop: 12 }}>{oauthMessage}</p> : null}
      </section>

      {/* Info banner */}
      <div className="sources-info-banner">
        <i className="ti ti-info-circle" aria-hidden="true" />
        <div>
          <strong>Your files never leave your computer.</strong> Clarity only reads file metadata and previews to build your index. No files are uploaded anywhere without your explicit action.
        </div>
      </div>
    </div>
  );
}
