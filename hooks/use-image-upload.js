'use client';

import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function useImageUpload(options = {}) {
  const { onSuccess, onUploadingChange } = options;

  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const abortController = useRef(null);

  const handleCancel = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Image size must be less than 5MB',
      });
      return null;
    }

    try {
      setIsUploading(true);
      onUploadingChange?.(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      abortController.current = new AbortController();

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          signal: abortController.current.signal,
        }
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      onSuccess?.(data.secure_url);

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });

      return data.secure_url;
    } catch (error) {
      if (error.name === 'AbortError') {
        toast({
          description: 'Upload cancelled',
        });
      } else {
        console.error('Upload failed:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to upload image',
        });
      }
      return null;
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
      abortController.current = null;
    }
  };

  return {
    isUploading,
    uploadImage,
    handleCancel,
    MAX_FILE_SIZE,
  };
}
