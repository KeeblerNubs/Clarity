# Clarity — AI-Powered File Organizer

A Windows 11 desktop app to organize your digital clutter across your PC, external drives, and cloud storage using local AI.

---

## Prerequisites

- **Node.js 18+** — https://nodejs.org
- **Git** (optional)
- **Ollama** (already installed) — for AI labeling in Phase 2
- **Windows 11**

---

## Setup & Run

### 1. Install dependencies
```bash
cd clarity-app
npm install
```

### 2. Run in development mode
```bash
npm start
```
This starts the React dev server on port 3000 and launches Electron automatically.
The app opens as a native window with the custom dark UI.

### 3. Build for production (creates a .exe installer)
```bash
npm run build
```
The installer will be in the `dist/` folder.

---

## Project Structure

```
clarity-app/
├── electron/
│   ├── main.js          ← Electron main process (window, file system, IPC)
│   └── preload.js       ← Secure bridge between Electron and React
├── src/
│   ├── components/
│   │   ├── TitleBar.jsx  ← Custom window title bar + controls
│   │   └── Sidebar.jsx   ← Navigation sidebar
│   ├── pages/
│   │   ├── Dashboard.jsx    ← Home dashboard with stats
│   │   ├── FilesPage.jsx    ← Full file browser (grid + list)
│   │   ├── SourcesPage.jsx  ← Connect cloud + local sources
│   │   └── PlaceholderPage.jsx  ← People, Duplicates, etc.
│   ├── store/
│   │   └── useStore.js   ← Zustand global state
│   ├── utils/
│   │   └── fileUtils.js  ← File type helpers, sort/filter
│   ├── App.jsx           ← Root component + page router
│   └── index.css         ← Global dark theme CSS variables
└── package.json
```

---

## Phase Roadmap

### ✅ Phase 1 — App Shell (this build)
- Custom Electron window (dark mode, frameless, Windows 11)
- Sidebar navigation
- Dashboard with stats + activity feed
- File browser (grid + list view, search, filter by type, sort)
- Local folder scanning via Node.js fs
- Sources management page
- Zustand global state

### 🔜 Phase 2 — AI Integration
- Ollama + LLaVA for photo/video/document content recognition
- face-api.js for local face detection and grouping
- Person verification UI (verify once, remembered forever)
- Background AI scanning when PC is idle
- Google Drive + Google Photos OAuth
- OneDrive + Dropbox + iCloud connectors

### 🔜 Phase 3 — Duplicate Engine
- Cross-location duplicate detection (hash + perceptual hash for images)
- Visual review page (scroll through duplicate sets)
- Pre-selection of best copy (highest resolution/quality)
- Staging folder before deletion

---

## Key Design Decisions

| Choice | Reason |
|--------|--------|
| Electron + React | Native Windows app feel, full file system access, rich UI |
| Zustand | Simple, fast global state — no Redux boilerplate |
| Ollama (LLaVA) | Free, local, already installed — zero ongoing cost |
| face-api.js | Runs 100% locally, no API key, no privacy concerns |
| DM Sans font | Clean, modern, highly legible at small sizes |
