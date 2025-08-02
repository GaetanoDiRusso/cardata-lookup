'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, User, X } from 'lucide-react';
import { getHomeRoute, getNewFolderRoute } from '@/constants/navigationRoutes';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Mock data - replace with real data later
  const userBalance = 1000;

  return (
    <header className="sticky top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Menu button (mobile) and My Vehicles (desktop) */}
          <div className="flex-1 flex items-center">
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link
              href={getHomeRoute()}
              className="hidden bg-gray-100 md:block px-4 py-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 font-medium cursor-pointer shadow-sm"
            >
              Mis Carpetas
            </Link>
          </div>

          {/* Center - New Vehicle button */}
          <div className="flex justify-center">
            <Link
              href={getNewFolderRoute()}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              Nueva Carpeta
            </Link>
          </div>

          {/* Right side - Balance, Load Balance button, and User menu */}
          <div className="flex flex-1 items-center space-x-4 justify-end">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-gray-700">Saldo: ${userBalance}</span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm cursor-pointer">
                Cargar saldo
              </button>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={24} className="text-gray-600" />
              </button>

              {/* User dropdown menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Configuración
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      // Handle logout
                      setIsUserMenuOpen(false);
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/my-folders"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              Mis Carpetas
            </Link>
            <hr className="border-gray-200 my-2" />
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-gray-700">Saldo: ${userBalance}</span>
              <button className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                Cargar saldo
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 