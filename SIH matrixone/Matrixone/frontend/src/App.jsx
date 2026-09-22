import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { DataIngestion } from './pages/DataIngestion';
import { AIMatching } from './pages/AIMatching';
import { ReviewWorkflow } from './pages/ReviewWorkflow';
import { NationalCodeGen } from './pages/NationalCodeGen';
import { Analytics } from './pages/Analytics';
import { AuditTrail } from './pages/AuditTrail';
import { AIChat } from './pages/AIChat';
import { Settings } from './pages/Settings';
import { MaterialSearch } from './pages/MaterialSearch';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
      retry: 1,
    },
  },
});

const AppLayout = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isLogin = location.pathname === '/login';

  if (isLogin) {
    return <div className="min-h-screen bg-canvas text-ink-primary">{children}</div>;
  }

  if (isLanding) {
    return (
      <div className="min-h-screen bg-canvas text-ink-primary flex flex-col transition-colors duration-200">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col transition-colors duration-200">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 bg-canvas transition-colors duration-200">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export function App() {
  const { resolvedTheme, initSystemListener } = useThemeStore();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const cleanup = initSystemListener();
    checkAuth();
    return cleanup;
  }, [initSystemListener, checkAuth]);

  const isDark = resolvedTheme === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated & Role-Guarded Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><MaterialSearch /></ProtectedRoute>} />
            <Route path="/materials" element={<ProtectedRoute><MaterialSearch /></ProtectedRoute>} />
            <Route path="/ingestion" element={<ProtectedRoute><DataIngestion /></ProtectedRoute>} />
            <Route path="/matching" element={<ProtectedRoute><AIMatching /></ProtectedRoute>} />
            <Route path="/ai-matching" element={<ProtectedRoute><AIMatching /></ProtectedRoute>} />
            <Route path="/workflow" element={<ProtectedRoute><ReviewWorkflow /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><ReviewWorkflow /></ProtectedRoute>} />
            <Route path="/cnmc" element={<ProtectedRoute><NationalCodeGen /></ProtectedRoute>} />
            <Route path="/national-codes" element={<ProtectedRoute><NationalCodeGen /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/audit" element={<ProtectedRoute><AuditTrail /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
            <Route path="/ai-chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#111827' : '#ffffff',
            color: isDark ? '#f3f4f6' : '#0f172a',
            border: isDark ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid #e2e8f0',
            boxShadow: isDark ? '0 10px 25px -5px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.08)',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: isDark ? '#111827' : '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: isDark ? '#111827' : '#ffffff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
