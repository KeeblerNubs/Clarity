import React from 'react';
import './PlaceholderPage.css';

export function PeoplePage() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon-wrap purple">
        <i className="ti ti-users" aria-hidden="true" />
      </div>
      <h1>People</h1>
      <p>AI face recognition groups photos and videos by person.<br/>Once you run a scan, you can verify and name each person here.</p>
      <div className="placeholder-badge">Coming in Phase 2 — AI integration</div>
    </div>
  );
}

export function DuplicatesPage() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon-wrap amber">
        <i className="ti ti-copy" aria-hidden="true" />
      </div>
      <h1>Duplicates</h1>
      <p>Clarity will find duplicate files across all your locations and let you review them visually before deleting.</p>
      <div className="placeholder-badge">Coming in Phase 3 — Duplicate engine</div>
    </div>
  );
}

export function PhotosPage() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon-wrap blue">
        <i className="ti ti-photo" aria-hidden="true" />
      </div>
      <h1>Photos</h1>
      <p>All your photos from every location in one place, AI-labeled and sorted by date, location, or person.</p>
      <div className="placeholder-badge">Add folders on the Dashboard to populate this view</div>
    </div>
  );
}

export function VideosPage() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon-wrap purple">
        <i className="ti ti-movie" aria-hidden="true" />
      </div>
      <h1>Videos</h1>
      <p>All your video files, with AI-generated descriptions and face-recognition from footage.</p>
      <div className="placeholder-badge">Add folders on the Dashboard to populate this view</div>
    </div>
  );
}

export function DocumentsPage() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon-wrap amber">
        <i className="ti ti-file-text" aria-hidden="true" />
      </div>
      <h1>Documents</h1>
      <p>PDFs, Word docs, spreadsheets and more — AI-summarized and auto-tagged for easy search.</p>
      <div className="placeholder-badge">Add folders on the Dashboard to populate this view</div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon-wrap gray">
        <i className="ti ti-settings" aria-hidden="true" />
      </div>
      <h1>Settings</h1>
      <p>Configure AI models (Ollama/LM Studio), scan schedule, cloud API keys, and privacy options.</p>
      <div className="placeholder-badge">Coming in Phase 2</div>
    </div>
  );
}
