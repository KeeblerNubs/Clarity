import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // ── Navigation ────────────────────────────────────────────────────────────
  activePage: 'dashboard',
  setActivePage: (page) => set({ activePage: page }),

  // ── Source locations ──────────────────────────────────────────────────────
  sources: [
    { id: 'local', label: 'This PC', icon: 'desktop', type: 'local', connected: true, color: '#4f8ef7' },
    { id: 'google-drive', label: 'Google Drive', icon: 'brand-google-drive', type: 'cloud', connected: false, color: '#34a853' },
    { id: 'google-photos', label: 'Google Photos', icon: 'photo', type: 'cloud', connected: false, color: '#ea4335' },
    { id: 'onedrive', label: 'OneDrive', icon: 'brand-onedrive', type: 'cloud', connected: false, color: '#0078d4' },
    { id: 'dropbox', label: 'Dropbox', icon: 'brand-dropbox', type: 'cloud', connected: false, color: '#0061ff' },
    { id: 'icloud', label: 'iCloud', icon: 'cloud', type: 'cloud', connected: false, color: '#aaaaaa' },
  ],
  activeSource: 'local',
  setActiveSource: (id) => set({ activeSource: id }),
  connectSource: (id) => set((state) => ({
    sources: state.sources.map(s => s.id === id ? { ...s, connected: true } : s)
  })),

  // ── Watched folders ───────────────────────────────────────────────────────
  watchedFolders: [],
  addWatchedFolder: (folder) => set((state) => ({
    watchedFolders: [...state.watchedFolders, folder]
  })),
  removeWatchedFolder: (path) => set((state) => ({
    watchedFolders: state.watchedFolders.filter(f => f.path !== path)
  })),

  // ── Scanned files ─────────────────────────────────────────────────────────
  files: [],
  setFiles: (files) => set({ files }),
  appendFiles: (newFiles) => set((state) => ({
    files: [...state.files, ...newFiles.filter(
      nf => !state.files.some(f => f.path === nf.path)
    )]
  })),

  // ── Scanning state ────────────────────────────────────────────────────────
  isScanning: false,
  scanProgress: 0,
  scanStatus: '',
  setScanState: (scanning, progress = 0, status = '') =>
    set({ isScanning: scanning, scanProgress: progress, scanStatus: status }),

  // ── Selected files ────────────────────────────────────────────────────────
  selectedFiles: [],
  toggleSelect: (id) => set((state) => ({
    selectedFiles: state.selectedFiles.includes(id)
      ? state.selectedFiles.filter(i => i !== id)
      : [...state.selectedFiles, id]
  })),
  clearSelection: () => set({ selectedFiles: [] }),

  // ── View ──────────────────────────────────────────────────────────────────
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
  sortBy: 'modified',
  setSortBy: (sort) => set({ sortBy: sort }),
  filterType: 'all',
  setFilterType: (type) => set({ filterType: type }),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),

  // ── AI tasks ──────────────────────────────────────────────────────────────
  aiTasks: [],
  addAiTask: (task) => set((state) => ({ aiTasks: [task, ...state.aiTasks] })),
  updateAiTask: (id, updates) => set((state) => ({
    aiTasks: state.aiTasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  // ── Stats ─────────────────────────────────────────────────────────────────
  stats: {
    totalFiles: 0,
    totalSize: 0,
    duplicates: 0,
    tagged: 0,
    faces: 0,
  },
  setStats: (stats) => set({ stats }),
}));
