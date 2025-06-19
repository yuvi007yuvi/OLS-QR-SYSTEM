import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Building2, FileText, Scan, MapPin, Home } from 'lucide-react';
import QRAssistLogo from '../assets/LOGO.png';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(!isAdminDropdownOpen);
  };

  return (
    <div
      className={`fixed top-0 left-0 flex flex-col h-screen bg-white shadow-lg transition-all duration-300 z-30 ${isOpen ? 'w-64' : 'w-0 md:w-20'}`} 
      style={{ overflowX: 'hidden' }}
    >
      <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src={QRAssistLogo} alt="QR Assist Logo" className="h-8 w-8" />
          <span className={`text-xl font-bold text-gray-900 whitespace-nowrap ${isOpen ? 'ml-2' : 'hidden'}`}>QR Assist</span>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link
          to="/"
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/')
              ? 'bg-green-100 text-green-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
          <Home className={`h-4 w-4 ${isOpen ? 'mr-2' : 'hidden md:block'}`} />
          <span className={`${isOpen ? '' : 'hidden'}`}>Home</span>
        </Link>
        <div className="relative">
          <button
            onClick={toggleAdminDropdown}
            className={`flex items-center w-full px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isAdminDropdownOpen || isActive('/admin') || isActive('/reports')
                ? 'bg-green-100 text-green-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            <Building2 className={`h-4 w-4 ${isOpen ? 'mr-2' : 'hidden md:block'}`} />
            <span className={`${isOpen ? '' : 'hidden'}`}>Admin</span>
            {isOpen && (
              <svg
                className={`ml-auto h-4 w-4 transform transition-transform ${isAdminDropdownOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
          {isAdminDropdownOpen && isOpen && (
            <div className="pl-8 mt-1 space-y-1">
              <Link
                to="/admin"
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/admin')
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Building2 className="h-4 w-4 mr-2" />
                <span>Admin Dashboard</span>
              </Link>
              <Link
                to="/reports"
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/reports')
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                <span>Reports</span>
              </Link>
              <Link
                to="/map"
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/map')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <MapPin className="h-4 w-4 mr-2" />
                <span>Location Map</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/scanner"
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/scanner')
              ? 'bg-green-100 text-green-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
          <Scan className={`h-4 w-4 ${isOpen ? 'mr-2' : 'hidden md:block'}`} />
          <span className={`${isOpen ? '' : 'hidden'}`}>QR Scanner</span>
        </Link>

      </nav>
    </div>
  );
};

export default Sidebar;