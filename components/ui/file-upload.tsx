"use client";

import * as React from "react"
import { cn } from "@/utils/cn"

export interface FileUploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  label?: string
  description?: string
  value?: File | null
  onChange?: (file: File | null) => void
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, label, description, value, onChange, ...props }, ref) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = React.useState(false);
    
    // Get file name from value prop if it exists
    const fileName = value?.name || null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      
      // Call the onChange callback with the file
      if (onChange) {
        onChange(file);
      }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        
        // Update the file input value
        if (fileInputRef.current) {
          // Create a DataTransfer object to set the files property
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
        }
        
        // Call the onChange callback with the file
        if (onChange) {
          onChange(file);
        }
      }
    };
    
    // Clear the file when the component unmounts or when value is set to null
    React.useEffect(() => {
      if (value === null && fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, [value]);
    
    return (
      <div className="space-y-2">
        {label && <div className="text-sm font-medium text-gray-900">{label}</div>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
        <label 
          className={cn(
            "flex min-h-24 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed",
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50",
            "px-6 py-4 text-center transition-colors hover:bg-gray-100",
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 h-6 w-6 text-gray-500">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            {fileName ? (
              <div className="text-sm font-medium text-gray-900">{fileName}</div>
            ) : (
              <>
                <div className="text-sm font-medium text-gray-900">Click to upload or drag and drop</div>
                <div className="text-xs text-gray-500">{props.accept ? `Accepted formats: ${props.accept.replace(/\./g, '').toUpperCase()}` : "SVG, PNG, JPG or PDF (max. 10MB)"}</div>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="sr-only" 
            ref={(node) => {
              // Handle both refs
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              fileInputRef.current = node;
            }}
            onChange={handleChange}
            {...props} 
          />
        </label>
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

export { FileUpload }
