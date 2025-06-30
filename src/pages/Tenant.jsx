import React, { useEffect, useState } from "react";
import { fetchTenants, addTenant, editTenant, deleteTenant } from "../Api/services/userServices";
import { Loader } from "../Utils/Loader";

function Tenant() {
  const [tenants, setTenants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ name: "", status: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  const loadTenants = async () => {
    setLoading(true);
    try {
      const data = await fetchTenants();
      const tenantsData = data?.data || data;
      if (Array.isArray(tenantsData)) {
        setTenants(tenantsData);
      } else {
        setTenants([]);
      }
    } catch (error) {
      console.error("Failed to fetch tenants:", error);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditValues({ name: item.name, status: item.status });
  };

  const handleSave = async (id) => {
    try {
      setLoading(true);
      await editTenant({ id, ...editValues });
      setEditingId(null);
      await loadTenants();
    } catch (error) {
      alert("Failed to update tenant: " + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
        try {
            setLoading(true);
            await deleteTenant(id);
            await loadTenants();
          } catch (error) {
            alert("Failed to delete tenant: " + (error?.response?.data?.message || error.message));
          } finally {
            setLoading(false);
          }
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name) return;
    try {
      setLoading(true);
      await addTenant({ name: newItem.name });
      setIsModalOpen(false);
      setNewItem({ name: "" });
      await loadTenants();
    } catch (error) {
      alert("Failed to add tenant: " + (error?.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 pt-[80px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tenants</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Tenant
        </button>
      </div>

      <div className="rounded-[10px] overflow-auto border">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  <Loader />
                </td>
              </tr>
            ) : (
              tenants.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">{item.id}</td>
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
                    <td className="p-4">
                      {isEditing ? (
                        <select
                            value={editValues.status}
                            onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                            className="border p-1 w-full"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-white text-sm ${item.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {item.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
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
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Add New Tenant</h3>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Tenant Name"
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
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
    </div>
  );
}

export default Tenant; 