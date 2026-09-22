import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  FileCode2, 
  BarChart3, 
  History, 
  Bot, 
  UploadCloud, 
  Settings, 
  CheckSquare, 
  Home,
  ChevronLeft,
  ChevronRight,
  Shield,
  Radio,
  Search,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROLE_METADATA } from '../../utils/permissions';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, canAccess } = useAuthStore();

  const allNavigationSections = [
    {
      title: 'OPERATIONS',
      items: [
        { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard, badge: 'LIVE', route: '/dashboard' },
        { to: '/search', label: 'Material Search', icon: Search, badge: '1.25M', route: '/search' },
        { to: '/ingestion', label: 'Data Ingestion', icon: UploadCloud, badge: '12 CPSEs', route: '/ingestion' },
        { to: '/matching', label: 'AI Matching Studio', icon: Cpu, badge: 'TRI-MODAL', route: '/matching' },
        { to: '/workflow', label: 'Review Queue', icon: CheckSquare, badge: 'HITL', route: '/workflow' },
      ]
    },
    {
      title: 'GOVERNANCE & MASTER',
      items: [
        { to: '/cnmc', label: 'National Code Gen', icon: FileCode2, route: '/cnmc' },
        { to: '/analytics', label: 'Savings Analytics', icon: BarChart3, badge: '₹4.8k Cr', route: '/analytics' },
        { to: '/audit', label: 'Sovereign Audit', icon: History, badge: 'SHA-256', route: '/audit' },
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { to: '/chat', label: 'MatrixAI Copilot', icon: Bot, route: '/chat' },
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { to: '/settings', label: 'System & Config', icon: Settings, route: '/settings' },
      ]
    }
  ];

  // Filter sections and items based on active role permissions
  const filteredSections = allNavigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccess(item.route)),
    }))
    .filter((section) => section.items.length > 0);

  const roleMeta = user ? (ROLE_METADATA[user.role] || ROLE_METADATA.viewer) : ROLE_METADATA.viewer;

  return (
    <aside 
      className={`relative border-r border-seam-border bg-surface flex flex-col justify-between transition-all duration-300 z-40 shadow-xs select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Section */}
      <div className="py-4 overflow-y-auto">
        {/* Collapse Toggle Button */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-5 w-6 h-6 rounded-full bg-surface border border-seam-border flex items-center justify-center text-ink-muted hover:text-telemetry-cyan hover:border-telemetry-cyan transition shadow-md z-50"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Operational Status Header */}
        <div className="px-4 mb-3">
          {!collapsed ? (
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-ink-muted">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-telemetry-cyan" />
                CLEARANCE DECK
              </span>
              <span className="text-telemetry-emerald flex items-center gap-1 font-semibold">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                ONLINE
              </span>
            </div>
          ) : (
            <div className="flex justify-center text-telemetry-emerald">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
            </div>
          )}
        </div>

        {/* Grouped Navigation Links */}
        <nav className="space-y-4 px-3">
          {filteredSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <div className="px-2.5 pt-2 pb-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-ink-muted">
                  {section.title}
                </div>
              )}
              {collapsed && <div className="border-t border-seam-border my-2 mx-1" />}

              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group relative
                      ${isActive 
                        ? 'bg-surface-active text-telemetry-cyan font-semibold shadow-xs border-l-2 border-telemetry-cyan' 
                        : 'text-ink-secondary hover:bg-surface-subtle hover:text-ink-primary'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className="w-4 h-4 text-ink-muted group-hover:text-telemetry-cyan transition shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-surface-subtle border border-seam-border text-ink-muted group-hover:border-telemetry-cyan/30 group-hover:text-telemetry-cyan transition shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom User Role Clearance Card */}
      {user && (
        <div className="p-3 border-t border-seam-border bg-surface-subtle/50 font-sans">
          {!collapsed ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase border ${roleMeta.badgeColor}`}>
                  {roleMeta.shortLabel}
                </span>
                <span className="text-[10px] font-mono text-telemetry-cyan font-semibold">
                  {user.organization_code || 'CPCL'}
                </span>
              </div>
              <p className="text-xs font-bold text-ink-primary truncate">{user.name}</p>
              <p className="text-[10px] text-ink-muted font-mono truncate">{user.designation}</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-7 h-7 rounded-md bg-surface-active border border-seam-border flex items-center justify-center font-mono text-xs font-bold text-telemetry-cyan">
                {user.avatar || 'MO'}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
