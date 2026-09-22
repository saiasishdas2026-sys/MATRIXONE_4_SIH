import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  Brain, Database, CheckCircle2, TrendingUp,
  Layers, Clock, Zap,
  UploadCloud, FileCode2, ChevronRight, Check, X,
  ShieldCheck, AlertTriangle, Cpu, Radio, Sparkles, Filter,
  ArrowRight, Building2, UserCheck
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../utils/api';
import { ROLE_METADATA, ROLES } from '../utils/permissions';

const COLORS = {
  identical: '#ef4444',
  nearDuplicate: '#f59e0b',
  functional: '#eab308',
  unique: '#10b981',
  blue: '#0284c7',
  cyan: '#06b6d4',
  purple: '#8b5cf6'
};

const FALLBACK_STATS = {
  total_cataloged: 1248590,
  duplicate_ratio: 33.0,
  cnmc_minted: 186420,
  projected_savings_cr: 4820,
  cpse_breakdown: [
    { cpse: 'ONGC', count: 380200, duplicates: 132000 },
    { cpse: 'IOCL', count: 315100, duplicates: 98000 },
    { cpse: 'NTPC', count: 295400, duplicates: 84000 },
    { cpse: 'SAIL', count: 210000, duplicates: 56000 },
    { cpse: 'BHEL', count: 178900, duplicates: 42000 },
    { cpse: 'CPCL', count: 142500, duplicates: 48000 },
    { cpse: 'GAIL', count: 115800, duplicates: 31000 }
  ],
  duplication_breakdown: [
    { name: 'Identical (100%)', value: 142300, color: COLORS.identical },
    { name: 'Near Duplicate (>85%)', value: 185200, color: COLORS.nearDuplicate },
    { name: 'Functional Equivalent (>70%)', value: 84800, color: COLORS.functional },
    { name: 'Unique Items', value: 836290, color: COLORS.unique }
  ],
  processing_trend: [
    { month: 'Apr', ingested: 120000, minted: 28000, duplicates: 36000 },
    { month: 'May', ingested: 240000, minted: 52000, duplicates: 78000 },
    { month: 'Jun', ingested: 480000, minted: 98000, duplicates: 154000 },
    { month: 'Jul', ingested: 720000, minted: 135000, duplicates: 232000 },
    { month: 'Aug', ingested: 990000, minted: 162000, duplicates: 320000 },
    { month: 'Sep', ingested: 1248590, minted: 186420, duplicates: 412300 }
  ],
  sector_radar: [
    { sector: 'Oil & Gas', efficiency: 94, savings: 88, duplication: 38 },
    { sector: 'Power', efficiency: 91, savings: 82, duplication: 32 },
    { sector: 'Steel', efficiency: 86, savings: 76, duplication: 28 },
    { sector: 'Heavy Engg', efficiency: 89, savings: 79, duplication: 26 },
    { sector: 'Mining', efficiency: 84, savings: 71, duplication: 24 },
    { sector: 'Chemicals', efficiency: 88, savings: 74, duplication: 22 }
  ],
  recent_activity: [
    { id: 'TX-9041', time: '2m ago', action: 'CNMC Minted', item: 'VALVE BALL 2IN 150# RF SS316', cpse: 'ONGC', hash: '0x8f4c...91a2', status: 'verified' },
    { id: 'TX-9040', time: '8m ago', action: 'Match Approved', item: 'CENTRIFUGAL PUMP 50M3/HR CI', cpse: 'IOCL', hash: '0x3e1b...77cd', status: 'verified' },
    { id: 'TX-9039', time: '14m ago', action: 'Batch Ingested', item: 'SAP MM Catalog Export (1,240 items)', cpse: 'NTPC', hash: '0xaa42...00f8', status: 'verified' },
    { id: 'TX-9038', time: '21m ago', action: 'Dispute Flagged', item: 'BEARING 6205-2RS vs 6205 C3', cpse: 'SAIL', hash: '0x17c9...4410', status: 'review' }
  ],
  pending_reviews: [
    { id: 'PR-102', itemA: 'VALVE GATE 3" 300# WCB FLG (GAIL)', itemB: 'CS GATE VALVE 3IN CL300 RF (ONGC)', confidence: 88.4, type: 'Near Match' },
    { id: 'PR-103', itemA: 'PUMP IMPELLER BRONZE (IOCL)', itemB: 'CLOSED IMPELLER BRONZE (BHEL)', confidence: 82.1, type: 'Functional' },
    { id: 'PR-104', itemA: 'GASKET SPIRAL WOUND 4" 150# (CPCL)', itemB: 'SPWD GASKET 4IN 150LBS (NTPC)', confidence: 89.2, type: 'Near Match' }
  ]
};

