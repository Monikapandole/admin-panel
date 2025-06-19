import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setProperties } from '../redux/propertySlice';
import { fetchAllProperties, deletePropertyAPI } from '../Api/services/propertyService';

const PropertyListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const properties = useSelector((state) => state.property.properties);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await fetchAllProperties();
                console.log(data, "data");
                dispatch(setProperties(data.data || []));
            } catch (error) {
                // handle error, e.g., show toast
                console.error('Failed to fetch properties', error);
            }
        };
        fetchProperties();
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        try {
            await deletePropertyAPI(id);
            // Option 1: Refetch the list
            const data = await fetchAllProperties();
            dispatch(setProperties(data.data || []));
            // Option 2: Remove from Redux store directly (uncomment if you prefer this)
            // dispatch(setProperties(properties.filter((p) => p.id !== id)));
        } catch (error) {
            alert('Failed to delete property.');
        }
    };

    return (
        <div className="p-6 pt-[80px]">
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
                                <td className="px-6 py-4">{property.owner_name}</td>
                                <td className="px-6 py-4">{property.owner_contact}</td>
                                <td className="px-6 py-4">{property.category_name}</td>
                                <td className="px-6 py-4">{property.address}</td>
                                <td className="px-6 py-4">{property.price}</td>
                                <td className="px-6 py-4 space-x-2">
                                    <button className="bg-yellow-400 px-3 py-1 rounded text-white hover:bg-yellow-500"
                                    onClick={() => navigate(`/edit-property/${property.id}`)}

                                    >
                                        Edit
                                    </button>
                                    <button className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                                        onClick={() => handleDelete(property.id)}
                                    >
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