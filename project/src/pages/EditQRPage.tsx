import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLocationByQRCode, updateLocation } from '../services/firebaseService';
import { Location } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const EditQRPage: React.FC = () => {
  const { qrCodeId } = useParams<{ qrCodeId: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Location>>({});
  const [docId, setDocId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (qrCodeId) {
        try {
          const data = await getLocationByQRCode(qrCodeId);
          if (data) {
            setLocation(data);
            setFormData(data);
            setDocId(data.id);
          } else {
            alert('Location not found!');
            navigate('/map'); // Redirect if not found
          }
        } catch (error) {
          console.error('Error fetching location:', error);
          alert('Error fetching location data.');
          navigate('/map');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchLocation();
  }, [qrCodeId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (docId && location) {
      try {
        await updateLocation(docId, formData);
        alert('Location updated successfully!');
        navigate('/map'); // Go back to map page after update
      } catch (error) {
        console.error('Error updating location:', error);
        alert('Failed to update location.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading QR data..." />
      </div>
    );
  }

  if (!location) {
    return <div className="text-center py-8">No QR data found for this ID.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit QR Code: {qrCodeId}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="locationName" className="block text-sm font-medium text-gray-700">Location Name</label>
            <input
              type="text"
              name="locationName"
              id="locationName"
              value={formData.locationName || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area</label>
            <input
              type="text"
              name="area"
              id="area"
              value={formData.area || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="supervisorName" className="block text-sm font-medium text-gray-700">Supervisor Name</label>
            <input
              type="text"
              name="supervisorName"
              id="supervisorName"
              value={formData.supervisorName || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              id="contactNumber"
              value={formData.contactNumber || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              name="latitude"
              id="latitude"
              value={formData.latitude || ''}
              onChange={handleChange}
              step="any"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              name="longitude"
              id="longitude"
              value={formData.longitude || ''}
              onChange={handleChange}
              step="any"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            />
          </div>
          {/* Add more fields as necessary, e.g., photos */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/map')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQRPage;