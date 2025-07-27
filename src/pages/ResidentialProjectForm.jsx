import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addResidentialProjectAPI, editResidentialProjectAPI, uploadResidentialImagesAPI } from "../Api/services/residentialProjectService";
import { getAllCategory } from "../Api/services/categoryService";
import StepIndicator from "../Utils/StepIndicator";
import ImageUploader from "../Utils/ImageUploader";
import { TextField, Select, MenuItem, Button, Typography, Box, FormControl, InputLabel } from "@mui/material";
import { deleteResidentialImageAPI } from "../Api/services/residentialProjectService";

const initialState = {
  residential_id: "",
  owner_name: "",
  owner_email: "",
  owner_contact: "",
  owner_image: null,
  company_name: "",
  rera_number: "",
  area_id: "",
  category_id: "",
  residential_name: "",
  residential_address: "",
  city: "",
  state: "",
  pincode: "",
  total_area: "",
  total_plots: "",
  facilities: "",
  status: "active",
  description: "",
  residential_images: []
};

const ResidentialProjectForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editProject = location.state?.project;
  const isEdit = Boolean(editProject);

  const [form, setForm] = useState(initialState);
  const [existingImages, setExistingImages] = useState([]); // for edit mode image preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Add step state and error state
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [removedImages, setRemovedImages] = useState([]); // Track images removed in edit mode

  useEffect(() => {
    if (isEdit) {
      setForm({
        ...initialState,
        ...editProject,
        owner_image: null, // Don't prefill file input
        residential_images: [], // Only for new uploads
      });
      console.log(editProject, "editProject",editProject.residential_images)
      if (editProject && Array.isArray(editProject.residential_images)) {
        setExistingImages(editProject.residential_images);
      }
    }
    getAllCategory().then((data) => {
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        setCategoryOptions(data.data);
      }
    });
  }, [isEdit, editProject]);

  // Add image removal handler
  const handleRemoveImage = (index, type) => {
    if (type === 'new') {
      setForm((prev) => ({
        ...prev,
        residential_images: (prev.residential_images || []).filter((_, i) => i !== index)
      }));
    } else if (type === 'existing') {
      setRemovedImages((prev) => [...prev, existingImages[index]]);
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Update handleChange to support multi-image selection
  const handleChange = (e, newFiles = null) => {
    const { name, value, files, type } = e.target;
    if (name === 'residential_images' || (newFiles && Array.isArray(newFiles))) {
      setForm((prev) => ({
        ...prev,
        residential_images: newFiles ? [...(prev.residential_images || []), ...newFiles].slice(0, 8) : Array.from(files)
      }));
      setErrors((prev) => ({ ...prev, residential_images: null }));
      return;
    }
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") formData.append(key, value);
      });
      let newProjectId = null;
      if (isEdit) {
        await editResidentialProjectAPI(formData);
        newProjectId = form.residential_id;
        // Upload new images if any
        if (form.residential_images && form.residential_images.length > 0) {
          try {
            await uploadResidentialImagesAPI(newProjectId, form.residential_images);
          } catch (imgErr) {
            setError("Project updated, but failed to upload new images.");
            navigate("/residential-projects");
            return;
          }
        }
        // Delete removed images if any
        if (removedImages.length > 0) {
          try {
            await Promise.all(removedImages.map(imgUrl => deleteResidentialImageAPI(newProjectId, imgUrl)));
          } catch (delErr) {
            setError("Project updated, but failed to delete some images.");
            navigate("/residential-projects");
            return;
          }
        }
      } else {
        const res = await addResidentialProjectAPI(formData);
        newProjectId = res?.data?.residential_id || res?.data?.id || res?.residential_id || res?.id;
        // Upload images if any
        if (newProjectId && form.residential_images && form.residential_images.length > 0) {
          try {
            await uploadResidentialImagesAPI(newProjectId, form.residential_images);
          } catch (imgErr) {
            setError("Project added, but failed to upload images.");
            navigate("/residential-projects");
            return;
          }
        }
      }
      navigate("/residential-projects");
    } catch (err) {
      setError(err?.response?.data?.message || (isEdit ? "Failed to edit project" : "Failed to add project"));
    } finally {
      setLoading(false);
    }
  };

  // Validation per step
  const validateStep = () => {
    const errs = {};
    if (step === 1) {
      if (!form.owner_name.trim()) errs.owner_name = "Owner name is required";
      if (!form.owner_email.trim()) errs.owner_email = "Owner email is required";
      if (!form.owner_contact.trim()) errs.owner_contact = "Owner contact is required";
      if (!form.company_name.trim()) errs.company_name = "Company name is required";
    }
    if (step === 2) {
      if (!form.residential_name.trim()) errs.residential_name = "Project name is required";
      if (!form.residential_address.trim()) errs.residential_address = "Address is required";
      if (!form.city.trim()) errs.city = "City is required";
      if (!form.state.trim()) errs.state = "State is required";
      if (!form.pincode.trim()) errs.pincode = "Pincode is required";
      if (!form.total_area) errs.total_area = "Total area is required";
      if (!form.total_plots) errs.total_plots = "Total plots is required";
    }
    if (step === 3) {
      if (!form.description.trim()) errs.description = "Description is required";
    }
    return errs;
  };

  const handleNext = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
  };

  if (isEdit && !editProject) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <button onClick={() => navigate(-1)} className="bg-blue-500 text-white px-4 py-2 rounded">Go Back</button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-[5rem] max-w-6xl mx-auto justify-center flex flex-col">
      <Typography variant="h4" mb={3}>
        {isEdit ? "Edit Residential Project" : "Add Residential Project"}
      </Typography>
      <StepIndicator currentStep={step} />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {step === 1 && (
          <Box sx={{ p: 4, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Enter Owner and Project Info
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 4 }}>
              <TextField
                label="Owner Name"
                name="owner_name"
                value={form.owner_name}
                onChange={handleChange}
                fullWidth
                error={!!errors.owner_name}
                helperText={errors.owner_name}
              />
              <TextField
                label="Owner Email"
                name="owner_email"
                value={form.owner_email}
                onChange={handleChange}
                fullWidth
                error={!!errors.owner_email}
                helperText={errors.owner_email}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Owner Contact"
                name="owner_contact"
                value={form.owner_contact}
                onChange={handleChange}
                fullWidth
                error={!!errors.owner_contact}
                helperText={errors.owner_contact}
              />
              <TextField
                label="Company Name"
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                fullWidth
                error={!!errors.company_name}
                helperText={errors.company_name}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="RERA Number"
                name="rera_number"
                value={form.rera_number}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>
        )}
        {step === 2 && (
          <Box sx={{ p: 4, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom>
              Enter Project Details
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Area ID"
                name="area_id"
                value={form.area_id}
                onChange={handleChange}
                fullWidth
                error={!!errors.area_id}
                helperText={errors.area_id}
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  label="Category"
                  error={!!errors.category_id}
                >
                  {categoryOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Project Name"
                name="residential_name"
                value={form.residential_name}
                onChange={handleChange}
                fullWidth
                error={!!errors.residential_name}
                helperText={errors.residential_name}
              />
              <TextField
                label="Address"
                name="residential_address"
                value={form.residential_address}
                onChange={handleChange}
                fullWidth
                error={!!errors.residential_address}
                helperText={errors.residential_address}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                fullWidth
                error={!!errors.city}
                helperText={errors.city}
              />
              <TextField
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                fullWidth
                error={!!errors.state}
                helperText={errors.state}
              />
              <TextField
                label="Pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                fullWidth
                error={!!errors.pincode}
                helperText={errors.pincode}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Total Area (sq.ft.)"
                name="total_area"
                value={form.total_area}
                onChange={handleChange}
                fullWidth
                error={!!errors.total_area}
                helperText={errors.total_area}
              />
              <TextField
                label="Total Plots"
                name="total_plots"
                value={form.total_plots}
                onChange={handleChange}
                fullWidth
                error={!!errors.total_plots}
                helperText={errors.total_plots}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Facilities (comma separated)"
                name="facilities"
                value={form.facilities}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>
        )}
        {step === 3 && (
          <Box sx={{ p: 4, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom>
              Images & Description
            </Typography>
            <Box sx={{ mb: 2 }}>
              <ImageUploader
                inputClass="shadow h-[48px] text-[14px] appearance-none border-[1px] border-b-4 rounded w-full py-2 px-3 text-gray-700 focus:outline-none"
                errors={errors}
                handleChange={handleChange}
                selectedImages={form.residential_images}
                existingImages={existingImages}
                onRemoveImage={handleRemoveImage}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                error={!!errors.description}
                helperText={errors.description}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="deactive">Deactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <Button type="button" onClick={handleBack} variant="outlined" color="inherit">
              Back
            </Button>
          )}
          {step < 3 && (
            <Button type="button" onClick={handleNext} variant="contained" color="primary" sx={{ ml: "auto" }}>
              Next
            </Button>
          )}
          {step === 3 && (
            <Button type="submit" variant="contained" color="success" sx={{ ml: "auto" }} disabled={loading}>
              {loading ? (isEdit ? "Saving..." : "Adding...") : isEdit ? "Save Changes" : "Add Project"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ResidentialProjectForm; 