'use client';

import AdminSidebar from '@/components/sidebar/admin/Sidebar';
import SupplierSidebar from '@/components/sidebar/supplier/Sidebar';
import { useAuthStore } from '@/stores/auth-store';

export default function SidebarManager() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  switch (user.role.role_id) {
    case 'ADMIN':
      return <AdminSidebar />;

    case 'SUPPLIER':
      return <SupplierSidebar />;

    default:
      return null;
  }
}
