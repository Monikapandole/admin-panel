import { useState, useEffect } from "react";
import { Upload } from "lucide-react"; // Optional: for upload icon

function ImageUploader({ inputClass, errorClass, errors, handleChange, existingPhotos }) {
    const [previews, setPreviews] = useState([]);
  
    useEffect(() => {
      if (existingPhotos) {
        const urls = existingPhotos.map((file) => URL.createObjectURL(file));
        setPreviews(urls);
      }
    }, [existingPhotos]);
  
    const validateFiles = (files) => {
      const validFiles = [];
      const validTypes = ['image/jpeg', 'image/png'];
  
      for (const file of files) {
        if (!validTypes.includes(file.type)) {
          alert(`File ${file.name} is not a valid type. Only JPEG and PNG are allowed.`);
          continue;
        }
        validFiles.push(file);
      }
  
      return validFiles;
    };
  
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files);
      const validFiles = validateFiles(files);
  
      // Create preview URLs for valid files
      const previewURLs = validFiles.map((file) => URL.createObjectURL(file));
  
      // Combine and limit
      const newPreviews = [...previews, ...previewURLs].slice(0, 8);
      setPreviews(newPreviews);
  
      // Pass only the valid files to parent
      handleChange(e, validFiles);
    };
  
    return (
      <div className="col-span-full">
        <label htmlFor="photos" className="block text-sm font-medium mb-2">Upload Photos</label>
  
        <input
          id="photos"
          name="photos"
          type="file"
          accept="image/png, image/jpeg"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
  
        <div className="border rounded-md p-4 mt-4 border-[1px] border-b-4 border-black">
          {previews.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="w-full aspect-[9/16] bg-gray-200 flex items-center justify-center border"
                >
                  <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
  
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
            <span>{previews.length} / 8</span>
            <label htmlFor="photos" className="cursor-pointer flex items-center gap-1 text-blue-600 hover:underline">
              <Upload className="w-4 h-4" />
              Upload
            </label>
          </div>
        </div>
  
        {errors.photos && <div className={errorClass}>{errors.photos}</div>}
      </div>
    );
  }
  

export default ImageUploader;
