import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Location, PhotoUpload } from '../types';

export const createLocation = async (locationData: Omit<Location, 'id' | 'createdAt' | 'beforePhoto' | 'afterPhoto'>) => {
  try {
    const docRef = await addDoc(collection(db, 'locations'), {
      qrCodeId: locationData.qrCodeId,
      locationName: locationData.locationName,
      area: locationData.area,
      supervisorName: locationData.supervisorName,
      contactNumber: locationData.contactNumber,
      locationType: locationData.locationType,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
};

export const getLocationById = async (id: string): Promise<Location | null> => {
  try {
    const docRef = doc(db, 'locations', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate()
      } as Location;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching location by ID:', error);
    throw error;
  }
};

export const getLocationByQRCode = async (qrCodeId: string): Promise<Location | null> => {
  try {
    console.log('firebaseService: Attempting to fetch location by QR Code ID:', qrCodeId);
    const q = query(collection(db, 'locations'), where('qrCodeId', '==', qrCodeId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('firebaseService: No location found for QR Code ID:', qrCodeId);

      return null;
    }
    
    const doc = querySnapshot.docs[0];
    console.log('firebaseService: Found location for QR Code ID:', qrCodeId, 'with document ID:', doc.id);
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Location;
  } catch (error) {
    console.error('firebaseService: Error fetching location by QR Code:', error);
    throw error;
  }
};

export const getAllLocations = async (): Promise<Location[]> => {
  try {
    const q = query(collection(db, 'locations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Location[];
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const uploadPhoto = async (locationId: string, photo: PhotoUpload): Promise<string> => {
  try {
    const timestamp = Date.now();
    const fileName = `${locationId}/${photo.type}_${timestamp}_${photo.file.name}`;
    const storageRef = ref(storage, `photos/${fileName}`);
    
    await uploadBytes(storageRef, photo.file);
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update the location document with the photo URL
    const locationRef = doc(db, 'locations', locationId);
    const updateData = {
      [`${photo.type}Photo`]: {
        url: downloadURL,
        uploadedAt: new Date()
      }
    };
    
    await updateDoc(locationRef, updateData);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }
};

export const updateLocation = async (id: string, data: Partial<Location>) => {
  try {
    console.log('firebaseService: Attempting to update location with ID:', id, 'and data:', data);
    const locationRef = doc(db, 'locations', id);
    await updateDoc(locationRef, data);
    console.log('firebaseService: Location updated successfully for ID:', id);
  } catch (error) {
    console.error('firebaseService: Error updating location:', error);
    throw error;
  }
};

export const deleteLocation = async (id: string) => {
  try {
    console.log('firebaseService: Attempting to delete location with ID:', id);
    await deleteDoc(doc(db, 'locations', id));
    console.log('firebaseService: Location deleted successfully for ID:', id);
  } catch (error) {
    console.error('firebaseService: Error deleting location:', error);
    throw error;
  }
};

export const checkQRCodeExists = async (qrCodeId: string): Promise<boolean> => {
  try {
    const q = query(collection(db, 'locations'), where('qrCodeId', '==', qrCodeId));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking QR code:', error);
    return false;
  }
};