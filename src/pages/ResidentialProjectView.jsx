import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResidentialProjectView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project;

  if (!project) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <button onClick={() => navigate(-1)} className="bg-blue-500 text-white px-4 py-2 rounded">Go Back</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 bg-gray-200 px-4 py-2 rounded">Back</button>
      <h2 className="text-3xl font-bold mb-6">{project.residential_name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Scrollable Images */}
        <div className="md:col-span-2 overflow-y-auto border rounded p-2 bg-white">
          {project.residential_images && project.residential_images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.residential_images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Project Image ${idx + 1}`}
                  className="w-full h-64 object-cover rounded shadow"
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-center py-12">No images available</div>
          )}
        </div>
        {/* Right: Sticky Details */}
        <div className="sticky top-6 self-start bg-white border rounded p-4 shadow-md h-fit">
          <h3 className="text-xl font-semibold mb-4">Project Overview</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Owner's Name:</strong> {project.owner_name}</p>
            <p><strong>Email:</strong> {project.owner_email}</p>
            <p><strong>Contact:</strong> {project.owner_contact}</p>
            <p><strong>Company:</strong> {project.company_name}</p>
            <p><strong>RERA Number:</strong> {project.rera_number}</p>
            <p><strong>Category:</strong> {project.category_name}</p>
            <p><strong>Area:</strong> {project.area_name}</p>
            <p><strong>Address:</strong> {project.residential_address}</p>
            <p><strong>City:</strong> {project.city}</p>
            <p><strong>State:</strong> {project.state}</p>
            <p><strong>Pincode:</strong> {project.pincode}</p>
            <p><strong>Total Area:</strong> {project.total_area} sq.ft.</p>
            <p><strong>Total Plots:</strong> {project.total_plots}</p>
            <p><strong>Facilities:</strong> {project.facilities}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Description:</strong> {project.description}</p>
            <div className="text-xs text-gray-500 mt-4">
              <div>Created At: {project.created_at ? new Date(project.created_at).toLocaleString() : '-'}</div>
              <div>Updated At: {project.updated_at ? new Date(project.updated_at).toLocaleString() : '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentialProjectView; 