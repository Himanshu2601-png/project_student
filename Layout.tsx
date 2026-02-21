import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Upload, BookOpen, Home, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Browse Resources', href: '/resources', icon: BookOpen },
    { name: 'Upload', href: '/upload', icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">UniVault</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700 hidden sm:block">Welcome, {user.name}</span>
                  <button
                    onClick={logout}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <div className="space-x-4">
                  <Link to="/login" className="text-gray-500 hover:text-gray-900">Login</Link>
                  <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar (Desktop) */}
        {user && (
          <aside className="hidden md:block w-64 bg-white border-r border-gray-200 pt-6 pb-4 overflow-y-auto">
            <div className="px-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-md group",
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
