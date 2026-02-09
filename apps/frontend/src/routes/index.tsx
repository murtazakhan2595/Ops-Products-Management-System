import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';

import DashboardPage from '@/modules/dashboard/pages/DashboardPage';
import ProductListPage from '@/modules/products/pages/ProductListPage';
import ProductCreatePage from '@/modules/products/pages/ProductCreatePage';
import ProductEditPage from '@/modules/products/pages/ProductEditPage';
import OwnersListPage from '@/modules/owners/pages/OwnersListPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/new" element={<ProductCreatePage />} />
        <Route path="products/:id" element={<ProductEditPage />} />
        <Route path="owners" element={<OwnersListPage />} />
      </Route>
    </Routes>
  );
}
