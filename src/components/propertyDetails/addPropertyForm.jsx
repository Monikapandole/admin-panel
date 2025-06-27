import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import ImageUploader from "../../Utils/ImageUploader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addProperty, updateProperty } from "../../redux/propertySlice";
import StepIndicator from "../../Utils/StepIndicator";
import { TextField, Select, MenuItem, Button, Typography, Box, Grid, InputLabel, FormControl } from "@mui/material";
import { fetchTenantPreferences } from '../../Api/services/userServices';
import { getAllCategory } from '../../Api/services/categoryService';
import { addPropertyAPI, editPropertyAPI } from '../../Api/services/propertyService';
import { fetchAllAreas } from '../../Api/services/areaService';

const AddPropertyForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const existingProperty = useSelector((state) =>
        state.property.properties.find((p) => p.id === Number(id))
    );

    const [form, setForm] = useState({
        mobile: "",
        owner: "",
        type: "Room",
        purpose: "For Rent",
        location: "",
        nearby: "",
        address: "",
        rooms: "",
        sqft: "",
        bathroomImage: null,
        floor: "",
        furnished: "None",
        amenities: "",
        preference: "Family",
        availability: "Immediate",
        availableDate: "",
        description: "",
        price: "",
        photos: [],
    });

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});

    const [preferenceOptions, setPreferenceOptions] = useState([]);

    const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);

    const [areaOptions, setAreaOptions] = useState([]);

    useEffect(() => {
        if (isEditMode && existingProperty) {
            setForm(existingProperty);
        }
        // Fetch tenant preferences
        fetchTenantPreferences()
          .then((data) => {
            if (data && Array.isArray(data.data) && data.data.length > 0) {
              setPreferenceOptions(data.data);
              // If current value is not in new options, set to first option
              if (!data.data.some(opt => opt.name === form.preference)) {
                setForm(prev => ({ ...prev, preference: data.data[0].name }));
              }
            }
          })
          .catch(() => {});
        // Fetch property type options
        getAllCategory()
          .then((data) => {
            if (data && Array.isArray(data.data) && data.data.length > 0) {
              setPropertyTypeOptions(data.data);
              // If current value is not in new options, set to first option
              if (!data.data.some(opt => opt.category_name === form.type)) {
                setForm(prev => ({ ...prev, type: data.data[0].category_name }));
              }
            }
          })
          .catch(() => {});
        // Fetch areas for nearby dropdown
        fetchAllAreas()
          .then((data) => {
            if (data && Array.isArray(data.data) && data.data.length > 0) {
              setAreaOptions(data.data);
              // If current value is not in new options, set to first option
              if (!data.data.some(opt => opt.name === form.nearby)) {
                setForm(prev => ({ ...prev, nearby: data.data[0].name }));
              }
            }
          })
          .catch(() => {});
    }, [isEditMode, existingProperty]);

    // Validation per step
    const validateStep = () => {
        const errs = {};
        if (step === 1) {
            if (!form.mobile.match(/^\d{10}$/)) errs.mobile = "Mobile number must be 10 digits";
            if (!form.owner.trim()) errs.owner = "Owner name is required";
            if (!form.address.trim()) errs.address = "Address is required";
        }
        if (step === 2) {
            if (!form.rooms || form.rooms <= 0) errs.rooms = "Enter valid room count";
            if (!form.sqft || form.sqft <= 0) errs.sqft = "Enter valid square footage";
            // Add more step 2 validations if needed
        }
        if (step === 3) {
            if (!form.price || form.price <= 0) errs.price = "Enter valid price";
            // Add more step 3 validations if needed
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

    const handleChange = (e, newFiles = null) => {
        const { name, value, type, files } = e.target;

        // Only do this if newFiles is an array (iterable)
        if (newFiles && Array.isArray(newFiles)) {
            setForm((prev) => {
                const current = prev[name] || [];
                const combined = [...current, ...newFiles].slice(0, 8);
                return { ...prev, [name]: combined };
            });
            setErrors((prev) => ({ ...prev, [name]: null }));
            return;
        }

        if (type === "file") {
            console.log("Selected file:", files[0]);
            setForm((prev) => ({ ...prev, [name]: files[0] }));
        }
        else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
        setErrors((prev) => ({ ...prev, [name]: null }));
    };
    const [previewUrl, setPreviewUrl] = React.useState(null);

    React.useEffect(() => {
        if (form.bathroomImage) {
            const url = URL.createObjectURL(form.bathroomImage);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [form.bathroomImage]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const allErrors = {};
        // Validate all steps on submit:
        for (let s = 1; s <= 3; s++) {
            setStep(s);
            const errs = validateStep();
            Object.assign(allErrors, errs);
        }
        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            return;
        }

        if (isEditMode) {
            // Build FormData for API
            const formData = new FormData();
            formData.append('id', id);
            formData.append('owner_name', form.owner);
            formData.append('owner_contact', form.mobile);
            // Find category_id from propertyTypeOptions
            const category = propertyTypeOptions.find(opt => opt.category_name === form.type);
            if (category) formData.append('category_id', category.id);
            formData.append('purpose', form.purpose === 'For Rent' ? 'FOR_RENT' : 'FOR_SALE');
            // area_id is not present in form, set as blank or add logic if available
            const area = areaOptions.find(opt => opt.name === form.nearby);
            if (area) {
                formData.append('area_id', area.id);
                formData.append('location', area.name);
                formData.append('location_lat', area.lat || '');
                formData.append('location_long', area.log || '');
            } else {
                formData.append('location', form.location);
                formData.append('location_lat', '');
                formData.append('location_long', '');
            }
            formData.append('address', form.address);
            formData.append('number_of_rooms', form.rooms);
            formData.append('square_footage', form.sqft);
            if (form.bathroomImage) formData.append('bathroom_image', form.bathroomImage);
            formData.append('floor', form.floor);
            formData.append('furnished', form.furnished.toUpperCase().replace('-', '_'));
            formData.append('amenities', form.amenities);
            // Find tenant_id from preferenceOptions
            const tenant = preferenceOptions.find(opt => opt.name === form.preference);
            if (tenant) formData.append('tenant_id', tenant.id);
            // API expects availability_date (use form.availableDate if Select Date, else today if Immediate)
            let availabilityDate = '';
            if (form.availability === 'Select Date') {
                availabilityDate = form.availableDate;
            } else if (form.availability === 'Immediate') {
                const today = new Date();
                availabilityDate = today.toISOString().slice(0, 10); // YYYY-MM-DD
            }
            formData.append('availability_date', availabilityDate);
            formData.append('additional_detail', form.description);
            formData.append('price', form.price);
            formData.append('status', 'active');
            try {
                await editPropertyAPI(formData);
                navigate('/properties');
            } catch (error) {
                setErrors({ submit: 'Failed to update property. Please try again.' });
            }
        } else {
            // Build FormData for API
            const formData = new FormData();
            formData.append('owner_name', form.owner);
            formData.append('owner_contact', form.mobile);
            // Find category_id from propertyTypeOptions
            const category = propertyTypeOptions.find(opt => opt.category_name === form.type);
            if (category) formData.append('category_id', category.id);
            formData.append('purpose', form.purpose === 'For Rent' ? 'FOR_RENT' : 'FOR_SALE');
            // area_id is not present in form, set as blank or add logic if available
            const area = areaOptions.find(opt => opt.name === form.nearby);
            if (area) {
                formData.append('area_id', area.id);
                formData.append('location', area.name);
                formData.append('location_lat', area.lat || '');
                formData.append('location_long', area.log || '');
            } else {
                formData.append('location', form.location);
                formData.append('location_lat', '');
                formData.append('location_long', '');
            }
            formData.append('address', form.address);
            formData.append('number_of_rooms', form.rooms);
            formData.append('square_footage', form.sqft);
            if (form.bathroomImage) formData.append('bathroom_image', form.bathroomImage);
            formData.append('floor', form.floor);
            formData.append('furnished', form.furnished.toUpperCase().replace('-', '_'));
            formData.append('amenities', form.amenities);
            // Find tenant_id from preferenceOptions
            const tenant = preferenceOptions.find(opt => opt.name === form.preference);
            if (tenant) formData.append('tenant_id', tenant.id);
            // API expects availability_date (use form.availableDate if Select Date, else today if Immediate)
            let availabilityDate = '';
            if (form.availability === 'Select Date') {
                availabilityDate = form.availableDate;
            } else if (form.availability === 'Immediate') {
                const today = new Date();
                availabilityDate = today.toISOString().slice(0, 10); // YYYY-MM-DD
            }
            formData.append('availability_date', availabilityDate);
            formData.append('additional_detail', form.description);
            formData.append('price', form.price);
            try {
                await addPropertyAPI(formData);
                navigate('/properties');
            } catch (error) {
                setErrors({ submit: 'Failed to add property. Please try again.' });
            }
        }
    };
    console.log(form.bathroomImage instanceof File); // should be true

    const inputClass = `shadow h-[48px] text-[14px] appearance-none border-[1px] border-b-4 rounded w-full py-2 px-3 text-gray-700 focus:outline-none`;
    const errorClass = "text-red-500 text-sm";

    return (
        <div className="p-6 pt-[5rem] max-w-6xl mx-auto justify-center flex flex-col" >
          <Typography variant="h4" mb={3}>
                {isEditMode ? "Edit Property Details" : "Add Property Details"}
            </Typography>
            <StepIndicator currentStep={step}/>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                {step === 1 && (
                    <>
                        <Box
                            sx={{
                                p: 4,
                                backgroundColor: "#fff",
                                borderRadius: 2,
                                boxShadow: 3,
                                mt: 3
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                Enter Owner and Contact Info
                            </Typography>

                            {/* Row 1 */}
                            <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 4 }}>
                                <TextField
                                    label="Mobile Number"
                                    name="mobile"
                                    value={form.mobile}
                                    onChange={(e) => {
                                        const digitsOnly = e.target.value.replace(/\D/g, "");
                                        setForm((prev) => ({ ...prev, mobile: digitsOnly }));
                                        setErrors((prev) => ({ ...prev, mobile: null }));
                                    }}
                                    fullWidth
                                    error={!!errors.mobile}
                                    helperText={errors.mobile}
                                />
                                <TextField
                                    label="Owner Name"
                                    name="owner"
                                    value={form.owner}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.owner}
                                    helperText={errors.owner}
                                />
                            </Box>

                            {/* Row 2 */}
                            <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Property Type</InputLabel>
                                    <Select
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        label="Property Type"
                                    >
                                        {propertyTypeOptions.map((option) => (
                                            <MenuItem key={option.id || option.category_name} value={option.category_name}>
                                                {option.category_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>Purpose</InputLabel>
                                    <Select
                                        name="purpose"
                                        value={form.purpose}
                                        onChange={handleChange}
                                        label="Purpose"
                                    >
                                        {["For Rent", "For Sale"].map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            {/* Row 3 */}
                            <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 4 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Nearby Areas</InputLabel>
                                    <Select
                                        label="Nearby Areas"
                                        name="nearby"
                                        value={form.nearby}
                                        onChange={handleChange}
                                    >
                                        {areaOptions.map((option) => (
                                            <MenuItem key={option.id || option.name} value={option.name}>
                                                {option.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.address}
                                    helperText={errors.address}
                                />
                            </Box>

                            {/* Row 4 - Full Width */}
                            {/* <Box sx={{ mb: 2, mt: 4 }}>
                                <GooglePlacesAutocomplete
                                    apiKey="YOUR_API_KEY"
                                    selectProps={{
                                        value: form.location,
                                        onChange: (newValue) =>
                                            setForm((prev) => ({ ...prev, location: newValue.label })),
                                        placeholder: "Search location...",
                                        styles: {
                                            control: (base) => ({
                                                ...base,
                                                backgroundColor: "#f9f9f9",
                                                borderRadius: "8px",
                                                padding: "10px",
                                                fontSize: "16px",
                                                borderColor: "#ccc",
                                                minHeight: "56px",
                                            }),
                                        },
                                    }}
                                    debounce={400}
                                />
                            </Box> */}
                        </Box>


                    </>
                )}
                {step === 2 && (
                    <Box
                        sx={{
                            p: 4,
                            backgroundColor: "#fff",
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Enter Property Details
                        </Typography>

                        {/* Row 1 */}
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <TextField
                                label="Number of Rooms"
                                name="rooms"
                                type="number"
                                value={form.rooms}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.rooms}
                                helperText={errors.rooms}
                            />
                            <TextField
                                label="Square Footage"
                                name="sqft"
                                type="number"
                                value={form.sqft}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.sqft}
                                helperText={errors.sqft}
                            />
                        </Box>

                        {/* Row 2 */}
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <Button variant="outlined" component="label" fullWidth>
                                Upload Bathroom Image
                                <input
                                    type="file"
                                    name="bathroomImage"
                                    accept="image/*"
                                    hidden
                                    onChange={handleChange}
                                />
                            </Button>
                           
                            <TextField
                                label="Floor"
                                name="floor"
                                value={form.floor}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Box>
                         {previewUrl && (
                                <Box mt={2} mb={4}>
                                    <img
                                        src={previewUrl}
                                        alt="Bathroom"
                                        style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: "8px" }}
                                    />
                                </Box>
                            )}

                        {/* Row 3 */}
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Furnished</InputLabel>
                                <Select
                                    name="furnished"
                                    value={form.furnished}
                                    onChange={handleChange}
                                    label="Furnished"
                                >
                                    {["None", "Semi-Furnished", "Fully Furnished"].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                label="Amenities"
                                name="amenities"
                                value={form.amenities}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Box>

                        {/* Row 4 */}
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Tenant Preference</InputLabel>
                                <Select
                                    name="preference"
                                    value={form.preference}
                                    onChange={handleChange}
                                    label="Tenant Preference"
                                >
                                    {preferenceOptions.map((option) => (
                                        <MenuItem key={option.id || option.name} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Availability</InputLabel>
                                <Select
                                    name="availability"
                                    value={form.availability}
                                    onChange={handleChange}
                                    label="Availability"
                                >
                                    {["Immediate", "Select Date"].map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {form.availability === "Select Date" && (
                                    <TextField
                                        type="date"
                                        name="availableDate"
                                        value={form.availableDate}
                                        onChange={handleChange}
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    />
                                )}
                            </FormControl>
                        </Box>
                    </Box>
                )}





                {step === 3 && (
                    <Box
                        sx={{

                            p: 4,
                            backgroundColor: "#fff",
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Additional Details
                        </Typography>

                        {/* Description - full width */}
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Property Description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                fullWidth
                            />
                        </Box>

                        {/* Image Uploader - full width */}
                        <Box sx={{ mb: 2 }}>
                            <ImageUploader
                                inputClass={inputClass}
                                errors={errors}
                                handleChange={handleChange}
                            />
                        </Box>

                        {/* Price */}
                        <Box sx={{ maxWidth: "300px" }}>
                            <TextField
                                label="Price"
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                fullWidth
                                error={!!errors.price}
                                helperText={errors.price}
                            />
                        </Box>
                    </Box>
                )}



                <div className="flex justify-between mt-4">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={handleBack}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Back
                        </button>
                    )}
                    {step < 3 && (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-auto"
                        >
                            Next
                        </button>
                    )}
                    {step === 3 && (
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-auto"
                        >
                            {isEditMode ? "Update Property" : "Submit Property"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddPropertyForm;

