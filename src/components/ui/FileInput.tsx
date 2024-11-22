import React, { useState } from "react";
import { Input } from "./input"; // Assuming you have the Shadcn Input component
import { Label } from "./label"; // Assuming you have a Label component from Shadcn UI
import { Button } from "./button"; // Assuming you have a Button component from Shadcn UI
import { Camera } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const VALID_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface FileInputProps {
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept: string;
  className?: string;
  isLoading?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({
  id,
  onChange,
  accept,
  className,
  isLoading,
}) => {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Validate the file type and size
      if (!VALID_FILE_TYPES.includes(file.type)) {
        setError(
          "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed."
        );
        setPreviewURL(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds the maximum limit of 10MB.");
        setPreviewURL(null);
        return;
      }

      // Clear previous errors and generate a preview URL
      setError(null);
      const previewUrl = URL.createObjectURL(file);
      setPreviewURL(previewUrl);

      // Pass the file to the parent component via the onChange callback
      onChange(event);
    }
  };

  return (
    <div
      className={`file-input-container ${className} flex flex-col justify-center items-center`}
    >
      {previewURL ? (
        <div className="mt-4 flex flex-col justify-center items-center ">
          <img
            src={previewURL}
            alt="Preview"
            className="mt-2 object-cover rounded-xl overflow-hidden w-full max-w-40 aspect-square"
          />
          <label
            htmlFor={isLoading ? "asdasd" : id}
            className="text-xs text-white text-center mt-2 cursor-pointer"
          >
            Change Image
          </label>
        </div>
      ) : (
        <Label
          htmlFor={id}
          className=" font-medium italic tracking-wider cursor-pointer border-4 border-white rounded-2xl w-32 aspect-square flex flex-col justify-center items-center"
        >
          <Camera size={80} className="text-malibanYellow" />
          <div className="flex flex-col justify-center items-center">
            <span className="text-white uppercase text-xs font-bold ">
              Upload a
            </span>
            <span className="text-white uppercase text-xs font-bold ">
              selfie
            </span>
          </div>
        </Label>
      )}
      <Input
        id={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="file-input hidden"
      />
      {error && (
        <p className="text-xs mt-2 font-semibold text-white italic">{error}</p>
      )}
    </div>
  );
};

export { FileInput };
