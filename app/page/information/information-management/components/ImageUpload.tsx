// ImageUpload.tsx
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onFilesUpload: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFilesUpload }) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 3) {
        alert("You can only upload up to 3 images at a time.");
        return;
      }
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(newPreviews);
      onFilesUpload(acceptedFiles);
    },
    [onFilesUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // accept: "image/*",
    multiple: true,
  });

  return (
    <div 
      {...getRootProps()}
      style={{margin:"10px 0 0 10px ",
        border: "1px dashed gray",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <input {...getInputProps()} />
      {previews.length > 0 ? (
        <div>
          {previews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt={`Preview ${index + 1}`}
              style={{ maxWidth: "100%", maxHeight: "150px", margin: "10px" }}
            />
          ))}
        </div>
      ) : (
        <p>Drag 'n' drop up to 3 images here, or click to select them</p>
      )}
    </div>
  );
};

export default ImageUpload;
