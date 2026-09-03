import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ScamDetectorPage } from './pages/ScamDetectorPage';
import { URLScannerPage } from './pages/URLScannerPage';
import { FileScannerPage } from './pages/FileScannerPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { AwarenessPage } from './pages/AwarenessPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-400">Verifying Security Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected App Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="scam-detector" element={<ScamDetectorPage />} />
                <Route path="url-scanner" element={<URLScannerPage />} />
                <Route path="file-scanner" element={<FileScannerPage />} />
                <Route path="complaints" element={<ComplaintsPage />} />
                <Route path="chatbot" element={<ChatbotPage />} />
                <Route path="awareness" element={<AwarenessPage />} />
                <Route path="emergency" element={<EmergencyPage />} />
                <Route path="admin" element={<AdminDashboardPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
