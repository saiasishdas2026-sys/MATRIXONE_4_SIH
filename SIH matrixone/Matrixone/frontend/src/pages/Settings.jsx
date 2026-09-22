import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Database, 
  Save, 
  Check, 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Maximize2, 
  Minimize2, 
  Sparkles,
  Zap,
  Users,
  Shield,
  Lock,
  RefreshCw,
  Server,
  Building2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../utils/api';
import { ROLES, DEMO_USERS } from '../utils/permissions';

export const Settings = () => {
  const { theme, resolvedTheme, setTheme, density, setDensity, motion, setMotion, accent, setAccent } = useThemeStore();
  const { user } = useAuthStore();

  const [similarityThreshold, setSimilarityThreshold] = useState(0.85);
  const [nearDuplicateThreshold, setNearDuplicateThreshold] = useState(0.70);
  const [geminiApiKey, setGeminiApiKey] = useState('AIzaSy************************');
  const [embeddingModel, setEmbeddingModel] = useState('all-mpnet-base-v2');
  const [saved, setSaved] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [isSeeding, setIsSeeding] = useState(false);

  const isAdmin = user?.role === ROLES.ADMIN || user?.is_superuser;

  useEffect(() => {
    if (isAdmin) {
      apiClient.get('/auth/users').then(res => {
        if (res && res.users) {
          setUsersList(res.users);
        }
      }).catch(err => {
        console.warn('Unable to load users list:', err);
      });
    }
  }, [isAdmin]);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    toast.success('System configuration parameters saved successfully!');
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReSeedDB = async () => {
    setIsSeeding(true);
    try {
      await apiClient.post('/auth/seed');
      toast.success('Demonstration database and roles re-seeded successfully!');
      const res = await apiClient.get('/auth/users');
      if (res && res.users) setUsersList(res.users);
    } catch (err) {
      toast.error('Re-seed failed: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-seam-border">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-telemetry-cyan bg-telemetry-cyan/10 px-2 py-0.5 rounded border border-telemetry-cyan/20">
              ENTERPRISE CONFIGURATION // NODE SETTINGS
            </span>
            <span className="text-xs text-ink-muted">&bull; Clearance: {user?.clearanceLevel || 'LEVEL 1'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-ink-primary tracking-wide mt-1">
            System Parameters &amp; AI Engine Configuration
          </h1>
          <p className="text-xs text-ink-muted">
            Manage appearance themes, density, vector similarity cutoffs &amp; ERP sovereign governance policies.
          </p>
        </div>

        {saved && (
          <span className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-telemetry-emerald/10 text-telemetry-emerald border border-telemetry-emerald/25 font-bold shrink-0">
            <Check className="w-4 h-4" />
            <span>Parameters Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Appearance & UI Customization */}
        <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-xs space-y-6">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-seam-border">
            <Palette className="w-4 h-4 text-telemetry-cyan" />
            <h4 className="text-sm font-semibold text-ink-primary tracking-wide font-sans">
              APPEARANCE &amp; WORKSPACE CUSTOMIZATION
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Theme Mode Selector */}
            <div className="space-y-2.5">
              <label className="text-[11px] text-ink-muted uppercase block font-semibold tracking-wider">
                Color Theme
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition ${
                    theme === 'light'
                      ? 'border-telemetry-cyan bg-telemetry-cyan/10 text-telemetry-cyan font-bold'
                      : 'border-seam-border bg-surface-subtle text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition ${
                    theme === 'dark'
                      ? 'border-telemetry-cyan bg-telemetry-cyan/10 text-telemetry-cyan font-bold'
                      : 'border-seam-border bg-surface-subtle text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  <Moon className="w-4 h-4 text-telemetry-cyan" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition ${
                    theme === 'system'
                      ? 'border-telemetry-cyan bg-telemetry-cyan/10 text-telemetry-cyan font-bold'
                      : 'border-seam-border bg-surface-subtle text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-ink-muted" />
                  <span>System</span>
                </button>
              </div>
            </div>

            {/* Density */}
            <div className="space-y-2.5">
              <label className="text-[11px] text-ink-muted uppercase block font-semibold tracking-wider">
                Information Density
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDensity('comfortable')}
                  className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 transition ${
                    density === 'comfortable'
                      ? 'border-telemetry-cyan bg-telemetry-cyan/10 text-telemetry-cyan font-bold'
                      : 'border-seam-border bg-surface-subtle text-ink-secondary'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Comfortable</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDensity('compact')}
                  className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 transition ${
                    density === 'compact'
                      ? 'border-telemetry-cyan bg-telemetry-cyan/10 text-telemetry-cyan font-bold'
                      : 'border-seam-border bg-surface-subtle text-ink-secondary'
                  }`}
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Compact</span>
                </button>
              </div>
            </div>

            {/* Motion */}
            <div className="space-y-2.5">
              <label className="text-[11px] text-ink-muted uppercase block font-semibold tracking-wider">
                Interface Motion
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setMotion('full')}
                  className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 transition ${
                    motion === 'full'
                      ? 'border-telemetry-cyan bg-telemetry-cyan/10 text-telemetry-cyan font-bold'
                      : 'border-seam-border bg-surface-subtle text-ink-secondary'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-telemetry-cyan" />
                  <span>Enabled</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMotion('reduced')}
                  className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 transition ${
                    motion === 'reduced'
                      ? 'border-telemetry-cyan bg-telemetry-cyan/10 text-telemetry-cyan font-bold'
                      : 'border-seam-border bg-surface-subtle text-ink-secondary'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Reduced</span>
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-2.5">
              <label className="text-[11px] text-ink-muted uppercase block font-semibold tracking-wider">
                Accent Token
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['cyan', 'emerald', 'amber'].map((acc) => (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => setAccent(acc)}
                    className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 capitalize transition ${
                      accent === acc
                        ? 'border-telemetry-cyan bg-telemetry-cyan/10 text-telemetry-cyan font-bold'
                        : 'border-seam-border bg-surface-subtle text-ink-secondary'
                    }`}
                  >
                    <span>{acc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: AI Matching Engine Thresholds (Admin only) */}
        <div className={`p-6 rounded-xl bg-surface border border-seam-border shadow-xs space-y-4 ${!isAdmin ? 'opacity-70 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between pb-3 border-b border-seam-border">
            <div className="flex items-center space-x-2.5">
              <Sliders className="w-4 h-4 text-telemetry-cyan" />
              <h4 className="text-sm font-semibold text-ink-primary tracking-wide font-sans">
                AI MATCHING &amp; CLUSTERING THRESHOLDS
              </h4>
            </div>
            {!isAdmin && (
              <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" /> RESTRICTED TO ADMIN
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-primary font-medium">High Confidence / Auto-Mint Cutoff:</span>
                <span className="text-telemetry-cyan font-bold">{similarityThreshold}</span>
              </div>
              <input 
                type="range"
                min="0.75"
                max="0.99"
                step="0.01"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                className="w-full h-2 bg-surface-subtle border border-seam-border rounded-lg appearance-none cursor-pointer accent-telemetry-cyan"
              />
              <p className="text-[10px] text-ink-muted">
                Pairs above this composite score are flagged for sovereign auto-minting. Default: 0.85.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-primary font-medium">Borderline / HITL Review Cutoff:</span>
                <span className="text-telemetry-amber font-bold">{nearDuplicateThreshold}</span>
              </div>
              <input 
                type="range"
                min="0.50"
                max="0.80"
                step="0.01"
                value={nearDuplicateThreshold}
                onChange={(e) => setNearDuplicateThreshold(Number(e.target.value))}
                className="w-full h-2 bg-surface-subtle border border-seam-border rounded-lg appearance-none cursor-pointer accent-telemetry-amber"
              />
              <p className="text-[10px] text-ink-muted">
                Pairs between {nearDuplicateThreshold} and {similarityThreshold} are escalated to L2 HITL committee review.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Model & Vector Storage Configuration (Admin only) */}
        <div className={`p-6 rounded-xl bg-surface border border-seam-border shadow-xs space-y-4 ${!isAdmin ? 'opacity-70 pointer-events-none' : ''}`}>
          <div className="flex items-center space-x-2.5 pb-3 border-b border-seam-border">
            <Database className="w-4 h-4 text-telemetry-emerald" />
            <h4 className="text-sm font-semibold text-ink-primary tracking-wide font-sans">
              EMBEDDING MODELS &amp; VECTOR STORAGE
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-ink-muted uppercase block mb-1 font-semibold">Sentence-Transformers Model</label>
              <select
                value={embeddingModel}
                onChange={(e) => setEmbeddingModel(e.target.value)}
                className="w-full bg-surface-subtle border border-seam-border rounded-md p-2.5 text-xs text-ink-primary focus:outline-none focus:border-telemetry-cyan"
              >
                <option value="all-mpnet-base-v2">all-mpnet-base-v2 (768-dim, High Accuracy)</option>
                <option value="all-MiniLM-L6-v2">all-MiniLM-L6-v2 (384-dim, Ultra-Fast)</option>
                <option value="bharat-matvector-v3">bharat-matvector-v3 (Domain Fine-Tuned)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-ink-muted uppercase block mb-1 font-semibold">FastAPI Backend Origin</label>
              <input
                type="text"
                value="http://127.0.0.1:8000"
                readOnly
                className="w-full bg-surface-subtle border border-seam-border rounded-md p-2.5 text-xs text-ink-muted font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Registered Users & Database Utilities (Admin Only) */}
        {isAdmin && (
          <div className="p-6 rounded-xl bg-surface border border-seam-border shadow-xs space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-seam-border">
              <div className="flex items-center space-x-2.5 font-mono">
                <Users className="w-4 h-4 text-telemetry-cyan" />
                <h4 className="text-sm font-semibold text-ink-primary tracking-wide">
                  REGISTERED USERS &amp; DEMO SEED UTILITY
                </h4>
              </div>

              <button
                type="button"
                onClick={handleReSeedDB}
                disabled={isSeeding}
                className="py-1.5 px-3 rounded-lg bg-surface-subtle hover:bg-surface-active border border-seam-border text-ink-secondary hover:text-ink-primary text-xs font-mono flex items-center gap-1.5 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>Re-Seed 5 Demo Roles</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
              {DEMO_USERS.map(u => (
                <div key={u.email} className="p-3 rounded-xl bg-surface-subtle border border-seam-border space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-ink-primary">{u.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-seam-border text-telemetry-cyan font-semibold">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-muted">{u.email}</p>
                  <p className="text-[10px] text-ink-secondary">{u.org}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white font-bold text-xs transition shadow-sm flex items-center space-x-1.5 uppercase font-mono tracking-wider"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
