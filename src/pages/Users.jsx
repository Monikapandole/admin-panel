import React, { useState } from "react";

function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      number: "123-456-7890",
      address: "123 Main St, Springfield",
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      number: "987-654-3210",
      address: "456 Elm St, Metropolis",
    },
  ]);

  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
  });

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      number: user.number,
      address: user.address,
    });
  };

  const handleSave = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              name: editForm.name,
              email: editForm.email,
              number: editForm.number,
              address: editForm.address,
            }
          : u
      )
    );
    setEditingUserId(null);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleAddUser = () => {
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.number ||
      !newUser.address
    )
      return;

    setUsers([...users, { id: Date.now(), ...newUser }]);
    setNewUser({ name: "", email: "", number: "", address: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 mx-auto pt-[80px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add User
        </button>
      </div>

      <div className="rounded-[10px] overflow-hidden border">
        <table className="w-full ">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Number</th>
              <th className="text-left p-4">Address</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isEditing = editingUserId === user.id;
              return (
                <tr key={user.id} className="border-t">
                  <td className="p-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="border p-1 w-full"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="border p-1 w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.number}
                        onChange={(e) =>
                          setEditForm({ ...editForm, number: e.target.value })
                        }
                        className="border p-1 w-full"
                      />
                    ) : (
                      user.number
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) =>
                          setEditForm({ ...editForm, address: e.target.value })
                        }
                        className="border p-1 w-full"
                      />
                    ) : (
                      user.address
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <button
                        onClick={() => handleSave(user.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
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
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Add User</h3>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, name: e.target.value }))
              }
              className="border p-2 w-full mb-3"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, email: e.target.value }))
              }
              className="border p-2 w-full mb-3"
            />
            <input
              type="text"
              placeholder="Number"
              value={newUser.number}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, number: e.target.value }))
              }
              className="border p-2 w-full mb-3"
            />
            <input
              type="text"
              placeholder="Address"
              value={newUser.address}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, address: e.target.value }))
              }
              className="border p-2 w-full mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mr-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
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

export default Users;
