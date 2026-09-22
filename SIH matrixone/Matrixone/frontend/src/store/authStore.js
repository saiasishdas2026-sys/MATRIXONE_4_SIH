import { create } from 'zustand';
import { apiClient } from '../utils/api';
import { ROLES, ROLE_METADATA, DEMO_USERS, hasPermission, canAccessRoute } from '../utils/permissions';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('matrixone_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialUser = getStoredUser() || {
  id: 1,
  email: 'admin@matrixone.gov.in',
  full_name: 'Dr. Anand Swaroop',
  name: 'Dr. Anand Swaroop',
  role: 'admin',
  role_id: 1,
  organization_id: 1,
  organization_code: 'CPCL',
  organization_name: 'Chennai Petroleum Corporation Ltd',
  permissions: [
    'dashboard', 'materials', 'datasets', 'matching', 'review',
    'master', 'inventory', 'analytics', 'migration', 'network', 'audit', 'users',
    'governance', 'system', 'settings', 'upload', 'approve', 'search',
  ],
  designation: 'Director General (Procurement Harmonization)',
  department: 'Ministry of Heavy Industries & MoPNG',
  clearanceLevel: 'LEVEL 5 SOVEREIGN (CENTRAL)',
  activeNode: 'CENTRAL_COMMAND_NEW_DELHI',
  avatar: 'AS',
};

const hasInitialToken = !!localStorage.getItem('matrixone_token');

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: localStorage.getItem('matrixone_token') || null,
  isAuthenticated: hasInitialToken || true, // default authenticated with demo user for seamless UX
  isLoading: false,
  error: null,
  activeCPSEView: 'NATIONAL_FEDERATION', // 'NATIONAL_FEDERATION' | 'ONGC' | 'IOCL' | 'CPCL' | 'NTPC' | 'SAIL' | 'CIL'

  setActiveCPSEView: (cpse) => set({ activeCPSEView: cpse }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await apiClient.post('/auth/login', { email, password });
      const meta = ROLE_METADATA[data.role] || ROLE_METADATA[ROLES.VIEWER];
      const demoUser = DEMO_USERS.find(u => u.email === email);

      const userProfile = {
        ...data,
        name: data.full_name || (demoUser ? demoUser.name : 'Authorized Officer'),
        designation: demoUser ? demoUser.title : `${data.role.toUpperCase()} Officer`,
        department: data.organization_name || 'Central CPSE Federation',
        clearanceLevel: meta.clearanceLevel,
        activeNode: demoUser ? demoUser.node : `${data.organization_code || 'CPSE'}_NODE_01`,
        avatar: demoUser ? demoUser.avatar : (data.full_name ? data.full_name.split(' ').map(n=>n[0]).join('').slice(0,2) : 'MO'),
      };

      localStorage.setItem('matrixone_token', data.access_token);
      localStorage.setItem('matrixone_user', JSON.stringify(userProfile));

      set({
        user: userProfile,
        token: data.access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user: userProfile };
    } catch (err) {
      set({
        isLoading: false,
        error: err.message || 'Authentication failed. Please verify credentials.',
      });
      return { success: false, error: err.message };
    }
  },

  logout: () => {
    localStorage.removeItem('matrixone_token');
    localStorage.removeItem('matrixone_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('matrixone_token');
    if (!token) return;

    try {
      const data = await apiClient.get('/auth/me');
      const meta = ROLE_METADATA[data.role] || ROLE_METADATA[ROLES.VIEWER];
      const demoUser = DEMO_USERS.find(u => u.email === data.email);

      const userProfile = {
        ...data,
        name: data.full_name || (demoUser ? demoUser.name : 'Authorized Officer'),
        designation: demoUser ? demoUser.title : `${data.role.toUpperCase()} Officer`,
        department: data.organization_name || 'Central CPSE Federation',
        clearanceLevel: meta.clearanceLevel,
        activeNode: demoUser ? demoUser.node : `${data.organization_code || 'CPSE'}_NODE_01`,
        avatar: demoUser ? demoUser.avatar : 'MO',
      };

      localStorage.setItem('matrixone_user', JSON.stringify(userProfile));
      set({ user: userProfile, isAuthenticated: true, token });
    } catch {
      // If token invalid, preserve local user if present or clear
      console.warn('[MATRIXONE] Session validation returned unauthenticated');
    }
  },

  /**
   * Fast Demo Switcher for Hackathon Judges
   */
  switchDemoRole: async (demoEmail) => {
    const demo = DEMO_USERS.find(u => u.email === demoEmail);
    if (!demo) return;
    return await get().login(demo.email, demo.password);
  },

  hasPerm: (perm) => {
    const user = get().user;
    return hasPermission(user?.permissions || [], perm);
  },

  canAccess: (route) => {
    const user = get().user;
    return canAccessRoute(route, user?.permissions || []);
  }
}));

// Listen for 401 custom event dispatched by apiClient
if (typeof window !== 'undefined') {
  window.addEventListener('matrixone_auth_expired', () => {
    useAuthStore.getState().logout();
  });
}
