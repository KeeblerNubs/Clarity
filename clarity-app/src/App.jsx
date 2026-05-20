import React, { useEffect } from 'react';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import FilesPage from './pages/FilesPage';
import SourcesPage from './pages/SourcesPage';
import {
  PeoplePage, DuplicatesPage, PhotosPage,
  VideosPage, DocumentsPage, SettingsPage
} from './pages/PlaceholderPage';
import { useStore } from './store/useStore';
import './App.css';

function PageRouter({ page }) {
  switch (page) {
    case 'dashboard': return <Dashboard />;
    case 'files': return <FilesPage />;
    case 'photos': return <PhotosPage />;
    case 'videos': return <VideosPage />;
    case 'documents': return <DocumentsPage />;
    case 'people': return <PeoplePage />;
    case 'duplicates': return <DuplicatesPage />;
    case 'sources': return <SourcesPage />;
    case 'settings': return <SettingsPage />;
    default: return <Dashboard />;
  }
}

export default function App() {
  const { activePage, appendFiles, setScanState, setStats, watchedFolders } = useStore();

  // Scan watched folders whenever they change
  useEffect(() => {
    if (!window.electronAPI || watchedFolders.length === 0) return;

    const scanAll = async () => {
      setScanState(true, 0, 'Starting scan…');
      let allFiles = [];
      for (let i = 0; i < watchedFolders.length; i++) {
        const folder = watchedFolders[i];
        setScanState(true, Math.round((i / watchedFolders.length) * 80), `Scanning ${folder.name}…`);
        const result = await window.electronAPI.scanDirectory(folder.path);
        if (result.success) allFiles = [...allFiles, ...result.files];
      }
      appendFiles(allFiles);
      setScanState(true, 95, 'Building index…');
      await new Promise(r => setTimeout(r, 400));
      setScanState(false, 100, 'Scan complete');
      setStats({
        totalFiles: allFiles.length,
        totalSize: allFiles.reduce((s, f) => s + (f.size || 0), 0),
        duplicates: 0,
        tagged: 0,
        faces: 0,
      });
    };

    scanAll();
  }, [watchedFolders.length]);

  return (
    <div className="app">
      <TitleBar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <PageRouter page={activePage} />
        </main>
      </div>
    </div>
  );
}
