export interface Location {
  id: string;
  qrCodeId: string;
  locationName: string;
  area: string;
  supervisorName: string;
  contactNumber: string;
  latitude: number;
  longitude: number;
  createdAt: Date | { toDate: () => Date };
  beforePhoto?: {
    url: string;
    uploadedAt: Date;
  };
  afterPhoto?: {
    url: string;
    uploadedAt: Date;
  };
}

export interface PhotoUpload {
  file: File;
  type: 'before' | 'after';
}