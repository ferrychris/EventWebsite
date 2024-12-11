import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { Image as ImageIcon, Trash2, AlertCircle, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

interface ImageUploaderProps {
  currentImage?: string;
  onImageChange: (file: File) => Promise<void>;
  onImageRemove?: () => void;
  title?: string;
  description?: string;
}

interface CropModalProps {
  image: string;
  onClose: () => void;
  onSave: (file: File) => void;
}

const CropModal: React.FC<CropModalProps> = ({ image, onClose, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { primaryColor } = useSelector((state: RootState) => state.theme);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0
  ): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Set width and height to desired output size
    canvas.width = 400;
    canvas.height = 400;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Enable better image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate scaling
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      400,
      400
    );

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        blob => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          // Create a new file with proper MIME type
          const file = new File([blob], 'cropped-image.jpg', { 
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(file);
        },
        'image/jpeg',
        1.0
      );
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsSaving(true);
    
    try {
      const croppedFile = await getCroppedImg(image, croppedAreaPixels);
      await onSave(croppedFile);
      onClose();
    } catch (e) {
      console.error('Error saving cropped image:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Crop Image</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative h-96 mb-4">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-sm text-gray-600">Zoom:</span>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-1/2"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ImageUploader({
  currentImage,
  onImageChange,
  onImageRemove,
  title = 'Upload Image',
  description = 'Upload a profile image'
}: ImageUploaderProps) {
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { primaryColor } = useSelector((state: RootState) => state.theme);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Create a local preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    multiple: false,
    disabled: isUploading,
    maxSize: 5 * 1024 * 1024 // 5MB max
  });

  const handleCroppedImage = async (croppedFile: File) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      await onImageChange(croppedFile);
      setShowCropModal(false);
      setTempImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100">
      <h2 className="text-xl font-bold flex items-center text-gray-900">
        <ImageIcon className="w-6 h-6 mr-3" style={{ color: primaryColor }} />
        {title}
      </h2>
      
      {uploadError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {uploadError}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${isDragActive ? 'border-current bg-blue-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{ borderColor: isDragActive ? primaryColor : undefined }}
      >
        {currentImage ? (
          <div className="relative">
            <div className="w-48 h-48 mx-auto overflow-hidden rounded-lg shadow-md">
              <img 
                src={currentImage}
                alt="Uploaded"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', currentImage);
                  setUploadError('Failed to load image');
                }}
              />
            </div>
            {onImageRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onImageRemove();
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-transform transform hover:scale-110"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div>
            <input {...getInputProps()} />
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{description}</p>
            <p className="text-sm text-gray-500">
              {isDragActive ? 
                'Drop the image here' : 
                'Drag and drop an image here, or click to select one'
              }
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Maximum file size: 5MB
            </p>
          </div>
        )}
      </div>

      {showCropModal && tempImage && (
        <CropModal
          image={tempImage}
          onClose={() => {
            setShowCropModal(false);
            setTempImage(null);
          }}
          onSave={handleCroppedImage}
        />
      )}
    </div>
  );
}