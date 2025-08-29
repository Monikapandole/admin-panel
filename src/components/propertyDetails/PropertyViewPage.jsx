import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PropertyViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const property = useSelector((state) =>
        state.property.properties.find((p) => p.id === Number(id))
    );

    if (!property) {
        return <div className="p-6 text-red-500">Property not found.</div>;
    }

    const propertyImages = property.property_images ? Array.from(property.property_images) : [];
    const totalImages = propertyImages.length;

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === totalImages - 1 ? 0 : prevIndex + 1
        );
    };

    const previousImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? totalImages - 1 : prevIndex - 1
        );
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    const getImageSrc = (file) => {
        const isFile = file instanceof File;
        return isFile ? URL.createObjectURL(file) : file;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto mt-10">
            <div className='flex flex-row justify-between py-2'>
                <h2 className="text-3xl font-bold mb-6">Property Details</h2>
                <button
                    onClick={() => navigate(`/update-image-order/${id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-0 rounded-lg transition-colors text-lg font-semibold h-14"
                >
                    Update Image Order
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left: Image Slider */}
                <div className="md:col-span-2 border rounded p-2 h-fit">
                    {totalImages > 0 ? (
                        <div className="relative">
                            {/* Pagination Indicator */}
                            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                                {currentImageIndex + 1}/{totalImages}
                            </div>

                            {/* Main Image */}
                            <div className="relative">
                                <img
                                    src={getImageSrc(propertyImages[currentImageIndex])}
                                    alt={`Property ${currentImageIndex + 1}`}
                                    className="w-full h-96 object-cover rounded shadow"
                                />

                                {/* Navigation Buttons */}
                                {totalImages > 1 && (
                                    <>
                                        <button
                                            onClick={previousImage}
                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Navigation */}
                            {totalImages > 1 && (
                                <div className="flex justify-center gap-2 mt-4 overflow-x-auto pb-2">
                                    {propertyImages.map((file, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => goToImage(idx)}
                                            className={`flex-shrink-0 ${idx === currentImageIndex
                                                ? 'ring-2 ring-blue-500'
                                                : 'ring-1 ring-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={getImageSrc(file)}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-96 bg-gray-100 rounded flex items-center justify-center">
                            <p className="text-gray-500">No images available</p>
                        </div>
                    )}
                </div>

                {/* Right: Sticky Details */}
                <div className="sticky top-6 self-start bg-white border rounded p-4 py-6 shadow-md h-fit min-h-[30rem]">
                    <h3 className="text-xl font-semibold mb-4">Overview</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                        <p><strong>Owner's Name :</strong> {property.owner}</p>
                        <p><strong>Mobile Number:</strong> {property.mobile}</p>
                        <p><strong>Property Type :</strong> {property.type}</p>
                        <p><strong>Address:</strong> {property.address}</p>
                        <p><strong>Purpose:</strong> {property.purpose}</p>
                        <p><strong>Furnished:</strong> {property.furnished}</p>
                        <p><strong>Number of Rooms:</strong> {property.rooms}</p>
                        <p><strong>Square Footage:</strong> {property.sqft}</p>
                        {property.bathroomImage && property.bathroomImage[0] && (
                            <div>
                                <p><strong>Bathroom Image:</strong></p>
                                <img
                                    src={property.bathroomImage[0] instanceof File
                                        ? URL.createObjectURL(property.bathroomImage[0])
                                        : property.bathroomImage[0]}
                                    alt="Bathroom"
                                    className="w-full mb-4 rounded shadow"
                                />
                            </div>
                        )}
                        <p><strong>Price:</strong> ₹{property.price}</p>
                        <p><strong>Description:</strong> {property.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyViewPage;
