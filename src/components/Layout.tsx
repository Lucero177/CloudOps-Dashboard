import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/planning': 'Planificación Cloud',
  '/costs': 'Costos y economía Cloud',
  '/infrastructure': 'Infraestructura Global',
  '/security': 'Seguridad',
  '/network': 'Arquitectura de Red',
  '/services': 'Servicios AWS',
};

export default function Layout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="md:ml-64">
        <Header title={titles[location.pathname] || 'CloudOps Dashboard'} />
        <main className="p-4 pt-20 md:p-8 md:pt-8"><Outlet /></main>
      </div>
    </div>
  );
}
