'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { useImageUpload } from '@/hooks/use-image-upload';

export function ImageUpload({ value, onChange, disabled, onUploadingChange }) {
  // Use our custom hook
  const { isUploading, uploadImage, handleCancel } = useImageUpload({
    onUploadingChange,
  });

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use the hook's uploadImage function
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      onChange(imageUrl);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-40 h-40 border rounded-lg overflow-hidden">
        {value ? (
          <>
            <Image
              src={value}
              alt="Template image"
              fill
              className="object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background/90"
              onClick={() => onChange('')}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="image-upload"
          onChange={onFileChange}
          disabled={disabled || isUploading}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isUploading}
            onClick={() => document.getElementById('image-upload').click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Image'
            )}
          </Button>
          {isUploading && (
            <Button type="button" variant="destructive" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Maximum file size: 5MB</p>
      </div>
    </div>
  );
}
