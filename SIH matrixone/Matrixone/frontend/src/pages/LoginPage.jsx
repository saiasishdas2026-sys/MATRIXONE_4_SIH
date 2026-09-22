import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  Building2,
  FileCheck,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { DEMO_USERS, ROLE_METADATA } from '../utils/permissions';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('admin@matrixone.gov.in');
  const [password, setPassword] = useState('matrixone123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setFormError(res.error || 'Authentication rejected. Verify credentials.');
    }
  };

  const handleQuickDemoSelect = async (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setFormError('');
    const res = await login(demo.email, demo.password);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between text-ink-primary font-sans">
      {/* Top Banner */}
      <div className="bg-canvas-deep px-4 py-1.5 flex items-center justify-between text-[11px] font-mono border-b border-seam-border text-ink-muted">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-pulse"></span>
          <span className="text-telemetry-emerald font-semibold">BHARAT SOVEREIGN SECURE NODE // SSL 4096-BIT</span>
          <span className="hidden sm:inline text-ink-muted">|</span>
          <span className="hidden sm:inline">SMART INDIA HACKATHON 2026</span>
        </div>
        <Link to="/" className="text-telemetry-cyan hover:underline flex items-center gap-1">
          <span>&larr; Public Portal</span>
        </Link>
      </div>

      {/* Main Login Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Official Branding & Context */}
          <div className="lg:col-span-5 bg-surface border border-seam-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-telemetry-cyan/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-surface-subtle border border-seam-border flex items-center justify-center p-2 shadow-xs">
                  <img src="/logo.svg" alt="MATRIXONE" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-wider font-mono flex items-center">
                    MATRIX<span className="text-telemetry-cyan">ONE</span>
                  </h1>
                  <p className="text-[10px] text-ink-muted tracking-wide font-mono">
                    NATIONAL MATERIAL INTELLIGENCE
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-telemetry-cyan/10 text-telemetry-cyan border border-telemetry-cyan/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AUTHENTICATED ACCESS ONLY
                </span>

                <h2 className="text-xl sm:text-2xl font-bold text-ink-primary tracking-tight">
                  One Nation, One Material Code
                </h2>

                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  Unified sovereign platform for AI-driven standardization, de-duplication, and cross-CPSE procurement intelligence across India's Central Public Sector Enterprises.
                </p>
              </div>

              <div className="mt-8 space-y-3 font-mono text-xs text-ink-secondary">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-subtle border border-seam-border">
                  <Server className="w-4 h-4 text-telemetry-cyan shrink-0" />
                  <span>Central Federated Node: <strong>CPCL/MoPNG</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-subtle border border-seam-border">
                  <Building2 className="w-4 h-4 text-telemetry-emerald shrink-0" />
                  <span>Active CPSE Mesh: <strong>12 Sovereign Nodes</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-subtle border border-seam-border">
                  <FileCheck className="w-4 h-4 text-telemetry-amber shrink-0" />
                  <span>Security Protocol: <strong>JWT + SHA-256 Audit</strong></span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-seam-border text-[11px] text-ink-muted flex items-center justify-between font-mono">
              <span>SECURITY LEVEL: NIC-A1</span>
              <span>PORT: 8000 (FASTAPI)</span>
            </div>
          </div>

          {/* RIGHT: Login Form & Quick Role Switcher */}
          <div className="lg:col-span-7 bg-surface border border-seam-border rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-ink-primary">Sign in to your Sovereign Account</h3>
                <p className="text-xs text-ink-secondary mt-1">
                  Enter your credentials to access the CPSE material master network.
                </p>
              </div>

              {/* Error Banner */}
              {(formError || error) && (
                <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Authentication Error</p>
                    <p className="text-[11px] mt-0.5 opacity-90">{formError || error}</p>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5 font-mono">
                    OFFICIAL EMAIL / GOVT USER ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@cpse.gov.in"
                      required
                      className="w-full bg-surface-subtle border border-seam-border focus:border-telemetry-cyan focus:outline-none rounded-lg py-2 pl-9 pr-3 text-sm text-ink-primary placeholder-ink-muted font-sans transition shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5 font-mono">
                    SECURITY ACCESS KEY / PASSWORD
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-surface-subtle border border-seam-border focus:border-telemetry-cyan focus:outline-none rounded-lg py-2 pl-9 pr-10 text-sm text-ink-primary placeholder-ink-muted font-sans transition shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-ink-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-seam-border text-telemetry-cyan focus:ring-0"
                    />
                    <span>Remember sovereign credentials</span>
                  </label>
                  <span className="text-[11px] font-mono text-ink-muted">Default: matrixone123</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-lg bg-telemetry-cyan hover:bg-telemetry-cyan-bright disabled:opacity-50 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-sm font-mono mt-2"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>SIGN IN TO SOVEREIGN NODE</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Demo Role Switcher for Hackathon Judges */}
            <div className="mt-8 pt-6 border-t border-seam-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-telemetry-amber" />
                  EVALUATE ROLES (1-CLICK JUDGE LOGIN)
                </span>
                <span className="text-[10px] font-mono text-telemetry-cyan">SIH 2026 DEMO</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans">
                {DEMO_USERS.map((demo) => {
                  const meta = ROLE_METADATA[demo.role] || {};
                  const isSelected = email === demo.email;

                  return (
                    <button
                      key={demo.email}
                      type="button"
                      onClick={() => handleQuickDemoSelect(demo)}
                      className={`text-left p-2.5 rounded-lg border transition text-xs flex items-center justify-between group ${
                        isSelected 
                          ? 'border-telemetry-cyan bg-telemetry-cyan/5 shadow-xs' 
                          : 'border-seam-border bg-surface-subtle hover:border-telemetry-cyan/40 hover:bg-surface-active'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-ink-primary truncate">{demo.name.split(' ')[0]}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold border ${meta.badgeColor}`}>
                            {meta.shortLabel}
                          </span>
                        </div>
                        <p className="text-[10px] text-ink-muted font-mono truncate">{demo.orgCode} &bull; {demo.title}</p>
                      </div>
                      <KeyRound className="w-3.5 h-3.5 text-ink-muted group-hover:text-telemetry-cyan shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-seam-border text-center text-xs text-ink-muted font-mono">
        MATRIXONE &bull; Sovereign Material Harmonization Platform &bull; Smart India Hackathon 2026
      </div>
    </div>
  );
};
