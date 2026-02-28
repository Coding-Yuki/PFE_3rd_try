'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Users, Settings, LogOut, Search } from 'lucide-react';

const navigation = [
  { name: 'Fil', href: '/', icon: Home },
  { name: 'Profil', href: '/profile/me', icon: User },
  { name: 'Camarades', href: '/classmates', icon: Users },
  { name: 'Paramètres', href: '/settings', icon: Settings },
  { name: 'Déconnexion', href: '#', icon: LogOut, isLogout: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/register';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchValue = (e.target as HTMLInputElement).value.trim();
      if (searchValue) {
        window.location.href = `/?q=${encodeURIComponent(searchValue)}`;
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          UniSocial
        </h1>
        <p className="text-sm text-gray-500 mt-1">Réseau Universitaire</p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.name === 'Profil' && pathname.startsWith('/profile/'));
          
          if (item.isLogout) {
            return (
              <button
                key={item.name}
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 group mb-2"
              >
                <item.icon className="mr-3 h-5 w-5 group-hover:text-red-700" />
                {item.name}
              </button>
            );
          }
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>


    </div>
  );
}
