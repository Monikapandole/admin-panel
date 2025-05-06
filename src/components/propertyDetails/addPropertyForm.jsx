import React, { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import ImageUploader from "../../Utils/ImageUploader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addProperty, updateProperty } from "../../redux/propertySlice";

const AddPropertyForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const existingProperty = useSelector((state) =>
        state.property.properties.find((p) => p.id === Number(id))
    );
    console.log(id, "id", isEditMode, existingProperty)

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
        property: "",
        price: "",
        photos: [],
        mainImage: "",
    });

    useEffect(() => {
        console.log(id, "id")
        if (isEditMode && existingProperty) {
            setForm(existingProperty);
            console.log(existingProperty, "existingProperty")
        }
    }, [isEditMode, existingProperty]);

    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!form.mobile.match(/^\d{10}$/)) {
            errs.mobile = "Mobile number must be 10 digits";
        }
        if (!form.owner.trim()) errs.owner = "Owner name is required";
        if (!form.address.trim()) errs.address = "Address is required";
        if (!form.rooms || form.rooms <= 0) errs.rooms = "Enter valid room count";
        if (!form.sqft || form.sqft <= 0) errs.sqft = "Enter valid square footage";
        if (!form.price || form.price <= 0) errs.price = "Enter valid price";
        // if (form.bathroomImage && form.bathroomImage.size > 2 * 1024 * 1024) {
        //     errs.bathroomImage = "Bathroom image must be under 2MB";
        // }
        return errs;
    };

    const [dropdownState, setDropdownState] = useState({
        type: false,
        purpose: false,
        furnished: false,
        preference: false,
        availability: false,
    });

    const toggleDropdown = (dropdown) => {
        setDropdownState((prevState) => ({
            ...prevState,
            [dropdown]: !prevState[dropdown],
        }));
    };

    const handleChange = (e, newFiles = null) => {
        const { name, value } = e.target;
      
        setForm((prev) => {
          if (newFiles) {
            const current = prev[name] || [];
            const combined = [...current, ...newFiles].slice(0, 8);
            console.log(combined)

            return { ...prev, [name]: combined };
          }
      
          return { ...prev, [name]: value };
        });
      
        setErrors((prev) => ({ ...prev, [name]: null }));
      };
      

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (isEditMode) {
            dispatch(updateProperty({ id, data: form }));
        } else {
            dispatch(addProperty(form));
        }

        navigate("/properties");
    };

    const inputClass = `shadow h-[48px] text-[14px] appearance-none border-[1px] border-b-4 rounded w-full py-2 px-3 text-gray-700 focus:outline-none ${errors.phone_number ? "border-red-500" : "border-black"}`;
    const errorClass = "text-red-500 text-sm";

    const handleSelect = (dropdown, option) => {
        setForm((prevForm) => ({ ...prevForm, [dropdown]: option }));
        setDropdownState((prevState) => ({
            ...prevState,
            [dropdown]: false,
        }));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
                {isEditMode ? "Edit Property Details" : "Add Property Details"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="mobile">Mobile Number</label>
                    <input
                        className={inputClass}
                        id="mobile"
                        type="text"
                        name="mobile"
                        value={form.mobile}
                        onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, "");
                            setForm((prev) => ({ ...prev, mobile: digitsOnly }));
                            setErrors((prev) => ({ ...prev, mobile: null }));
                        }}
                    />
                    {errors.mobile && <div className={errorClass}>{errors.mobile}</div>}
                </div>

                <div>
                    <label htmlFor="owner">Owner Name</label>
                    <input id="owner" name="owner" value={form.owner} onChange={handleChange} className={inputClass} />
                    {errors.owner && <div className={errorClass}>{errors.owner}</div>}
                </div>

                <div className="relative">
                    <label htmlFor="type">Property Type</label>
                    <div className={inputClass} onClick={() => toggleDropdown("type")}>
                        {form.type}
                    </div>
                    {dropdownState.type && (
                        <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-md shadow-lg overflow-hidden z-20">
                            {["Room", "1RK", "Flat (1BHK)", "Flat (2BHK)", "Flat (3BHK)", "House", "Shop", "PG/Hostel"].map((option) => (
                                <div key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSelect("type", option)}>
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <label htmlFor="purpose">Purpose</label>
                    <div className={inputClass} onClick={() => toggleDropdown("purpose")}>
                        {form.purpose}
                    </div>
                    {dropdownState.purpose && (
                        <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-md shadow-lg overflow-hidden z-20">
                            {["For Rent", "For Sale"].map((option) => (
                                <div key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSelect("purpose", option)}>
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="location">Location</label>
                    <GooglePlacesAutocomplete
                        apiKey="AIzaSyDlAHAiEHJtSN26uU9IDg9qCH_2B2eaARo"
                        selectProps={{
                            value: form.location,
                            onChange: (newValue) => setForm({ ...form, location: newValue.label }),
                        }}
                        placeholder="Location"
                        debounce={500}
                        styles={{
                            container: { width: "100%" },
                            input: { ...inputClass },
                            menu: { zIndex: 1000 },
                        }}
                    />
                    {errors.location && <div className={errorClass}>{errors.location}</div>}
                </div>

                <div>
                    <label htmlFor="nearby">Nearby Places</label>
                    <input id="nearby" name="nearby" value={form.nearby} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                    <label htmlFor="address">Address</label>
                    <input id="address" name="address" value={form.address} onChange={handleChange} className={inputClass} />
                    {errors.address && <div className={errorClass}>{errors.address}</div>}
                </div>

                <div>
                    <label htmlFor="rooms">Number of Rooms</label>
                    <input id="rooms" name="rooms" value={form.rooms} onChange={handleChange} type="number" className={inputClass} />
                    {errors.rooms && <div className={errorClass}>{errors.rooms}</div>}
                </div>

                <div>
                    <label htmlFor="sqft">Square Footage</label>
                    <input id="sqft" name="sqft" value={form.sqft} onChange={handleChange} type="number" className={inputClass} />
                    {errors.sqft && <div className={errorClass}>{errors.sqft}</div>}
                </div>

                <div>
                    <label htmlFor="bathroomImage">Bathroom Image</label>
                    <input id="bathroomImage" name="bathroomImage" onChange={handleChange} type="file" accept="image/*" className={inputClass} />
                    {errors.bathroomImage && <div className={errorClass}>{errors.bathroomImage}</div>}
                </div>

                <div>
                    <label htmlFor="floor">Floor</label>
                    <input id="floor" name="floor" value={form.floor} onChange={handleChange} className={inputClass} />
                </div>

                <div>
                    <label htmlFor="amenities">Amenities</label>
                    <input id="amenities" name="amenities" value={form.amenities} onChange={handleChange} className={inputClass} />
                </div>

                <div className="relative">
                    <label htmlFor="preference">Tenant Preference</label>
                    <div className={inputClass} onClick={() => toggleDropdown("preference")}>
                        {form.preference}
                    </div>
                    {dropdownState.preference && (
                        <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-md shadow-lg overflow-hidden z-20">
                            {["Boys", "Girls", "Family", "Independent", "Non-Independent"].map((option) => (
                                <div key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSelect("preference", option)}>
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <label htmlFor="availability">Availability</label>
                    <div className={inputClass} onClick={() => toggleDropdown("availability")}>
                        {form.availability}
                    </div>
                    {dropdownState.availability && (
                        <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-md shadow-lg overflow-hidden z-20">
                            {["Immediate", "Select Date"].map((option) => (
                                <div key={option} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleSelect("availability", option)}>
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                    {form.availability === "Select Date" && (
                        <input type="date" name="availableDate" className={`${inputClass} mt-2`} onChange={handleChange} />
                    )}
                </div>

                <div className="col-span-full">
                    <label htmlFor="description">Property Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className={`${inputClass} resize-none`}
                    />
                </div>

                <ImageUploader
                    inputClass={inputClass}
                    errorClass={errorClass}
                    errors={errors}
                    handleChange={handleChange}
                />

                <div>
                    <label htmlFor="price">Price</label>
                    <input id="price" name="price" value={form.price} onChange={handleChange} type="number" className={inputClass} />
                    {errors.price && <div className={errorClass}>{errors.price}</div>}
                </div>

                <button type="submit" className="col-span-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    {isEditMode ? "Update Property" : "Submit Property"}
                </button>
            </form>
        </div>
    );
};

export default AddPropertyForm;
