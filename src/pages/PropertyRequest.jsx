import React, { useEffect, useState } from 'react';
import { fetchAllPropertyRequests } from '../Api/services/propertyService';
import { Loader } from '../Utils/Loader';
import { fetchAllProperties } from '../Api/services/propertyService';
import { getAllCategory } from '../Api/services/categoryService';



const getStatusLabel = (status) => {
  if (status === '0') return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">Pending</span>;
  if (status === '1') return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">Approved</span>;
  if (status === '2') return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-semibold">Rejected</span>;
  return status;
};

const PropertyRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getRequests = async () => {
      setLoading(true);
      try {
        const data = await fetchAllPropertyRequests();
        setRequests(data?.data || []);
        const [propertyRes, categoryRes] = await Promise.all([
          fetchAllProperties(),
          getAllCategory(),
        ]);
        setProperties(propertyRes?.data || []);
        setCategories(categoryRes?.data || []);
      } catch (err) {
        setError('Failed to fetch property requests');
      } finally {
        setLoading(false);
      }
    };
    getRequests();
  }, []);

  const handleViewDetails = (req) => {
    setSelectedRequest(req);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  const getPropertyName = (property_id) => {
    const prop = properties.find((p) => String(p.id) === String(property_id));
    console.log(prop.property_name, "prop.property_name", prop)
    return prop ? prop.property_name || prop.name || '-' : '-';
  };
  const getCategoryName = (category_id) => {
    const cat = categories.find((c) => String(c.id) === String(category_id));
    return cat ? cat.category_name || cat.name || '-' : '-';
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  if (showModal && selectedRequest) {
    const found = properties.find((p) => String(p.id) === String(selectedRequest.property_id));
    console.log({
      selectedRequest,
      property_id: selectedRequest.property_id,
      properties,
      foundProperty: found
    }, 'DEBUG-PROPERTY-NAME');
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Property Requests</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b font-semibold text-left text-gray-700">Request ID</th>
              <th className="px-6 py-3 border-b font-semibold text-left text-gray-700">Name</th>
              <th className="px-6 py-3 border-b font-semibold text-left text-gray-700">Phone</th>
              <th className="px-6 py-3 border-b font-semibold text-left text-gray-700">Purpose</th>
              <th className="px-6 py-3 border-b font-semibold text-left text-gray-700">Status</th>
              <th className="px-6 py-3 border-b font-semibold text-left text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">No property requests found.</td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.request_id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 border-b">{req.request_id}</td>
                  <td className="px-6 py-4 border-b">{req.name}</td>
                  <td className="px-6 py-4 border-b">{req.phone_number}</td>
                  <td className="px-6 py-4 border-b">{getStatusLabel(req.request_status)}</td>
                  <td className="px-6 py-4 border-b">{req.purpose}</td>

                  <td className="px-6 py-4 border-b">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded shadow text-xs font-semibold"
                      onClick={() => handleViewDetails(req)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for details */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative animate-fade-in mt-16 mb-16 border border-gray-200">
            <div className="flex justify-between items-center border-b px-6 py-4 rounded-t-2xl bg-gray-50">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">Request Details</h3>
              <button
                className="text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none transition-colors duration-150"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="px-4 py-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {selectedRequest.name}
                    {selectedRequest.request_status && (
                      <span className="ml-2">{getStatusLabel(selectedRequest.request_status)}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">Request ID: <span className="font-medium text-gray-700">{selectedRequest.request_id}</span></div>
                  {selectedRequest.property_id && (
                    <div className="text-sm text-gray-500 mt-1">Property ID: <span className="font-medium text-gray-700">{selectedRequest.property_id}</span></div>
                  )}
                  {selectedRequest.category_id && (
                    <div className="text-sm text-gray-500 mt-1">Category: <span className="font-medium text-gray-700">{getCategoryName(selectedRequest.category_id)}</span></div>
                  )}
                </div>
                <div className="flex flex-col md:items-end">
                  <div className="text-sm text-gray-500">User's Phone No:</div>
                  <div className="font-medium text-gray-700">{selectedRequest.phone_number || '-'}</div>
                </div>
              </div>

              <hr className="my-4" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                <div>
                  <div className="mb-3">
                    <span className="block text-xs text-gray-500 font-semibold mb-1">Requested At</span>
                    <span className="text-gray-800 font-medium text-sm">{selectedRequest.request_created_at || '-'}</span>
                  </div>
                  {selectedRequest.purpose && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">Purpose</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.purpose}</span>
                    </div>
                  )}
                  {selectedRequest.owner_name && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">Owner Name</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.owner_name}</span>
                    </div>
                  )}

                  {selectedRequest.address && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">Address</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.address}</span>
                    </div>
                  )}
                </div>
                <div>
                  {selectedRequest.price && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">Price</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.price}</span>
                    </div>
                  )}
                  {selectedRequest.availability_date && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">Available From</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.availability_date}</span>
                    </div>
                  )}
                  {selectedRequest.owner_contact && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">Owner Phone</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.owner_contact}</span>
                    </div>
                  )}
                  {selectedRequest.additional_detail && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">Additional Detail</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.additional_detail}</span>
                    </div>
                  )}
                </div>
                <div>
                  {selectedRequest.number_of_rooms && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">No. of Rooms</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.number_of_rooms}</span>
                    </div>
                  )}
                  {selectedRequest.square_footage && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">Square Foot</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.square_footage}</span>
                    </div>
                  )}
                  {selectedRequest.furnished && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">Furnished</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.furnished}</span>
                    </div>
                  )}
                  {selectedRequest.property_status && (
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500 font-semibold mb-1">Property Status</span>
                      <span className="text-gray-800 font-medium text-sm">{selectedRequest.property_status}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyRequest; 