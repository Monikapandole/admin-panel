import React, { useState } from "react";

function Items() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Cozy Apartment",
      quantity: 1,
      price: 1200,
      category: "Apartment",
      unit: "month",
      description: "2BHK fully furnished apartment",
    },
    {
      id: 2,
      name: "Shared Room",
      quantity: 1,
      price: 500,
      category: "Shared Room",
      unit: "month",
      description: "Shared room in a central location",
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
    unit: "",
    description: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    price: "",
    category: "",
    unit: "",
    description: "",
  });

  const categories = [
    "Apartment",
    "Villa",
    "Studio",
    "Shared Room",
    "PG",
    "Office Space",
    "Co-living",
    "Hostel",
    "Furnished",
    "Unfurnished",
    "Luxury",
    "Budget",
    "Monthly Rental",
    "Short-Term Stay",
    "Long-Term Lease",
    "Pet Friendly",
    "Utilities Included",
    "Parking Included",
    "Near Public Transport",
  ];

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

  const handleAddItem = () => {
    const { name, quantity, price, category, unit, description } = newItem;
    if (!name || !quantity || !price || !category) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        name,
        quantity,
        price,
        category,
        unit,
        description,
      },
    ]);
    setNewItem({
      name: "",
      quantity: "",
      price: "",
      category: "",
      unit: "",
      description: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 pt-[80px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Items</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add Item
        </button>
      </div>

      <div className="rounded-[10px] overflow-auto border">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Quantity</th>
              <th className="text-left p-4">Unit</th>
              <th className="text-left p-4">Price ($)</th>
              <th className="text-left p-4">Category</th>
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
                        type="number"
                        value={editValues.quantity}
                        onChange={(e) =>
                          setEditValues({ ...editValues, quantity: e.target.value })
                        }
                        className="border p-1 w-full"
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValues.unit}
                        onChange={(e) =>
                          setEditValues({ ...editValues, unit: e.target.value })
                        }
                        className="border p-1 w-full"
                      />
                    ) : (
                      item.unit
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.price}
                        onChange={(e) =>
                          setEditValues({ ...editValues, price: e.target.value })
                        }
                        className="border p-1 w-full"
                      />
                    ) : (
                      item.price
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <select
                        value={editValues.category}
                        onChange={(e) =>
                          setEditValues({ ...editValues, category: e.target.value })
                        }
                        className="border p-1 w-full"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.category
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[400px]">
            <h3 className="text-lg font-semibold mb-4">Add Item</h3>
            {["name", "quantity", "unit", "price", "description"].map((field) => (
              <input
                key={field}
                type={field === "quantity" || field === "price" ? "number" : "text"}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newItem[field]}
                onChange={(e) =>
                  setNewItem({ ...newItem, [field]: e.target.value })
                }
                className="border p-2 w-full mb-2"
              />
            ))}
            <select
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="border p-2 w-full mb-4"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
    </div>
  );
}

export default Items;
