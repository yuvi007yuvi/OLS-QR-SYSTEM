// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Building2, QrCode, FileText, Upload, Scan, MapPin, Home } from 'lucide-react';

// const Navbar: React.FC = () => {
//   const location = useLocation();

//   const isActive = (path: string) => location.pathname === path;

//   return (
//     <nav className="bg-white shadow-lg border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center">
//               <Building2 className="h-8 w-8 text-blue-600" />
//               <span className="ml-2 text-xl font-bold text-gray-900">
//                 QR CODE SCANNER
//               </span>
//             </Link>
//           </div>

//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-4">
//               <Link
//                 to="/"
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${isActive('/')
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//               >
//                 <Home className="h-4 w-4 mr-2" />
//                 Home
//               </Link>
//               <Link
//                 to="/admin"
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${isActive('/admin')
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//               >
//                 <QrCode className="h-4 w-4 mr-2" />
//                 Admin Dashboard
//               </Link>
//               <Link
//                 to="/map"
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${isActive('/map')
//                     ? 'bg-purple-100 text-purple-700'
//                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//               >
//                 <MapPin className="h-4 w-4 mr-2" />
//                 Location Map
//               </Link>
//               <Link
//                 to="/reports"
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${isActive('/reports')
//                     ? 'bg-blue-100 text-blue-700'
//                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//               >
//                 <FileText className="h-4 w-4 mr-2" />
//                 Reports
//               </Link>
//               <Link
//                 to="/scanner"
//                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center ${isActive('/scanner')
//                     ? 'bg-green-100 text-green-700'
//                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                   }`}
//               >
//                 <Scan className="h-4 w-4 mr-2" />
//                 QR Scanner
//               </Link>
//               <div className="px-3 py-2 text-sm text-gray-400 flex items-center">
//                 <Upload className="h-4 w-4 mr-2" />
//                 Upload via QR
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;