import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ROLE_METADATA, DEMO_USERS } from '../../utils/permissions';

export const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const location = useLocation();
  const { isAuthenticated, user, hasPerm, canAccess, switchDemoRole } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isPermitted = requiredPermission 
    ? hasPerm(requiredPermission) 
    : canAccess(location.pathname);

  if (!isPermitted) {
    const meta = ROLE_METADATA[user.role] || {};

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-surface border border-red-500/30 rounded-xl p-8 shadow-xl text-center font-sans space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/30 rounded-full">
              CLEARANCE RESTRICTED // 403 FORBIDDEN
            </span>
            <h2 className="text-xl font-bold text-ink-primary">
              Access Restricted for Current Role
            </h2>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Your active session as <strong className="text-ink-primary font-mono">{user.name}</strong> ({meta.label || user.role}) does not have administrative clearance to access <code className="text-telemetry-cyan font-mono bg-surface-subtle px-1.5 py-0.5 rounded">{location.pathname}</code>.
            </p>
          </div>

          <div className="bg-surface-subtle p-4 rounded-lg border border-seam-border text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between text-ink-muted">
              <span>Required Role:</span>
              <span className="text-telemetry-amber font-semibold">SUPER ADMIN / MINISTRY</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Current Clearance:</span>
              <span className="text-ink-primary">{user.clearanceLevel || 'LEVEL 1'}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Enterprise Node:</span>
              <span className="text-ink-primary">{user.organization_code || 'CPSE'}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/dashboard"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-surface-active hover:bg-surface-subtle border border-seam-border text-xs font-semibold text-ink-primary transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to My Dashboard</span>
            </Link>

            {/* Fast Hackathon Switcher */}
            <div className="pt-4 border-t border-seam-border">
              <p className="text-[11px] text-ink-muted mb-2.5 font-mono">
                [SIH DEMO MODE] Switch to Super Admin role to test this page:
              </p>
              <button
                onClick={() => switchDemoRole('admin@matrixone.gov.in')}
                className="w-full py-2 px-3 rounded-lg bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Switch to Ministry Super Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
