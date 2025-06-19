import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Camera, CheckCircle, Clock, AlertCircle, Filter, Search, Table } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllLocations, deleteLocation } from '../services/firebaseService';
import { Location } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="7" fill="white"/>
    </svg>
  `)}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const completeIcon = createCustomIcon('#10B981'); // Green
const partialIcon = createCustomIcon('#F59E0B'); // Yellow
const pendingIcon = createCustomIcon('#EF4444'); // Red

// Helper function to validate coordinates
const isValidCoordinate = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

// Helper function to validate location has valid coordinates
const hasValidCoordinates = (location: Location): boolean => {
  return isValidCoordinate(location.latitude) && isValidCoordinate(location.longitude);
};

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'partial' | 'complete'>('all');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  // Default center (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629];

  const fetchLocations = async () => {
    try {
      const data = await getAllLocations();
      // Filter out locations with invalid coordinates
      const validLocations = data.filter(hasValidCoordinates);
      setLocations(validLocations);
      setFilteredLocations(validLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    let filtered = locations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(location => 
        location.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.supervisorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.qrCodeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(location => {
        const hasBefore = !!location.beforePhoto;
        const hasAfter = !!location.afterPhoto;

        switch (filterStatus) {
          case 'pending':
            return !hasBefore && !hasAfter;
          case 'partial':
            return (hasBefore && !hasAfter) || (!hasBefore && hasAfter);
          case 'complete':
            return hasBefore && hasAfter;
          default:
            return true;
        }
      });
    }

    setFilteredLocations(filtered);
  }, [locations, searchTerm, filterStatus]);

  const getLocationStatus = (location: Location) => {
    const hasBefore = !!location.beforePhoto;
    const hasAfter = !!location.afterPhoto;

    if (hasBefore && hasAfter) return 'complete';
    if (hasBefore || hasAfter) return 'partial';
    return 'pending';
  };

  const getMarkerIcon = (location: Location) => {
    const status = getLocationStatus(location);
    switch (status) {
      case 'complete': return completeIcon;
      case 'partial': return partialIcon;
      default: return pendingIcon;
    }
  };

  const getStatusBadge = (location: Location) => {
    const status = getLocationStatus(location);
    switch (status) {
      case 'complete':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Complete
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Partial
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
    }
  };

  const formatCoordinate = (value: number): string => {
    return isValidCoordinate(value) ? value.toFixed(6) : 'N/A';
  };

  const handleView = (qrCodeId: string) => {
    navigate(`/reports?qrCodeId=${qrCodeId}`);
  };

  const handleEdit = (qrCodeId: string) => {
    console.log('MapPage: handleEdit called with QR Code ID:', qrCodeId);
    console.log('Attempting to edit QR Code ID:', qrCodeId);
    navigate(`/edit-qr/${qrCodeId}`); // Assuming an edit route like /edit-qr/:id
  };

  const handleDelete = async (locationToDelete: Location) => {
    if (window.confirm(`Are you sure you want to delete QR Code ID: ${locationToDelete.qrCodeId}?`)) {
      try {
        console.log('Attempting to delete QR Code ID:', locationToDelete.qrCodeId);
        await deleteLocation(locationToDelete.id);
        fetchLocations(); // Re-fetch locations to update the map and table
        alert('Location deleted successfully!');
      } catch (error) {
        console.error('Error deleting location:', error);
        alert('Failed to delete location.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading map data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Location Map</h1>
            <p className="text-gray-600">Interactive map showing all QR code locations and their status</p>
          </div>
          <button
            onClick={() => setShowTable(!showTable)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {showTable ? 'Hide QR Data Table' : 'Show QR Data Table'}
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{locations.length}</div>
                <div className="text-sm text-gray-600">Total Locations</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {locations.filter(l => l.beforePhoto && l.afterPhoto).length}
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {locations.filter(l => (l.beforePhoto && !l.afterPhoto) || (!l.beforePhoto && l.afterPhoto)).length}
                </div>
                <div className="text-sm text-gray-600">Partial</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {locations.filter(l => !l.beforePhoto && !l.afterPhoto).length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {showTable && (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">All QR Data</h2>
              <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-4 sm:space-y-0">
                <div className="flex space-x-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by name, area, supervisor, QR ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'partial' | 'complete')}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="complete">Complete</option>
                    <option value="partial">Partial</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLocations.map((location) => (
                    <tr key={location.qrCodeId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.qrCodeId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.locationName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.area}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.supervisorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{location.contactNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCoordinate(location.latitude)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCoordinate(location.longitude)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleView(location.qrCodeId)} className="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                        <button onClick={() => handleEdit(location.qrCodeId)} className="text-green-600 hover:text-green-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(location)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {filteredLocations.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        No QR data found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="complete">Complete</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span>Complete</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span>Partial</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-96 md:h-[600px]">
            <MapContainer
              center={defaultCenter}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.latitude, location.longitude]}
                  icon={getMarkerIcon(location)}
                  eventHandlers={{
                    click: () => setSelectedLocation(location)
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[250px]">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{location.locationName}</h3>
                        {getStatusBadge(location)}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>QR ID:</strong> {location.qrCodeId}</p>
                        <p><strong>Area:</strong> {location.area}</p>
                        <p><strong>Supervisor:</strong> {location.supervisorName}</p>
                        <p><strong>Contact:</strong> {location.contactNumber}</p>
                        <p><strong>Coordinates:</strong> {formatCoordinate(location.latitude)}, {formatCoordinate(location.longitude)}</p>
                      </div>
                      <div className="mt-3 flex justify-between text-xs">
                        <span className={`flex items-center ${location.beforePhoto ? 'text-green-600' : 'text-gray-400'}`}>
                          <Camera className="h-3 w-3 mr-1" />
                          Before: {location.beforePhoto ? '✓' : '✗'}
                        </span>
                        <span className={`flex items-center ${location.afterPhoto ? 'text-green-600' : 'text-gray-400'}`}>
                          <Camera className="h-3 w-3 mr-1" />
                          After: {location.afterPhoto ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Location Details Modal */}
        {selectedLocation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <AlertCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Location Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">QR Code ID</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{selectedLocation.qrCodeId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedLocation)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLocation.locationName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Area</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLocation.area}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Coordinates</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      {formatCoordinate(selectedLocation.latitude)}, {formatCoordinate(selectedLocation.longitude)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Supervisor</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLocation.supervisorName}</p>
                  </div>
                </div>

                {/* Photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Before Photo</h4>
                    {selectedLocation.beforePhoto ? (
                      <div>
                        <img
                          src={selectedLocation.beforePhoto.url}
                          alt="Before"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          Uploaded: {selectedLocation.beforePhoto.uploadedAt.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No photo uploaded</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">After Photo</h4>
                    {selectedLocation.afterPhoto ? (
                      <div>
                        <img
                          src={selectedLocation.afterPhoto.url}
                          alt="After"
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          Uploaded: {selectedLocation.afterPhoto.uploadedAt.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">No photo uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;