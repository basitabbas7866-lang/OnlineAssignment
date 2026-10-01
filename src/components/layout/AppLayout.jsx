import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './AppLayout.css';

export function AppLayout({ children, currentNav, onNavChange, pendingCount }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        currentNav={currentNav}
        onNavChange={onNavChange}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        pendingCount={pendingCount}
      />

      <div className="app-main-wrapper">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="app-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
