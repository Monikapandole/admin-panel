import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react"; // Add X for cross icon

function ImageUploader({ inputClass, errorClass, errors = {}, handleChange, selectedImages = [], existingImages = [], onRemoveImage }) {
    const [previews, setPreviews] = useState([]);
    const [previewTypes, setPreviewTypes] = useState([]); // 'existing' or 'new'
  
    useEffect(() => {
        let newPreviews = [];
        let newTypes = [];
        if (existingImages && existingImages.length > 0) {
            existingImages.forEach((img) => {
                newPreviews.push(img.url || img.image_url || img);
                newTypes.push('existing');
            });
        }
        if (selectedImages && selectedImages.length > 0) {
            selectedImages.forEach((file) => {
                newPreviews.push(URL.createObjectURL(file));
                newTypes.push('new');
            });
        }
        setPreviews(newPreviews);
        setPreviewTypes(newTypes);
        // Cleanup for new uploads
        return () => {
            if (selectedImages && selectedImages.length > 0) {
                selectedImages.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
            }
        };
    }, [selectedImages, existingImages]);
  
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
                  className="relative w-full aspect-[9/16] bg-gray-200 flex items-center justify-center border"
                >
                  <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  {onRemoveImage && (
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-red-200"
                      onClick={() => onRemoveImage(i, previewTypes[i])}
                      tabIndex={-1}
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  )}
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
