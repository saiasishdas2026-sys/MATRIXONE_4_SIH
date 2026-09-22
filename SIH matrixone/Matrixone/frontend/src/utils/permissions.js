/**
 * MATRIXONE Role-Based Access Control (RBAC) & Permissions Engine
 * Defines roles, permissions, route requirements, and UI navigation hierarchies.
 */

export const ROLES = {
  ADMIN: 'admin',
  CPSE_ADMIN: 'cpse_admin',
  MANAGER: 'manager',
  REVIEWER: 'reviewer',
  VIEWER: 'viewer',
};

export const ROLE_METADATA = {
  [ROLES.ADMIN]: {
    label: 'Ministry Super Admin',
    shortLabel: 'Super Admin',
    badgeColor: 'bg-red-500/10 text-red-500 border-red-500/30',
    clearanceLevel: 'LEVEL 5 SOVEREIGN (CENTRAL)',
    description: 'National federation control, all CPSE catalogs, system settings, and user administration.',
    defaultOrg: 'MoPNG / MHI Central Command',
  },
  [ROLES.CPSE_ADMIN]: {
    label: 'CPSE Administrator',
    shortLabel: 'CPSE Admin',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    clearanceLevel: 'LEVEL 4 ENTERPRISE',
    description: 'Enterprise-level authority over CPSE ERP catalogs, migration plans, and local workflows.',
    defaultOrg: 'Oil and Natural Gas Corporation (ONGC)',
  },
  [ROLES.MANAGER]: {
    label: 'Material Master Manager',
    shortLabel: 'Material Mgr',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    clearanceLevel: 'LEVEL 3 OPERATIONAL',
    description: 'Catalog data ingestion, schema validation, bulk operations, and deduplication.',
    defaultOrg: 'Indian Oil Corporation Ltd (IOCL)',
  },
  [ROLES.REVIEWER]: {
    label: 'Technical Review Officer',
    shortLabel: 'Technical Reviewer',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    clearanceLevel: 'LEVEL 3 ENGINEERING',
    description: 'Human-in-the-loop dispute verification, spec concordance diffs, and approval authority.',
    defaultOrg: 'ONGC Hazira Technical Wing',
  },
  [ROLES.VIEWER]: {
    label: 'Executive Viewer',
    shortLabel: 'Viewer',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    clearanceLevel: 'LEVEL 1 READ-ONLY',
    description: 'High-level dashboard KPIs, national material master lookup, and savings analytics.',
    defaultOrg: 'NTPC Corporate Planning',
  },
};

export const DEMO_USERS = [
  {
    role: ROLES.ADMIN,
    email: 'admin@matrixone.gov.in',
    name: 'Dr. Anand Swaroop',
    title: 'Director General (Procurement Harmonization)',
    org: 'MoPNG / Central CPSE Command',
    orgCode: 'CPCL',
    password: 'matrixone123',
    node: 'CENTRAL_COMMAND_NEW_DELHI',
    avatar: 'AS',
  },
  {
    role: ROLES.CPSE_ADMIN,
    email: 'cpse.admin@matrixone.gov.in',
    name: 'Er. Rajesh Sharma',
    title: 'Chief General Manager (Materials & SAP MM)',
    org: 'Oil and Natural Gas Corporation',
    orgCode: 'ONGC',
    password: 'matrixone123',
    node: 'ONGC_MUMBAI_NODE_01',
    avatar: 'RS',
  },
  {
    role: ROLES.MANAGER,
    email: 'manager@matrixone.gov.in',
    name: 'Priya Nair',
    title: 'Lead Catalog Standardization Officer',
    org: 'Indian Oil Corporation Ltd',
    orgCode: 'IOCL',
    password: 'matrixone123',
    node: 'IOCL_REFINERIES_DELHI',
    avatar: 'PN',
  },
  {
    role: ROLES.REVIEWER,
    email: 'reviewer@matrixone.gov.in',
    name: 'Dr. R. Iyer',
    title: 'Senior Engineering Consultant (Piping & Valves)',
    org: 'ONGC Hazira Technical Wing',
    orgCode: 'ONGC',
    password: 'matrixone123',
    node: 'ONGC_HAZIRA_OPS',
    avatar: 'RI',
  },
  {
    role: ROLES.VIEWER,
    email: 'viewer@matrixone.gov.in',
    name: 'Vikram Mehta',
    title: 'Executive Financial Analyst',
    org: 'NTPC Limited',
    orgCode: 'NTPC',
    password: 'matrixone123',
    node: 'NTPC_POWER_HQ',
    avatar: 'VM',
  },
];

/**
 * Permissions required for each route
 */
export const ROUTE_PERMISSIONS = {
  '/dashboard': ['dashboard'],
  '/search': ['search', 'materials'],
  '/materials': ['materials', 'search'],
  '/ingestion': ['upload', 'datasets', 'materials'],
  '/matching': ['matching'],
  '/ai-matching': ['matching'],
  '/workflow': ['review', 'approve'],
  '/review': ['review', 'approve'],
  '/cnmc': ['master'],
  '/national-codes': ['master'],
  '/analytics': ['analytics'],
  '/audit': ['audit'],
  '/chat': ['assistant', 'matching', 'dashboard'],
  '/ai-chat': ['assistant', 'matching', 'dashboard'],
  '/settings': ['settings', 'system', 'users'],
};

/**
 * Checks if a user possesses the required permission.
 */
export const hasPermission = (userPermissions = [], requiredPermission) => {
  if (!requiredPermission) return true;
  if (userPermissions.includes('admin') || userPermissions.includes('*')) return true;
  return userPermissions.includes(requiredPermission);
};

/**
 * Checks if a user can access a specific route path.
 */
export const canAccessRoute = (routePath, userPermissions = []) => {
  const reqPerms = ROUTE_PERMISSIONS[routePath];
  if (!reqPerms || reqPerms.length === 0) return true;
  return reqPerms.some((perm) => hasPermission(userPermissions, perm));
};
