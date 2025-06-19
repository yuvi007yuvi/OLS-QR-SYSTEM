import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import MapPage from './pages/MapPage';
import UploadPage from './pages/UploadPage';
import ReportsPage from './pages/ReportsPage';
import ScannerPage from './pages/ScannerPage';
import EditQRPage from './pages/EditQRPage';
import { Menu } from 'lucide-react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0 md:ml-20'} relative z-10`}>
          <div className="p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6">
            <Routes>
              {/* Public routes without sidebar */}
              <Route path="/upload/:qrcodeid" element={<UploadPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/edit-qr/:qrCodeId" element={<EditQRPage />} />
              
              {/* Routes with sidebar */}
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;