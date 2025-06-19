import React, { useState, useEffect } from "react";
import icon1 from "../assets/react.svg";
import icon2 from "../assets/react.svg";
import { fetchAllAreas, deleteArea, addArea } from "../Api/services/areaService";
import { toast } from 'react-toastify';

function Area() {
  const [items, setItems] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    image: "",
    description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    image: "",
    description: "",
    lat: "",
    log: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await fetchAllAreas();
        // Adjust this if the API response structure is different
        setItems(data.data || []);
      } catch (error) {
        // Optionally handle error
        setItems([]);
      }
    };
    fetchAreas();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValues({ ...item });
  };

  const handleSave = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...editValues } : item))
    );
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteArea(id);
      setItems(items.filter((item) => item.id !== id));
      toast.success('Area deleted successfully!');
    } catch (error) {
      console.log(error, "error");
      toast.error('Failed to delete area.');
    }
  };

  const handleAddItem = async () => {
    const { name, image, description, lat, log } = newItem;
    if (!name || !image || !description || !lat || !log) return;
    try {
      // image is a preview URL, need to keep the file
      const area_image = newItem.imageFile;
      const res = await addArea({ name, description, lat, log, area_image });
      const data = await fetchAllAreas();
      setItems(data.data || []);
      toast.success('Area added successfully!');
      setNewItem({
        name: "",
        image: "",
        description: "",
        lat: "",
        log: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to add area.');
    }
  };

  return (
    <div className="p-6 pt-[80px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Serviceable Areas</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add New Location
        </button>
      </div>

      <div className="rounded-[10px] overflow-auto border">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Description</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <tr key={item.id} className="border-t">
                  <td className="p-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) =>
                          setEditValues({ ...editValues, name: e.target.value })
                        }
                        className="border p-1 w-full"
                      />
                    ) : (
                      item.name
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setEditValues({ ...editValues, image: imageUrl });
                          }
                        }}
                        className="border p-1 w-full"
                      />
                    ) : (
                      <>
                        {item.image ? (
                          <>
                            <p className="text-sm text-gray-700">
                              {item.image.split("/").pop()}
                            </p>
                            <button
                              onClick={() => {
                                setPreviewImage(item.image);
                                setIsPreviewOpen(true);
                              }}
                              className="mt-1 bg-blue-500 text-white px-2 py-1 rounded text-sm"
                            >
                              Preview
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 italic">No Image</span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValues.description}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            description: e.target.value,
                          })
                        }
                        className="border p-1 w-full"
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(item.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h3 className="text-lg font-semibold mb-4"> Add New Location</h3>
            {['name', 'description', 'lat', 'log'].map((field) => (
              <input
                key={field}
                type={field === 'lat' || field === 'log' ? 'number' : 'text'}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newItem[field]}
                onChange={(e) =>
                  setNewItem({ ...newItem, [field]: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
            ))}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setNewItem({ ...newItem, image: imageUrl, imageFile: file });
                }
              }}
              className="border p-2 w-full mb-2"
            />
            {newItem.image && (
              <img
                src={newItem.image}
                alt="Preview"
                className="w-full h-40 object-cover mb-2 rounded"
              />
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mr-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-[90%] max-w-md">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto object-contain rounded"
            />
            <div className="text-right mt-2">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Area;
