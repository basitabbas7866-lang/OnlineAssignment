# Academic Deliverables & Coursework Workspace

A modern, responsive React + Vite web application for tracking academic assignments, priority deadlines, workload analytics, and schedules with multiple viewing modes (List, Kanban, Calendar).

---

## 🚀 How to Run (Step-by-Step)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or newer recommended).

---

### Step 1: Open Terminal in the Project Folder
Open your terminal (PowerShell, Command Prompt, or VS Code terminal) in the project directory:
```bash
cd Frontend
```

---

### Step 2: Install Dependencies (If needed)
If you haven't installed dependencies yet (or after cloning/downloading):
```bash
npm install
```

---

### Step 3: Start the Development Server
Run:
```bash
npm run dev
```

You will see output similar to:
```text
  VITE v8.3.1  ready in ~350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

### Step 4: Open in Your Browser
Open your web browser (Chrome, Edge, Firefox, Brave, etc.) and go to:
```
http://localhost:5173/
```

---

## 🛠️ Other Helpful Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local dev server with Hot Module Replacement (HMR) |
| `npm run build` | Builds the optimized production bundle in `dist/` |
| `npm run preview` | Runs a local web server to preview the production build |
| `npm run lint` | Runs `oxlint` to check code health (currently 0 errors, 0 warnings) |

---

## ⌨️ Keyboard Shortcuts
- **`/`** : Focus assignment search box
- **`N`** : Open "Add New Assignment" dialog
- **`Esc`** : Close active modal

---

## 💡 Main Features
- **Dashboard:** At-a-glance metrics, overdue banners, progress bars, and recent activity.
- **Assignments Workspace:**
  - **List View:** Search, filter by subject, status, or priority, and sort.
  - **Kanban Board:** Drag/move tasks between Pending, In Progress, and Completed.
  - **Calendar View:** Monthly deadline visualization with date-specific task inspector.
- **Analytics:** Workload hours per subject, priority distribution, and velocity.
- **Settings & Themes:** Light / Dark theme toggles with persistent local storage.
- **Data Export & Import:** Backup your data to JSON/CSV or reset to demo deliverables at any time.
