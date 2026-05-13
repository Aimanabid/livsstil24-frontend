import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './context/authStore';

// Public pages
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/public/HomePage';
import ArticlePage from './pages/public/ArticlePage';
import CategoryPage from './pages/public/CategoryPage';
import AppDownloadPage from './pages/public/AppDownloadPage';

// Admin pages
import AdminLayout from './components/layout/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ArticlesPage from './pages/admin/ArticlesPage';
import ArticleEditorPage from './pages/admin/ArticleEditorPage';
import AdsPage from './pages/admin/AdsPage';
import CustomersPage from './pages/admin/CustomersPage';
import StatisticsPage from './pages/admin/StatisticsPage';
import PlacementsPage from './pages/admin/PlacementsPage';

function ProtectedRoute({ children }) {
  const { user, initialized } = useAuthStore();
  if (!initialized) return null;
  return user ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  const { fetchMe } = useAuthStore();

  useEffect(() => { fetchMe(); }, []);

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="kategori/:slug" element={<CategoryPage />} />
        <Route path="artikel/:slug" element={<ArticlePage />} />
        <Route path="app" element={<AppDownloadPage />} />
      </Route>

      {/* Admin login */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin panel */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="artiklar" element={<ArticlesPage />} />
        <Route path="artiklar/ny" element={<ArticleEditorPage />} />
        <Route path="artiklar/:id" element={<ArticleEditorPage />} />
        <Route path="annonser" element={<AdsPage />} />
        <Route path="platser" element={<PlacementsPage />} />
        <Route path="kunder" element={<CustomersPage />} />
        <Route path="statistik" element={<StatisticsPage />} />
      </Route>
    </Routes>
  );
}
