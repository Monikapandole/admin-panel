import React, { useEffect, useState } from "react";
import { fetchAllBlogs, addBlog, editBlog, deleteBlog } from "../Api/services/blogService";
import { Loader } from "../Utils/Loader";
import ImageUploader from "../Utils/ImageUploader"; // Assuming you have this for image uploads

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", content: "", featured_image: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", content: "", featured_image: null });
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState('');

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const data = await fetchAllBlogs();
      const blogsData = data?.data || data;
      if (Array.isArray(blogsData)) {
        setBlogs(blogsData);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValues({ title: item.title, content: item.content, featured_image: null });
    setPreviewImage(`${item.featured_image}`);
  };

  const handleSave = async (id) => {
    try {
      setLoading(true);
      await editBlog({ id, ...editValues });
      setEditingId(null);
      setPreviewImage(null);
      await loadBlogs();
    } catch (error) {
      alert("Failed to update blog: " + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
        try {
            setLoading(true);
            await deleteBlog(id);
            await loadBlogs();
          } catch (error) {
            alert("Failed to delete blog: " + (error?.response?.data?.message || error.message));
          } finally {
            setLoading(false);
          }
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.content) return;
    try {
      setLoading(true);
      await addBlog(newItem);
      setIsModalOpen(false);
      setNewItem({ title: "", content: "", featured_image: null });
      setPreviewImage(null);
      await loadBlogs();
    } catch (error) {
      alert("Failed to add blog: " + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const onFileSelect = (e, files) => {
    const file = files[0];
    if (editingId) {
      setEditValues(prev => ({ ...prev, featured_image: file }));
    } else {
      setNewItem(prev => ({ ...prev, featured_image: file }));
    }
    setPreviewImage(URL.createObjectURL(file));
  };
  
  const handleImageClick = (imageUrl) => {
    setPopupImage(imageUrl);
    setIsImagePopupOpen(true);
  };

  const openModal = () => {
    setNewItem({ title: "", content: "", featured_image: null });
    setPreviewImage(null);
    setIsModalOpen(true);
  }

  return (
    <div className="p-6 pt-[80px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Blogs</h2>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Blog
        </button>
      </div>

      <div className="rounded-[10px] overflow-auto border">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Content</th>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  <Loader />
                </td>
              </tr>
            ) : (
              blogs.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">{item.id}</td>
                    <td className="p-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.title}
                          onChange={(e) =>
                            setEditValues({ ...editValues, title: e.target.value })
                          }
                          className="border p-1 w-full"
                        />
                      ) : (
                        item.title
                      )}
                    </td>
                    <td className="p-4 max-w-xs truncate">
                      {isEditing ? (
                        <textarea
                          value={editValues.content}
                          onChange={(e) => setEditValues({ ...editValues, content: e.target.value })}
                          className="border p-1 w-full"
                        />
                      ) : (
                        item.content
                      )}
                    </td>
                    <td className="p-4">
                    {isEditing ? (
                        <div>
                           <ImageUploader handleChange={onFileSelect} />
                           {previewImage && <img src={previewImage} alt="preview" className="w-20 h-20 mt-2" />}
                        </div>
                    ) : (
                        item.featured_image ? (
                        <div>
                          <span className="break-all">{item.featured_image.split('/').pop()}</span>
                          <button
                            onClick={() => handleImageClick(item.featured_image)}
                            className="bg-blue-500 text-white px-3 py-1 rounded mt-2 block"
                          >
                            Preview
                          </button>
                        </div>
                        ) : 'No Image'
                    )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(item.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {setEditingId(null); setPreviewImage(null);}}
                            className="bg-gray-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Edit
                          </button>
                        </>
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
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-lg font-bold mb-4">Add New Blog</h3>
            <input
              type="text"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              placeholder="Blog Title"
              className="border p-2 w-full mb-4"
            />
            <textarea
              value={newItem.content}
              onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
              placeholder="Blog Content"
              className="border p-2 w-full mb-4"
            />
            <ImageUploader handleChange={onFileSelect} />
            {previewImage && <img src={previewImage} alt="preview" className="w-20 h-20 mt-2" />}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {setIsModalOpen(false); setPreviewImage(null);}}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {isImagePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-[90%] max-w-md">
            <img
              src={popupImage}
              alt="Preview"
              className="w-full h-auto object-contain rounded"
            />
            <div className="text-right mt-2">
              <button
                onClick={() => setIsImagePopupOpen(false)}
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

export default Blog; 