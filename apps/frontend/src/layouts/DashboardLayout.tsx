import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Menu, X, Boxes } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Owners', href: '/owners', icon: Users },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
        <Boxes className="h-5 w-5 text-white" />
      </div>
      <div>
        <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Ops Products
        </span>
        <p className="text-[10px] text-muted-foreground font-medium -mt-0.5">Management System</p>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-16 items-center gap-x-4 border-b bg-white/80 backdrop-blur-md px-4 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <Logo />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl">
            <div className="flex h-16 items-center justify-between px-6 border-b">
              <Logo />
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="mt-6 px-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium mb-1 transition-all',
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon className={cn('h-5 w-5', isActive && 'text-blue-600')} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto border-r bg-white/80 backdrop-blur-md px-6">
          <div className="flex h-20 shrink-0 items-center">
            <Logo />
          </div>
          <nav className="flex flex-1 flex-col pt-4">
            <ul className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center gap-x-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm border border-blue-100'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon className={cn('h-5 w-5 transition-colors', isActive ? 'text-blue-600' : '')} />
                      {item.name}
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="py-4 border-t">
            <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
              <p className="text-xs font-medium text-gray-500">Operations Dashboard</p>
              <p className="text-[10px] text-gray-400 mt-1">v1.0.0 - Production</p>
            </div>
          </div>
        </div>
      </div>

      <main className="lg:pl-72">
        <div className="pt-16 lg:pt-0">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
