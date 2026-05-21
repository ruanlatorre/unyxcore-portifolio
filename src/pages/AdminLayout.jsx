import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1f2a',
            color: '#e2e1f1',
            border: '1px solid rgba(240, 238, 255, 0.1)',
            backdropFilter: 'blur(20px)',
          },
          success: { iconTheme: { primary: '#7c3aed', secondary: '#e2e1f1' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#e2e1f1' } },
        }}
      />
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