const StatCard = ({ icon: Icon, label, value, sub, trend, color = 'blue', delay = 0 }) => {
  const colorMap = {
    cyan: { 
      text: 'text-telemetry-cyan', 
      border: 'border-seam-border hover:border-telemetry-cyan', 
      bg: 'bg-telemetry-cyan/10 text-telemetry-cyan',
      pill: 'text-telemetry-cyan bg-telemetry-cyan/10'
    },
    red: { 
      text: 'text-red-500', 
      border: 'border-seam-border hover:border-red-500', 
      bg: 'bg-red-500/10 text-red-500',
      pill: 'text-red-500 bg-red-500/10'
    },
    amber: { 
      text: 'text-telemetry-amber', 
      border: 'border-seam-border hover:border-telemetry-amber', 
      bg: 'bg-telemetry-amber/10 text-telemetry-amber',
      pill: 'text-telemetry-amber bg-telemetry-amber/10'
    },
    emerald: { 
      text: 'text-telemetry-emerald', 
      border: 'border-seam-border hover:border-telemetry-emerald', 
      bg: 'bg-telemetry-emerald/10 text-telemetry-emerald',
      pill: 'text-telemetry-emerald bg-telemetry-emerald/10'
    },
    purple: { 
      text: 'text-purple-500 dark:text-purple-400', 
      border: 'border-seam-border hover:border-purple-500', 
      bg: 'bg-purple-500/10 text-purple-500 dark:text-purple-400',
      pill: 'text-purple-500 dark:text-purple-400 bg-purple-500/10'
    }
  };
  const theme = colorMap[color] || colorMap.cyan;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className={`p-5 rounded-xl bg-surface border ${theme.border} transition-all shadow-xs flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-start justify-between">
          <span className="text-xs font-mono text-ink-muted uppercase tracking-wider font-medium">{label}</span>
          <div className={`p-2 rounded-lg ${theme.bg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
        <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight mt-2 ${theme.text}`}>
          {value}
        </div>
        <div className="text-xs text-ink-secondary mt-1 line-clamp-1">{sub}</div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-seam-border flex items-center text-xs text-ink-muted font-mono">
          <TrendingUp className="w-3.5 h-3.5 text-telemetry-emerald mr-1 shrink-0" />
          <span className="text-telemetry-emerald font-semibold">{trend}</span>
          <span className="ml-1 text-ink-muted">vs last cycle</span>
        </div>
      )}
    </motion.div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const userRole = user?.role || ROLES.ADMIN;
  const roleMeta = ROLE_METADATA[userRole] || ROLE_METADATA[ROLES.ADMIN];

  const gridStroke = isDark ? '#1e293b' : '#e2e8f0';
  const axisTickStroke = isDark ? '#94a3b8' : '#64748b';
  const tooltipStyle = {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    borderRadius: '8px',
    color: isDark ? '#f8fafc' : '#0f172a',
    fontSize: '12px',
    boxShadow: isDark ? '0 10px 25px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.08)'
  };

  // TanStack Query to live backend
  const { data: stats = FALLBACK_STATS, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/analytics/dashboard-stats');
        return res || FALLBACK_STATS;
      } catch (err) {
        console.warn('Dashboard stats fallback utilized:', err.message);
        return FALLBACK_STATS;
      }
    },
    staleTime: 60000,
    refetchInterval: 30000
  });

  return (
    <div className="space-y-6">
      
      {/* ─────────────────────────────────────────────────────────────
          ROLE-AWARE EXECUTIVE HEADER BANNER
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-surface border border-seam-border rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-telemetry-cyan/5 to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase border ${roleMeta.badgeColor}`}>
                {roleMeta.label}
              </span>
              <span className="text-xs font-mono text-ink-muted">
                NODE: <strong className="text-telemetry-cyan">{user?.activeNode || `${user?.organization_code}_01`}</strong>
              </span>
              <span className="text-xs font-mono text-ink-muted hidden sm:inline">&bull;</span>
              <span className="text-xs font-mono text-telemetry-emerald flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-telemetry-emerald animate-pulse"></span>
                SOVEREIGN FEDERATION SYNCHRONIZED
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-ink-primary font-mono">
              Welcome, {user?.name || 'Officer'}
            </h1>

            <p className="text-xs sm:text-sm text-ink-secondary max-w-2xl">
              {userRole === ROLES.ADMIN && "National Macro Command view: Managing cross-CPSE de-duplication, sovereign CNMC issuance, and procurement capital unlocking."}
              {userRole === ROLES.CPSE_ADMIN && `Enterprise Catalog Deck for ${user?.organization_name || 'CPSE'}: Local inventory health, duplicate detection, and migration plans.`}
              {userRole === ROLES.MANAGER && `Material Master Operations: Data ingestion pipelines, schema normalization, and bulk ERP deduplication.`}
              {userRole === ROLES.REVIEWER && "Technical Review Desk: Human-in-the-loop engineering validation, spec concordance diffs, and dispute resolution."}
              {userRole === ROLES.VIEWER && "Executive Read-Only Overview: National harmonization progress, CPSE comparisons, and economic savings metrics."}
            </p>
          </div>

          {/* Quick Action Shortcuts tailored to role */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {userRole === ROLES.REVIEWER ? (
              <Link
                to="/workflow"
                className="py-2.5 px-4 rounded-xl bg-telemetry-amber hover:bg-amber-600 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition shadow-xs"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>REVIEW PENDING MATCHES ({stats.pending_reviews?.length || 3})</span>
              </Link>
            ) : userRole === ROLES.MANAGER ? (
              <Link
                to="/ingestion"
                className="py-2.5 px-4 rounded-xl bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white text-xs font-bold font-mono flex items-center gap-1.5 transition shadow-xs"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>INGEST CPSE CATALOG</span>
              </Link>
            ) : (
              <Link
                to="/matching"
                className="py-2.5 px-4 rounded-xl bg-telemetry-cyan hover:bg-telemetry-cyan-bright text-white text-xs font-bold font-mono flex items-center gap-1.5 transition shadow-xs"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>RUN AI MATCH STUDIO</span>
              </Link>
            )}

            <Link
              to="/search"
              className="py-2.5 px-4 rounded-xl bg-surface-subtle hover:bg-surface-active border border-seam-border text-xs font-semibold text-ink-primary font-mono flex items-center gap-1.5 transition shadow-xs"
            >
              <span>Universal Search</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PRIMARY KPI METRICS CARDS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Database}
          label="Total Cataloged Items"
          value={stats.total_cataloged?.toLocaleString() || '1,248,590'}
          sub="Federated across 12 CPSE ERPs"
          trend="+12.4%"
          color="cyan"
          delay={0.05}
        />
        <StatCard
          icon={TrendingUp}
          label="Cross-CPSE Duplicate Ratio"
          value={`${stats.duplicate_ratio || '33.0'}%`}
          sub="342k identical & near matches"
          trend="-3.2%"
          color="amber"
          delay={0.1}
        />
        <StatCard
          icon={FileCode2}
          label="Sovereign CNMC Minted"
          value={stats.cnmc_minted?.toLocaleString() || '186,420'}
          sub="Standardized national materials"
          trend="+18.1%"
          color="emerald"
          delay={0.15}
        />
        <StatCard
          icon={Zap}
          label="Unlocked Working Capital"
          value={`₹${stats.projected_savings_cr?.toLocaleString() || '4,820'} Cr`}
          sub="Procurement & dead stock savings"
          trend="+8.5%"
          color="purple"
          delay={0.2}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CHARTS SECTION: CPSE BREAKDOWN & DUPLICATION SPREAD
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CPSE Distribution Bar Chart */}
        <div className="lg:col-span-8 bg-surface border border-seam-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-seam-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-ink-primary font-mono">
                CPSE CATALOG VOLUME &amp; DUPLICATION DISTRIBUTION
              </h3>
              <p className="text-xs text-ink-secondary">
                Total materials ingested vs. AI-flagged cross-CPSE duplicate records.
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-surface-subtle border border-seam-border text-ink-muted">
              LIVE ERP TELEMETRY
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.cpse_breakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="cpse" stroke={axisTickStroke} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke={axisTickStroke} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                <Bar dataKey="count" name="Total Ingested Items" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="duplicates" name="Duplicate Clusters" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Duplication Breakdown Pie Chart */}
        <div className="lg:col-span-4 bg-surface border border-seam-border rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="border-b border-seam-border pb-3">
            <h3 className="text-sm font-bold text-ink-primary font-mono">
              MATCH CONFIDENCE SPREAD
            </h3>
            <p className="text-xs text-ink-secondary">
              Tri-Modal AI categorization of duplicates.
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.duplication_breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.duplication_breakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS.blue} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] pt-2 border-t border-seam-border">
            {stats.duplication_breakdown?.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-ink-secondary truncate max-w-[140px]">{item.name}</span>
                </span>
                <span className="font-bold text-ink-primary">{item.value?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECONDARY SECTION: TRENDS & ACTIVITY LEDGER
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Harmonization Monthly Trajectory */}
        <div className="lg:col-span-7 bg-surface border border-seam-border rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-seam-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-ink-primary font-mono">
                HARMONIZATION VELOCITY &amp; SOVEREIGN CODE ISSUANCE
              </h3>
              <p className="text-xs text-ink-secondary">
                Cumulative items processed and CNMC codes standardized by month.
              </p>
            </div>
            <span className="text-telemetry-cyan font-mono text-xs font-semibold">
              6-MONTH TRAJECTORY
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.processing_trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMinted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="month" stroke={axisTickStroke} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke={axisTickStroke} tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="ingested" name="Ingested Items" stroke="#06b6d4" fillOpacity={1} fill="url(#colorIngested)" />
                <Area type="monotone" dataKey="minted" name="Minted CNMC" stroke="#10b981" fillOpacity={1} fill="url(#colorMinted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-Time Immutable Audit Log */}
        <div className="lg:col-span-5 bg-surface border border-seam-border rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-seam-border pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-telemetry-emerald animate-ping"></span>
                <h3 className="text-sm font-bold text-ink-primary font-mono">
                  LIVE CRYPTOGRAPHIC ACTIVITY
                </h3>
              </div>
              <Link to="/audit" className="text-xs text-telemetry-cyan hover:underline font-mono">
                Full Audit &rarr;
              </Link>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {stats.recent_activity?.map((act) => (
                <div
                  key={act.id}
                  className="p-2.5 rounded-lg bg-surface-subtle border border-seam-border hover:border-telemetry-cyan/30 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink-primary">{act.action}</span>
                      <span className="text-[10px] px-1.5 rounded bg-surface border border-seam-border text-telemetry-cyan">
                        {act.cpse}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted truncate max-w-[200px] mt-0.5">{act.item}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-ink-muted block">{act.time}</span>
                    <span className="text-[10px] text-telemetry-emerald">{act.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-seam-border flex items-center justify-between text-[11px] font-mono text-ink-muted">
            <span>AUDIT INTEGRITY: SHA-256</span>
            <span className="text-telemetry-emerald font-semibold">100% VERIFIED</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
