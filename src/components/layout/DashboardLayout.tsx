import React from 'react';
import { Header } from './Header';
import { ClientDashboard } from '../dashboard/ClientDashboard';
import { AttorneyDashboard } from '../dashboard/AttorneyDashboard';
import { useAuthStore } from '@/store/useAuthStore';

export const DashboardLayout: React.FC = () => {
  const { role } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {role === 'lawyer' ? <AttorneyDashboard /> : <ClientDashboard />}
      </main>
    </div>
  );
};