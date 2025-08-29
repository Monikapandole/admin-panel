import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { updatePropertyImagesOrderAPI } from '../Api/services/propertyService';

const UpdateImageOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showOrderPopup, setShowOrderPopup] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [newOrder, setNewOrder] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const property = useSelector((state) =>
        state.property.properties.find((p) => p.id === Number(id))
    );
    console.log(property)

    if (!property) {
        return <div className="p-6 text-red-500">Property not found.</div>;
    }

    const propertyImages = property.property_images ? Array.from(property.property_images) : [];

    const getImageSrc = (file) => {
        const isFile = file instanceof File;
        return isFile ? URL.createObjectURL(file) : file;
    };

    const getImageName = (image) => {
        if (image instanceof File) {
            return image.name;
        } else if (typeof image === 'string' && image.includes('/')) {
            // Extract filename from URL
            const urlParts = image.split('/');
            return urlParts[urlParts.length - 1];
        } else {
            return image;
        }
    };

    const handlePreview = (image, index) => {
        // Get image name using the helper function
        const imageName = getImageName(image);
        setPreviewImage({ src: getImageSrc(image), index: index + 1, name: imageName });
        setShowPreview(true);
    };

    const handleUpdateOrder = (index) => {
        setSelectedImageIndex(index);
        setNewOrder('');
        setShowOrderPopup(true);
    };

    const handleSaveOrder = async () => {
        if (newOrder && !isNaN(newOrder)) {
            const orderNumber = parseInt(newOrder);
            setIsUpdating(true);
            try {
                // Since images might not have individual IDs, we'll use the image index + 1 as image_id
                // You may need to adjust this based on your actual data structure
                const imageId = selectedImageIndex + 1;
                const propertyId = id;

                const response = await updatePropertyImagesOrderAPI(imageId, propertyId, orderNumber);
                console.log('Image order updated successfully:', response);

                // Close popup after saving
                setShowOrderPopup(false);
                setSelectedImageIndex(null);
                setNewOrder('');

                // Optionally show success message or refresh data
                alert('Image order updated successfully!');
            } catch (error) {
                console.error('Error updating image order:', error);
                alert('Failed to update image order. Please try again.');
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const closePreview = () => {
        setShowPreview(false);
        setPreviewImage(null);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto mt-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold">Update Image Order</h2>
                <button
                    onClick={() => navigate(`/property/${id}`)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Back to Property
                </button>
            </div>

            {/* Image Order Table */}
            <div className="bg-white border rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Image Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Order
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {propertyImages.map((image, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={getImageSrc(image)}
                                            alt={`Property ${index + 1}`}
                                            className="w-14 h-14 object-cover rounded"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {getImageName(image)}
                                            </p>
                                            <p className="text-sm text-gray-500">Image {index + 1}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handlePreview(image, index)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                        >
                                            Preview
                                        </button>
                                        <button
                                            onClick={() => handleUpdateOrder(index)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                        >
                                            Update Order
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Update Order Popup */}
            {showOrderPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Update Image Order</h3>
                        <p className="text-gray-600 mb-4">
                            Enter new order number for image {selectedImageIndex + 1}
                        </p>
                        <input
                            type="number"
                            value={newOrder}
                            onChange={(e) => setNewOrder(e.target.value)}
                            placeholder="Enter order number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                            max={propertyImages.length}
                        />
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowOrderPopup(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveOrder}
                                disabled={isUpdating}
                                className={`px-4 py-2 rounded-md transition-colors ${isUpdating
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                    } text-white`}
                            >
                                {isUpdating ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-full p-4">
                        <button
                            onClick={closePreview}
                            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
                        >
                            ×
                        </button>
                        <div className="bg-white rounded-lg overflow-hidden">
                            <div className="p-4 bg-gray-100 border-b">
                                <h3 className="text-lg font-semibold">Image Preview - Image {previewImage.index}</h3>
                                <p className="text-sm text-gray-600 mt-1">{previewImage.name}</p>
                            </div>
                            <div className="p-4">
                                <img
                                    src={previewImage.src}
                                    alt={`Preview ${previewImage.index}`}
                                    className="w-full h-auto max-h-96 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateImageOrder;
