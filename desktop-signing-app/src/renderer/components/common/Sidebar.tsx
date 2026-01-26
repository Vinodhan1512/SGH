/**
 * SecureSign Pro - Sidebar Component
 */

import React from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: 'pdf' | 'settings' | 'audit' | 'license' | 'keys') => void;
  onOpenFile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  onOpenFile,
}) => {
  const menuItems = [
    { id: 'pdf', label: 'Document', icon: '📄' },
    { id: 'keys', label: 'Keys', icon: '🔑' },
    { id: 'audit', label: 'Audit Log', icon: '📋' },
    { id: 'license', label: 'License', icon: '📜' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ] as const;

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <button className="btn btn-primary sidebar-action" onClick={onOpenFile}>
          <span className="btn-icon">📂</span>
          Open PDF
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="version-text">v1.0.0</p>
      </div>
    </aside>
  );
};
