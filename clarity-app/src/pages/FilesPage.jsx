import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import {
  formatSize, formatDate, getFileType, getFileIcon,
  getTypeColor, sortFiles, filterFiles
} from '../utils/fileUtils';
import './FilesPage.css';

const TYPE_FILTERS = ['all', 'image', 'video', 'audio', 'document', 'code', 'archive', 'other'];

function FileCard({ file, selected, onSelect }) {
  const type = getFileType(file.ext);
  const color = getTypeColor(type);
  const icon = getFileIcon(type);
  const isImage = type === 'image';

  return (
    <div
      className={`file-card ${selected ? 'file-card--selected' : ''}`}
      onClick={() => onSelect(file.id)}
      title={file.path}
    >
      <div className="file-card-thumb" style={{ borderColor: selected ? color : 'transparent' }}>
        {isImage && file.thumbnail ? (
          <img src={file.thumbnail} alt={file.name} className="file-card-img" />
        ) : (
          <div className="file-card-icon-wrap" style={{ color, background: color + '16' }}>
            <i className={`ti ${icon}`} aria-hidden="true" />
          </div>
        )}
        {selected && (
          <div className="file-card-check">
            <i className="ti ti-check" />
          </div>
        )}
        {file.aiLabeled && (
          <div className="file-card-ai-badge">AI</div>
        )}
      </div>
      <div className="file-card-info">
        <span className="file-card-name" title={file.name}>{file.name}</span>
        <span className="file-card-meta">{formatSize(file.size)} · {formatDate(file.modified)}</span>
        {file.tags?.length > 0 && (
          <div className="file-card-tags">
            {file.tags.slice(0, 2).map(tag => (
              <span key={tag} className="file-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FileRow({ file, selected, onSelect }) {
  const type = getFileType(file.ext);
  const color = getTypeColor(type);
  const icon = getFileIcon(type);

  return (
    <div
      className={`file-row ${selected ? 'file-row--selected' : ''}`}
      onClick={() => onSelect(file.id)}
    >
      <div className="file-row-check">
        <div className={`file-row-checkbox ${selected ? 'file-row-checkbox--checked' : ''}`}>
          {selected && <i className="ti ti-check" />}
        </div>
      </div>
      <div className="file-row-icon" style={{ color, background: color + '14' }}>
        <i className={`ti ${icon}`} aria-hidden="true" />
      </div>
      <span className="file-row-name">{file.name}</span>
      <span className="file-row-type" style={{ color }}>{type}</span>
      <span className="file-row-size">{formatSize(file.size)}</span>
      <span className="file-row-date">{formatDate(file.modified)}</span>
      {file.tags?.length > 0 ? (
        <div className="file-row-tags">
          {file.tags.slice(0, 3).map(tag => (
            <span key={tag} className="file-tag">{tag}</span>
          ))}
        </div>
      ) : <div className="file-row-tags" />}
    </div>
  );
}

export default function FilesPage() {
  const {
    files, selectedFiles, toggleSelect, clearSelection,
    viewMode, setViewMode, sortBy, setSortBy,
    filterType, setFilterType, searchQuery, setSearchQuery,
    addWatchedFolder
  } = useStore();

  const displayed = useMemo(() => {
    const filtered = filterFiles(files, filterType, searchQuery);
    return sortFiles(filtered, sortBy);
  }, [files, filterType, searchQuery, sortBy]);

  const handleAddFolder = async () => {
    if (!window.electronAPI) return;
    const folder = await window.electronAPI.selectFolder();
    if (folder) addWatchedFolder({ path: folder, name: folder.split(/[\\/]/).pop() });
  };

  return (
    <div className="files-page">
      {/* Toolbar */}
      <div className="files-toolbar">
        <div className="files-search-wrap">
          <i className="ti ti-search files-search-icon" aria-hidden="true" />
          <input
            className="files-search"
            placeholder="Search files, tags, people…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="files-search-clear" onClick={() => setSearchQuery('')}>
              <i className="ti ti-x" />
            </button>
          )}
        </div>

        <div className="files-toolbar-right">
          {selectedFiles.length > 0 && (
            <div className="selection-bar">
              <span>{selectedFiles.length} selected</span>
              <button onClick={clearSelection}>Clear</button>
            </div>
          )}

          <select
            className="files-sort"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="modified">Sort: Recent</option>
            <option value="name">Sort: Name</option>
            <option value="size">Sort: Size</option>
            <option value="type">Sort: Type</option>
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'view-btn--active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <i className="ti ti-layout-grid" />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'view-btn--active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <i className="ti ti-list" />
            </button>
          </div>
        </div>
      </div>

      {/* Type filter chips */}
      <div className="type-chips">
        {TYPE_FILTERS.map(type => (
          <button
            key={type}
            className={`type-chip ${filterType === type ? 'type-chip--active' : ''}`}
            onClick={() => setFilterType(type)}
            style={filterType === type ? { color: getTypeColor(type), borderColor: getTypeColor(type) + '60', background: getTypeColor(type) + '14' } : {}}
          >
            {type === 'all' ? 'All types' : type}
            <span className="type-chip-count">
              {type === 'all' ? files.length : files.filter(f => getFileType(f.ext) === type).length}
            </span>
          </button>
        ))}
      </div>

      {/* File list */}
      <div className="files-content">
        {displayed.length === 0 ? (
          <div className="files-empty">
            {files.length === 0 ? (
              <>
                <i className="ti ti-folder-open files-empty-icon" aria-hidden="true" />
                <p>No files indexed yet</p>
                <p className="files-empty-sub">Add a folder from the Dashboard to get started</p>
                <button className="btn-primary" onClick={handleAddFolder}>
                  <i className="ti ti-folder-plus" /> Add folder
                </button>
              </>
            ) : (
              <>
                <i className="ti ti-search files-empty-icon" aria-hidden="true" />
                <p>No files match your search</p>
                <button className="btn-secondary" onClick={() => { setSearchQuery(''); setFilterType('all'); }}>
                  Clear filters
                </button>
              </>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="files-grid">
            {displayed.map(file => (
              <FileCard
                key={file.id}
                file={file}
                selected={selectedFiles.includes(file.id)}
                onSelect={toggleSelect}
              />
            ))}
          </div>
        ) : (
          <div className="files-list">
            <div className="files-list-header">
              <div className="file-row-check" />
              <div className="file-row-icon" />
              <span>Name</span>
              <span>Type</span>
              <span>Size</span>
              <span>Modified</span>
              <span>Tags</span>
            </div>
            {displayed.map(file => (
              <FileRow
                key={file.id}
                file={file}
                selected={selectedFiles.includes(file.id)}
                onSelect={toggleSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      {displayed.length > 0 && (
        <div className="files-statusbar">
          <span>{displayed.length.toLocaleString()} files</span>
          <span>·</span>
          <span>{formatSize(displayed.reduce((s, f) => s + (f.size || 0), 0))}</span>
          {selectedFiles.length > 0 && (
            <>
              <span>·</span>
              <span>{selectedFiles.length} selected</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
