import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, MapPin, User, Phone, Building, Navigation } from 'lucide-react';
import { createLocation, checkQRCodeExists } from '../services/firebaseService';
import QRCodeDisplay from '../components/QRCodeDisplay';
import LoadingSpinner from '../components/LoadingSpinner';

interface LocationForm {
  qrCodeId: string;
  locationName: string;
  area: string;
  supervisorName: string;
  contactNumber: string;
  latitude: number;
  longitude: number;
}

const AdminDashboard: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<LocationForm | null>(null);
  const [qrError, setQrError] = useState<string>('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue,
    watch
  } = useForm<LocationForm>();

  const watchedLatitude = watch('latitude');
  const watchedLongitude = watch('longitude');

  const validateQRCode = async (qrCodeId: string) => {
    if (qrCodeId.length < 6) {
      setQrError('QR Code ID must be at least 6 characters');
      return false;
    }
    
    const exists = await checkQRCodeExists(qrCodeId);
    if (exists) {
      setQrError('QR Code ID already exists');
      return false;
    }
    
    setQrError('');
    return true;
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', parseFloat(position.coords.latitude.toFixed(6)));
        setValue('longitude', parseFloat(position.coords.longitude.toFixed(6)));
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter coordinates manually.');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const onSubmit = async (data: LocationForm) => {
    setIsSubmitting(true);
    clearErrors();

    try {
      const isValidQR = await validateQRCode(data.qrCodeId);
      if (!isValidQR) {
        setError('qrCodeId', { message: qrError });
        setIsSubmitting(false);
        return;
      }

      await createLocation(data);
      setGeneratedQR(data);
      reset();
    } catch (error) {
      console.error('Error creating location:', error);
      setError('root', { message: 'Failed to create location. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateUploadUrl = (qrCodeId: string) => {
    return `${window.location.origin}/upload/${qrCodeId}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
         <center> <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1></center>
          <center><p className="text-gray-700">Create new locations with GPS coordinates and generate QR codes for photo documentation</p></center>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Location Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Plus className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Add New Location</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  QR Code ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('qrCodeId', { 
                      required: 'QR Code ID is required',
                      minLength: { value: 6, message: 'Must be at least 6 characters' }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="e.g., NGMSC00083"
                  />
                  <Building className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.qrCodeId && (
                  <p className="mt-1 text-sm text-red-600">{errors.qrCodeId.message}</p>
                )}
                {qrError && (
                  <p className="mt-1 text-sm text-red-600">{qrError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Location Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('locationName', { required: 'Location name is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., BHUTESHWAR, BSA PULIYA"
                  />
                  <MapPin className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.locationName && (
                  <p className="mt-1 text-sm text-red-600">{errors.locationName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Area
                </label>
                <input
                  type="text"
                  {...register('area', { required: 'Area is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter area/district"
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Supervisor Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register('supervisorName', { required: 'Supervisor name is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., MOHIT SAINI"
                  />
                  <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.supervisorName && (
                  <p className="mt-1 text-sm text-red-600">{errors.supervisorName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Contact Number (WhatsApp)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    {...register('contactNumber', { 
                      required: 'Contact number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Enter a valid 10-digit phone number'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., 7017175994"
                  />
                  <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactNumber.message}</p>
                )}
              </div>

              {/* GPS Coordinates Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">GPS Coordinates</h3>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                  >
                    {gettingLocation ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Navigation className="h-4 w-4 mr-2" />
                        Get Current Location
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      {...register('latitude', { 
                        required: 'Latitude is required',
                        min: { value: -90, message: 'Latitude must be between -90 and 90' },
                        max: { value: 90, message: 'Latitude must be between -90 and 90' }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., 28.6139"
                    />
                    {errors.latitude && (
                      <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      {...register('longitude', { 
                        required: 'Longitude is required',
                        min: { value: -180, message: 'Longitude must be between -180 and 180' },
                        max: { value: 180, message: 'Longitude must be between -180 and 180' }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., 77.2090"
                    />
                    {errors.longitude && (
                      <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
                    )}
                  </div>
                </div>

                {watchedLatitude && watchedLongitude && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Preview:</strong> {watchedLatitude.toFixed(6)}, {watchedLongitude.toFixed(6)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      You can view this location on{' '}
                      <a
                        href={`https://www.google.com/maps?q=${watchedLatitude},${watchedLongitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-800"
                      >
                        Google Maps
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {errors.root && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.root.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-2" />
                    Create Location & Generate QR
                  </>
                )}
              </button>
            </form>
          </div>

          {/* QR Code Display */}
          <div>
            {generatedQR ? (
              <QRCodeDisplay
                qrCodeId={generatedQR.qrCodeId}
                locationName={generatedQR.locationName}
                area={generatedQR.area}
                supervisorName={generatedQR.supervisorName}
                contactNumber={generatedQR.contactNumber}
                uploadUrl={generateUploadUrl(generatedQR.qrCodeId)}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <Building className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>QR Code will appear here after creating a location</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;