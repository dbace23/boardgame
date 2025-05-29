import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage'; 
import { Dialog } from '@radix-ui/react-dialog';

interface AvatarCropModalProps {
  file: File;
  onClose: () => void;
  onComplete: (blobUrl: string) => void;
}

const AvatarCropModal = ({ file, onClose, onComplete }: AvatarCropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleConfirm = async () => {
    setProcessing(true);
    const imageUrl = URL.createObjectURL(file);
    const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
    onComplete(croppedBlob);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg w-[90%] max-w-md">
          <div className="relative aspect-square w-full h-72">
            <Cropper
              image={URL.createObjectURL(file)}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button onClick={onClose} className="text-gray-600">Cancel</button>
            <button
              onClick={handleConfirm}
              disabled={processing}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              {processing ? 'Processing...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AvatarCropModal;
