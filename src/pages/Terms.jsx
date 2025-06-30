import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getTerms,
  saveTerms,
  deleteTerms,
} from "../Api/services/termsService";

const Terms = () => {
  const [terms, setTerms] = useState("");
  const [originalTerms, setOriginalTerms] = useState("");
  const [termsId, setTermsId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await getTerms();
      if (response.success && response.data) {
        setTerms(response.data.terms);
        setOriginalTerms(response.data.terms);
        setTermsId(response.data.id);
        setIsEditing(false);
      } else {
        setTerms("");
        setOriginalTerms("");
        setTermsId(null);
        setIsEditing(true);
      }
    } catch (error) {
      toast.error("Failed to fetch terms.");
    }
  };

  const handleSave = async () => {
    if (!terms.trim()) {
      toast.error("Terms cannot be empty.");
      return;
    }
    try {
      await saveTerms({ id: termsId, terms });
      toast.success("Terms saved successfully!");
      fetchTerms();
    } catch (error) {
      toast.error("Failed to save terms.");
    }
  };

  const handleDelete = async () => {
    if (!termsId) {
      toast.error("No terms to delete.");
      return;
    }
    try {
      await deleteTerms(termsId);
      toast.success("Terms deleted successfully!");
      setTerms("");
      setOriginalTerms("");
      setTermsId(null);
      setIsEditing(true);
    } catch (error) {
      toast.error("Failed to delete terms.");
    }
  };

  const handleCancel = () => {
    setTerms(originalTerms);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Terms</h1>
        {isEditing ? (
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg mb-4 h-64"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Enter your terms here..."
          />
        ) : (
          <div
            className="w-full p-4 border border-gray-200 bg-gray-50 rounded-lg mb-4 h-64 overflow-y-auto whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: terms }}
          />
        )}
        <div className="flex justify-end space-x-4">
          {termsId && !isEditing && (
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
            >
              Delete
            </button>
          )}
          {isEditing ? (
            <>
              {termsId && (
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
                Save Terms
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {termsId ? "Edit Terms" : "Create Terms"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terms; 