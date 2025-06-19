import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  QrCode,
  Camera,
  FileText,
  MapPin,
  Scan,
  Upload,
  BarChart3,
  Shield,
  Clock,
  Users,
  ArrowRight
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: QrCode,
      title: 'QR Code Generation',
      description: 'Generate unique QR codes for each location with detailed information and GPS coordinates.',
      color: 'bg-blue-500'
    },
    {
      icon: Camera,
      title: 'Photo Documentation',
      description: 'Upload before and after photos directly through QR code scanning for complete documentation.',
      color: 'bg-green-500'
    },
    {
      icon: MapPin,
      title: 'Location Mapping',
      description: 'View all locations on an interactive map with real-time status updates and GPS tracking.',
      color: 'bg-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Progress Reports',
      description: 'Generate comprehensive reports and track completion status across all locations.',
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { label: 'Locations Managed', value: '500+', icon: MapPin },
    { label: 'Photos Uploaded', value: '1,200+', icon: Camera },
    { label: 'QR Codes Generated', value: '750+', icon: QrCode },
    { label: 'Active Supervisors', value: '50+', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img src="src\assets\LOGO.png" alt="QR Assist Logo" className="h-26"/>
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
                to="/admin"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <QrCode className="h-6 w-6 mr-2" />
                Admin Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
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
      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Municipal Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage, track, and document municipal projects efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className={`inline-flex p-4 rounded-xl ${feature.color} mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple 4-step process to manage your municipal documentation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Create Location</h3>
              <p className="text-gray-600">Add location details with GPS coordinates and generate QR codes</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Deploy QR Codes</h3>
              <p className="text-gray-600">Print and place QR codes at respective locations for easy access</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Scan & Upload</h3>
              <p className="text-gray-600">Field teams scan QR codes and upload before/after photos</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600">Monitor completion status and generate comprehensive reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
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
              to="/admin"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-200 group"
            >
              <QrCode className="h-12 w-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">Admin Dashboard</h3>
              <p className="text-blue-100 text-sm">Create locations and generate QR codes</p>
            </Link>

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
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our System?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Secure & Reliable</h3>
                    <p className="text-gray-600">Built with Firebase for enterprise-grade security and reliability</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Real-time Updates</h3>
                    <p className="text-gray-600">Instant synchronization across all devices and team members</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Team Collaboration</h3>
                    <p className="text-gray-600">Multiple supervisors and field teams can work simultaneously</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <div className="inline-flex p-4 bg-blue-100 rounded-full mb-6">
                  <Upload className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-8">
                  Begin documenting your municipal projects with our comprehensive photo management system.
                </p>
                <div className="space-y-4">
                  <Link
                    to="/admin"
                    className="block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Location
                  </Link>
                  <Link
                    to="/map"
                    className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Location Map
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;