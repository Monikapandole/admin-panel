import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setProperties } from '../redux/propertySlice';
import { fetchAllProperties, deletePropertyAPI, updatePropertyOrderAPI } from '../Api/services/propertyService';
import { Loader } from "../Utils/Loader";
import { toast } from 'react-toastify';

const PropertyListPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const properties = useSelector((state) => state.property.properties);
    const [isLoading, setIsLoading] = useState(true);
    const [showOrderPopup, setShowOrderPopup] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [orderNumber, setOrderNumber] = useState('');
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await fetchAllProperties();
                console.log(data, "data");
                dispatch(setProperties(data.data || []));
            } catch (error) {
                console.error('Failed to fetch properties', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this property?')) return;
        try {
            await deletePropertyAPI(id);
            const data = await fetchAllProperties();
            dispatch(setProperties(data.data || []));
            toast.success('Property deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete property.');
        }
    };

    const handleOrderClick = (property) => {
        setSelectedProperty(property);
        setOrderNumber('');
        setShowOrderPopup(true);
    };

    const handleUpdateOrder = async () => {
        if (!orderNumber || orderNumber.trim() === '') {
            toast.warning('Please enter an order number');
            return;
        }

        setIsUpdatingOrder(true);
        try {
            await updatePropertyOrderAPI(selectedProperty.id, orderNumber);
            toast.success('Property order updated successfully!');
            setShowOrderPopup(false);
            setSelectedProperty(null);
            setOrderNumber('');
        } catch (error) {
            toast.error('Failed to update property order.');
        } finally {
            setIsUpdatingOrder(false);
        }
    };

    const handleCloseOrderPopup = () => {
        setShowOrderPopup(false);
        setSelectedProperty(null);
        setOrderNumber('');
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
                            {/* <th className="px-6 py-3 font-semibold">Address</th> */}
                            <th className="px-6 py-3 font-semibold">Price</th>
                            <th className="px-6 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="py-16 text-center">
                                    <Loader />
                                </td>
                            </tr>
                        ) : (
                            properties.map((property) => (
                                <tr key={property.id} className="border-t">
                                    <td className="px-6 py-4">{property.owner_name}</td>
                                    <td className="px-6 py-4">{property.owner_contact}</td>
                                    <td className="px-6 py-4">{property.category_name}</td>
                                    {/* <td className="px-6 py-4">{property.address}</td> */}
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
                                        <button
                                            className="bg-green-500 px-3 py-1 rounded text-white hover:bg-green-600"
                                            onClick={() => handleOrderClick(property)}
                                        >
                                            Order
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Popup Modal */}
            {showOrderPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Update Property Order</h3>
                            <button
                                onClick={handleCloseOrderPopup}
                                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                                Property: <span className="font-semibold">{selectedProperty?.address}</span>
                            </p>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order Number
                            </label>
                            <input
                                type="number"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter order number"
                                min="1"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCloseOrderPopup}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={isUpdatingOrder}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateOrder}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                                disabled={isUpdatingOrder}
                            >
                                {isUpdatingOrder ? 'Updating...' : 'Update Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyListPage;