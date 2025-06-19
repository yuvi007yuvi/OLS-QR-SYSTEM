import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scan,
  ArrowRight,
  MapPin,
  FileText
} from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img src="/src/assets/LOGO.png" alt="QR Assist Logo" className="h-26"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              QR Assist
              <span className="text-green-600 block">Documentation System</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Streamline your municipal documentation process with QR code-based photo tracking,
              GPS location mapping, and comprehensive progress reporting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Link
                to="/scanner"
                className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Scan className="h-6 w-6 mr-3" />
                QR Scanner
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Access Section
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Quick Access
            </h2>
            <p className="text-xl text-blue-100">
              Jump to the tools you need most
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


            <Link
              to="/map"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-200 group"
            >
              <MapPin className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">Location Map</h3>
              <p className="text-blue-100 text-sm">View all locations on interactive map</p>
            </Link>

            <Link
              to="/scanner"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-200 group"
            >
              <Scan className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">QR Scanner</h3>
              <p className="text-blue-100 text-sm">Scan QR codes to upload photos</p>
            </Link>

            <Link
              to="/reports"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-200 group"
            >
              <FileText className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">Reports</h3>
              <p className="text-blue-100 text-sm">View progress and generate reports</p>
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
};
export default HomePage;