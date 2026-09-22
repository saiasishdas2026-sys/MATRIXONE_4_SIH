import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  Layers, 
  Zap, 
  CheckCircle2, 
  ChevronDown,
  Server,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  KeyRound,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useMaterialStore } from '../../store/materialStore';
import { useThemeStore } from '../../store/themeStore';
import { ROLE_METADATA, DEMO_USERS } from '../../utils/permissions';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, activeCPSEView, setActiveCPSEView, switchDemoRole } = useAuthStore();
  const { cpsePartners } = useMaterialStore();
  const { theme, resolvedTheme, setTheme } = useThemeStore();
  
  const [showCPSEDropdown, setShowCPSEDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cpseRef = useRef(null);
  const themeRef = useRef(null);
  const userRef = useRef(null);

  const isLanding = location.pathname === '/';

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (cpseRef.current && !cpseRef.current.contains(e.target)) {
        setShowCPSEDropdown(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setShowThemeDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const roleMeta = user ? (ROLE_METADATA[user.role] || ROLE_METADATA.viewer) : ROLE_METADATA.viewer;

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-seam-border transition-colors duration-200">
      {/* Top Sovereign Clearance Bar */}
      <div className="bg-canvas-deep px-4 sm:px-6 py-1 flex items-center justify-between text-[11px] border-b border-seam-border font-mono transition-colors">
        <div className="flex items-center space-x-3 overflow-x-auto py-0.5">
          <span className="flex items-center text-telemetry-emerald gap-1.5 font-semibold shrink-0">
            <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-pulse"></span>
            GOVT OF INDIA // BHARAT SOVEREIGN MESH
          </span>
          <span className="text-ink-muted shrink-0">|</span>
          <span className="text-ink-secondary shrink-0">SIH 2026 PS ID: 26099</span>
          <span className="text-ink-muted hidden md:inline shrink-0">|</span>
          <span className="text-ink-muted hidden md:inline shrink-0">MHI &amp; MoPNG CPSE FEDERATION</span>
        </div>

        <div className="flex items-center space-x-3 shrink-0 ml-3">
          {isAuthenticated && user ? (
            <>
              <div className="hidden sm:flex items-center space-x-1.5 text-ink-secondary">
                <Server className="w-3 h-3 text-telemetry-cyan" />
                <span>NODE: {user.activeNode || `${user.organization_code}_01`}</span>
              </div>
              <span className="text-ink-muted hidden sm:inline">|</span>
              <div className="flex items-center space-x-1 text-telemetry-amber font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-semibold">{user.clearanceLevel || 'LEVEL 1'}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 text-ink-muted">
              <span>PORTAL: PUBLIC EXPLORER</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Command Header */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* LEFT: Identity & Product Information */}
        <div className="flex items-center space-x-4 shrink-0">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg bg-surface-subtle border border-seam-border flex items-center justify-center p-1.5 shadow-xs transition group-hover:border-telemetry-cyan">
              <img src="/logo.svg" alt="MATRIXONE" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-bold tracking-wider text-ink-primary font-mono flex items-center">
                  MATRIX<span className="text-telemetry-cyan">ONE</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-telemetry-cyan/10 text-telemetry-cyan font-mono border border-telemetry-cyan/25 font-semibold">
                  v1.0.0 SOVEREIGN
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-ink-muted tracking-tight hidden sm:block font-mono">
                One Nation, One Material Code &bull; National Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* CENTER: Search or Public Nav */}
        {!isLanding && isAuthenticated ? (
          <div className="flex-1 max-w-2xl mx-2 lg:mx-4 flex items-center space-x-3">
            {/* Active CPSE Sync Pill */}
            <div className="hidden xl:flex items-center space-x-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-seam-border text-xs font-mono shrink-0 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-telemetry-emerald animate-ping"></span>
              <span className="text-ink-secondary ml-1 font-medium">FEDERATION:</span>
              <span className="text-telemetry-emerald font-semibold">12/12 CPSEs</span>
              <span className="text-ink-muted text-[10px]">(12ms)</span>
            </div>

            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search materials, valve/pump specs, or CNMC codes (Press Enter)..."
                className="w-full bg-surface-subtle border border-seam-border focus:border-telemetry-cyan focus:outline-none rounded-md py-1.5 pl-9 pr-14 text-xs sm:text-sm text-ink-primary placeholder-ink-muted transition font-sans shadow-xs"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface text-ink-muted rounded border border-seam-border">
                  ↵
                </kbd>
              </div>
            </div>
          </div>
        ) : (
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-medium text-ink-secondary">
            <a href="#mission" className="hover:text-telemetry-cyan transition">Mission</a>
            <a href="#problem" className="hover:text-telemetry-cyan transition">Problem</a>
            <a href="#workflow" className="hover:text-telemetry-cyan transition">Workflow</a>
            <Link to="/matching" className="hover:text-telemetry-cyan transition">AI Matching</Link>
            <Link to="/cnmc" className="hover:text-telemetry-cyan transition">National Master</Link>
            <a href="#network" className="hover:text-telemetry-cyan transition">CPSE Network</a>
          </nav>
        )}

        {/* RIGHT: CPSE Selector, Theme Toggle, User Profile & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          
          {isAuthenticated && (
            <>
              {/* CPSE Context Switcher */}
              <div className="relative" ref={cpseRef}>
                <button 
                  onClick={() => setShowCPSEDropdown(!showCPSEDropdown)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md bg-surface-subtle border border-seam-border hover:border-telemetry-cyan/40 text-xs font-mono text-ink-secondary transition shadow-xs h-8"
                  title="Select CPSE Tenant / Federation View"
                >
                  <Layers className="w-3.5 h-3.5 text-telemetry-cyan" />
                  <span className="hidden sm:inline">VIEW:</span>
                  <strong className="text-ink-primary truncate max-w-[85px] sm:max-w-none">{activeCPSEView}</strong>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
                </button>

                {showCPSEDropdown && (
                  <div className="absolute right-0 mt-1.5 w-64 rounded-md bg-surface border border-seam-border shadow-xl py-1 z-50 font-mono text-xs animate-in fade-in">
                    <div className="px-3 py-1.5 text-[10px] text-ink-muted border-b border-seam-border font-semibold uppercase tracking-wider">
                      Select Federation View
                    </div>
                    <button 
                      onClick={() => { setActiveCPSEView('NATIONAL_FEDERATION'); setShowCPSEDropdown(false); }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-surface-active transition ${activeCPSEView === 'NATIONAL_FEDERATION' ? 'text-telemetry-cyan font-bold bg-surface-subtle' : 'text-ink-secondary'}`}
                    >
                      <span>ALL CPSEs (NATIONAL MESH)</span>
                      {activeCPSEView === 'NATIONAL_FEDERATION' && <CheckCircle2 className="w-3.5 h-3.5 text-telemetry-cyan" />}
                    </button>
                    {cpsePartners.map((p) => (
                      <button 
                        key={p.id}
                        onClick={() => { setActiveCPSEView(p.id); setShowCPSEDropdown(false); }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-surface-active transition ${activeCPSEView === p.id ? 'text-telemetry-cyan font-bold bg-surface-subtle' : 'text-ink-secondary'}`}
                      >
                        <span>{p.id} ({p.name.split(' ')[0]})</span>
                        <span className="text-[10px] text-telemetry-emerald font-semibold">{p.latency}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick AI Match Button */}
              <Link 
                to="/matching"
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white font-semibold text-xs tracking-wide transition shadow-xs h-8"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>AI MATCH</span>
              </Link>
            </>
          )}

          {/* Theme Toggle */}
          <div className="relative" ref={themeRef}>
            <button 
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className="p-1.5 sm:px-2 sm:py-1.5 rounded-md bg-surface-subtle border border-seam-border hover:border-telemetry-cyan/40 text-ink-secondary transition shadow-xs h-8 flex items-center gap-1.5"
              title={`Theme: ${theme.toUpperCase()}`}
            >
              {theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : theme === 'dark' ? (
                <Moon className="w-4 h-4 text-telemetry-cyan" />
              ) : (
                <Monitor className="w-4 h-4 text-ink-muted" />
              )}
            </button>

            {showThemeDropdown && (
              <div className="absolute right-0 mt-1.5 w-32 rounded-md bg-surface border border-seam-border shadow-xl py-1 z-50 font-mono text-xs">
                <button
                  onClick={() => { setTheme('light'); setShowThemeDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-surface-active text-ink-secondary"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => { setTheme('dark'); setShowThemeDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-surface-active text-ink-secondary"
                >
                  <Moon className="w-3.5 h-3.5 text-telemetry-cyan" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => { setTheme('system'); setShowThemeDropdown(false); }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-surface-active text-ink-secondary"
                >
                  <Monitor className="w-3.5 h-3.5 text-ink-muted" />
                  <span>System</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile / Login Button */}
          {isAuthenticated && user ? (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center space-x-2 pl-2 sm:pl-2.5 border-l border-seam-border group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-surface-active border border-seam-border flex items-center justify-center font-mono text-xs font-bold text-telemetry-cyan group-hover:border-telemetry-cyan transition shadow-xs">
                  {user.avatar || 'MO'}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-ink-primary leading-tight truncate max-w-[120px]">{user.name}</p>
                    <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold uppercase border ${roleMeta.badgeColor}`}>
                      {roleMeta.shortLabel}
                    </span>
                  </div>
                  <p className="text-[10px] text-ink-muted font-mono truncate max-w-[140px]">{user.organization_code || 'CPSE'} &bull; {user.designation}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
              </button>

              {/* User Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-surface border border-seam-border shadow-2xl py-2 z-50 font-sans text-xs animate-in fade-in">
                  <div className="px-4 py-3 border-b border-seam-border">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-ink-primary">{user.name}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border ${roleMeta.badgeColor}`}>
                        {roleMeta.shortLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted font-mono mt-0.5">{user.email}</p>
                    <p className="text-[11px] text-telemetry-cyan font-mono mt-1 font-semibold">{user.department || user.organization_name}</p>
                  </div>

                  {/* 1-Click Role Switcher for Hackathon Judges */}
                  <div className="px-3 py-2 border-b border-seam-border bg-surface-subtle/50">
                    <div className="text-[10px] font-mono font-bold uppercase text-ink-muted mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-telemetry-amber" />
                      Switch Role (Judge Demo):
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {DEMO_USERS.map((demo) => (
                        <button
                          key={demo.email}
                          onClick={() => { switchDemoRole(demo.email); setShowUserDropdown(false); }}
                          className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition ${
                            user.email === demo.email 
                              ? 'bg-telemetry-cyan/15 text-telemetry-cyan font-bold' 
                              : 'hover:bg-surface-active text-ink-secondary'
                          }`}
                        >
                          <span className="font-mono">{demo.name.split(' ')[0]} ({demo.role})</span>
                          <span className="text-[9px] font-mono text-ink-muted">{demo.orgCode}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/settings"
                      onClick={() => setShowUserDropdown(false)}
                      className="w-full px-4 py-2 text-left hover:bg-surface-active flex items-center gap-2 text-ink-secondary hover:text-ink-primary transition"
                    >
                      <User className="w-3.5 h-3.5 text-ink-muted" />
                      <span>Account &amp; Sovereign Node Settings</span>
                    </Link>

                    <button
                      onClick={() => { logout(); setShowUserDropdown(false); navigate('/login'); }}
                      className="w-full px-4 py-2 text-left hover:bg-red-500/10 text-red-500 flex items-center gap-2 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out from Sovereign Node</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="py-1.5 px-3 rounded-lg bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs font-mono"
            >
              <span>SIGN IN</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}

        </div>
      </div>
    </header>
  );
};
