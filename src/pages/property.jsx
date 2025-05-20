import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';

const PropertyListPage = () => {
    const navigate = useNavigate();
    const properties = useSelector((state) => state.property.properties);
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Properties</h2>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => navigate("/add-property")}
                >
                    + Add Property
                </button>
            </div>
            <div className="overflow-x-auto border rounded">
                <table className="min-w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Owner</th>
                            <th className="px-6 py-3 font-semibold">Mobile</th>
                            <th className="px-6 py-3 font-semibold">Type</th>
                            <th className="px-6 py-3 font-semibold">Address</th>
                            <th className="px-6 py-3 font-semibold">Price</th>
                            <th className="px-6 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property) => (
                            <tr key={property.id} className="border-t">
                                <td className="px-6 py-4">{property.owner}</td>
                                <td className="px-6 py-4">{property.mobile}</td>
                                <td className="px-6 py-4">{property.type}</td>
                                <td className="px-6 py-4">{property.address}</td>
                                <td className="px-6 py-4">{property.price}</td>
                                <td className="px-6 py-4 space-x-2">
                                    <button className="bg-yellow-400 px-3 py-1 rounded text-white hover:bg-yellow-500"
                                    onClick={() => navigate(`/edit-property/${property.id}`)}

                                    >
                                        Edit
                                    </button>
                                    <button className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600">
                                        Delete
                                    </button>
                                    <button
                                        className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600"
                                        onClick={() => navigate(`/property/${property.id}`)}
                                    >
                                        View
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PropertyListPage;