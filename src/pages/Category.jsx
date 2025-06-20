import React, { useEffect, useState } from "react";
import icon1 from "../assets/react.svg";
import icon2 from "../assets/react.svg";
import { getAllCategory, addCategory } from "../Api/services/categoryService";
import { Loader } from "../Utils/Loader";
function Items() {
  const [items, setItems] = useState([
  ]);

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
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [loading, setLoading] = useState(false);

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

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddItem = async () => {
    const { name, image, description } = newItem;
    if (!name || !image || !description) return;
    try {
      setLoading(true);
      // Prepare image for API (convert preview URL to File if needed)
      let imageFile = image;
      if (typeof image === "string" && image.startsWith("blob:")) {
        // If image is a blob URL, try to get the File from the input
        const input = document.createElement('input');
        input.type = 'file';
        // Not possible to get the File from blob URL directly, so pass as empty string
        imageFile = "";
      }
      await addCategory({
        category_name: name,
        description,
        category_image: imageFile,
        status: "1",
      });
      setIsModalOpen(false);
      setNewItem({ name: "", image: "", description: "" });
      // Refresh categories
      const data = await getAllCategory();
      const categories = data?.data || data;
      setItems(
        categories.map((item, index) => ({
          id: item.id || index,
          name: item.category_name,
          image: item.category_image,
          description: item.description || "No description",
        }))
      );
    } catch (error) {
      alert("Failed to add category: " + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories on mount
useEffect(() => {
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategory();

      // Check if data exists and is a non-empty array
      const categories = data?.data || data;

      if (Array.isArray(categories) && categories.length > 0) {
        setItems(
          categories.map((item, index) => ({
            id: item.id || index,
            name: item.category_name,
            image: item.category_image,
            description: item.description || "No description",
          }))
        );
      } else {
        // Empty or invalid data
        setItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  fetchCategories();
}, []);

  return (
    <div className="p-6 pt-[80px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Category</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Category
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
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <Loader />
                </td>
              </tr>
            ) : items.map((item) => {
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
            <h3 className="text-lg font-semibold mb-4">Add Category</h3>
            {["name", "description"].map((field) => (
              <input
                key={field}
                type={"text"}
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
                  setNewItem({ ...newItem, image: imageUrl });
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

export default Items;
