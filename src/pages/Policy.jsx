import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getPolicy,
  savePolicy,
  deletePolicy,
} from "../Api/services/policyService";

const Policy = () => {
  const [policy, setPolicy] = useState("");
  const [originalPolicy, setOriginalPolicy] = useState("");
  const [policyId, setPolicyId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      const response = await getPolicy();
      if (response.success && response.data) {
        setPolicy(response.data.policy);
        setOriginalPolicy(response.data.policy);
        setPolicyId(response.data.id);
        setIsEditing(false);
      } else {
        setPolicy("");
        setOriginalPolicy("");
        setPolicyId(null);
        setIsEditing(true);
      }
    } catch (error) {
      toast.error("Failed to fetch policy.");
    }
  };

  const handleSave = async () => {
    if (!policy.trim()) {
      toast.error("Policy cannot be empty.");
      return;
    }
    try {
      await savePolicy({ id: policyId, policy });
      toast.success("Policy saved successfully!");
      fetchPolicy();
    } catch (error) {
      toast.error("Failed to save policy.");
    }
  };

  const handleDelete = async () => {
    if (!policyId) {
      toast.error("No policy to delete.");
      return;
    }
    try {
      await deletePolicy(policyId);
      toast.success("Policy deleted successfully!");
      setPolicy("");
      setOriginalPolicy("");
      setPolicyId(null);
      setIsEditing(true);
    } catch (error) {
      toast.error("Failed to delete policy.");
    }
  };

  const handleCancel = () => {
    setPolicy(originalPolicy);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Policy</h1>
        {isEditing ? (
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 h-64"
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            placeholder="Enter your policy here..."
          />
        ) : (
          <div
            className="w-full p-4 border border-gray-200 bg-gray-50 rounded-lg mb-4 h-64 overflow-y-auto whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: policy }}
          />
        )}
        <div className="flex justify-end space-x-4">
          {policyId && !isEditing && (
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
            >
              Delete
            </button>
          )}
          {isEditing ? (
            <>
              {policyId && (
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
              >
                Save Policy
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {policyId ? "Edit Policy" : "Create Policy"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Policy; 