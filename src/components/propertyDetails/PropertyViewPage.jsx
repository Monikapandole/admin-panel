import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PropertyViewPage = () => {
    const { id } = useParams();
    const property = useSelector((state) =>
        state.property.properties.find((p) => p.id === Number(id))
    );

    if (!property) {
        return <div className="p-6 text-red-500">Property not found.</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left: Scrollable Images */}
                <div className="md:col-span-2  overflow-y-auto border rounded p-2">
                    {property.photos && Array.from(property.photos).map((file, idx) => {
                        const isFile = file instanceof File;
                        const src = isFile ? URL.createObjectURL(file) : file; // file could be a URL string
                        return (
                            <img
                                key={idx}
                                src={src}
                                alt={`photo-${idx}`}
                                className="w-full mb-4 rounded shadow"
                            />
                        );
                    })}

                </div>

                {/* Right: Sticky Details */}
                <div className="sticky top-6 self-start bg-white border rounded p-4 shadow-md h-fit">
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
