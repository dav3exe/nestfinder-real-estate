import React, { useState, useEffect, useContext } from "react";
import { useProperties } from "../../context/AddPropertyContext";
import {type PropertyType} from "../../context/AddPropertyContext";
import { ManageContext } from "../../context/ManagePropertyContext"; 
import upload from "/src/assets/upload.png"
import browse from "/src/assets/browse.png"
import save from "/src/assets/save.png"
import cancel from "/src/assets/cancel.png"

// ---- BACKEND: imported api functions ----
import { createProperty, updateProperty as updatePropertyAPI } from "../../services/api";

// ---- BACKEND ADDED: imported Modal component ----
import Modal from "../Universal/Modal";

// ---- BACKEND ADDED: imported Nigeria states data ----
import { allStates, getCitiesByState } from "../../data/nigeriaStates";
import { useNavigate } from "react-router-dom";


// ---- VALIDATION: type for tracking field-level error messages ----
type FormErrors = {
    propertyName?: string;
    propertyDescription?: string;
    price?: string;
    propertyType?: string;
    sale?: string;
    agentName?: string;
    agentPhone?: string;
    state?: string;
    city?: string;
    fullAddress?: string;
    bedrooms?: string;
    bathroom?: string;
    size?: string;
    images?: string;
};

export const AddPropertyContent: React.FC = () => {
    const { publishProperty, updateProperty, editingProperty, setEditingProperty } = useProperties();
    const manageContext = useContext(ManageContext);
    const navigate = useNavigate()
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [modal, setModal] = useState<{
        show: boolean;
        type: "success" | "error";
        message: string;
    }>({ show: false, type: "success", message: "" });

    // ---- VALIDATION: state to hold all field-level error messages ----
    const [errors, setErrors] = useState<FormErrors>({});

    const [form, setForm] = useState<PropertyType>({
        _id: "",
        propertyName: "",
        price: 0,
        propertyDescription: "",
        propertyType: "House",
        sale: "For Sale",
        location: { city: "", state: "", fullAddress: "" },
        propertyDetails: { bedrooms: 0, bathroom: 0, size: 0 },
        coordinates: { longitude: 0, latitude: 0},
        images: [],
        amenities: [],
        isFeatured: false,
        isDraft: false,
        agentName: "",
        agentPhone: "",
        discount: "",
    });
    
    useEffect(() => {
        if (editingProperty) {
            setForm(editingProperty);
            setImagePreviews(editingProperty.images || []);
            setImageFiles([]);
        } else {
            setImagePreviews([]);
            setImageFiles([]);
        }
    }, [editingProperty]);

    const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  const numericFields = new Set(["price", "longitude", "latitude"]);

  setForm((prev) => {
    const parsedValue =
      numericFields.has(name)
        ? value === "" ? 0 : Number(value)
        : value;

    if (name === "latitude" || name === "longitude") {
      return {
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: parsedValue,
        },
      };
    }

    return {
      ...prev,
      [name]: parsedValue,
    };
  });

  // ---- VALIDATION: clear the error for a field as soon as the user starts filling it in ----
  setErrors((prev) => ({ ...prev, [name]: undefined }));
};

    const nestedHandleChange = (section: 'location' | 'propertyDetails', field: string, value: any) => {
        setForm(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));

        // ---- VALIDATION: clear nested field errors (state, city, fullAddress, bedrooms, bathroom, size) on change ----
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleAmenity = (amenity: string) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setImageFiles(prev => [...prev, ...filesArray]);
            setImagePreviews(prev => [...prev, ...newPreviews]);

            // ---- VALIDATION: clear the images error once the user uploads at least one image ----
            setErrors((prev) => ({ ...prev, images: undefined }));
        }
    };
    // ---- ADDED: drag and drop handlers ----
    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const filesArray = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
        if (filesArray.length > 0) {
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setImageFiles(prev => [...prev, ...filesArray]);
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };
    // ---- END ADDED ----
    // ---- VALIDATION: validates fields required for "Save to Draft" (property name + location) ----
    const validateDraft = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!form.propertyName.trim()) {
            newErrors.propertyName = "Please enter the property name.";
            setModal({ show: true, type: "error", message: "Please fill out all required field" });
        }

        return newErrors;
    };

    // ---- VALIDATION: validates all fields required for "Publish Property" ----
    const validatePublish = (): FormErrors => {
        // Start with the draft rules (name + location), then add the rest
        const newErrors: FormErrors = validateDraft();

        if (!form.propertyDescription.trim()) {
            newErrors.propertyDescription = "Please enter a property description.";
            setModal({ show: true, type: "error", message: "Please fill out all required field" });
        }
        if (!form.price || form.price <= 0) {
            newErrors.price = "Please enter a valid price.";
            setModal({ show: true, type: "error", message: "Please fill out all required field" });
        }
        if (!form.agentName.trim()) {
            newErrors.agentName = "Please enter the agent name.";
            setModal({ show: true, type: "error", message: "Please fill out all required field" });
        }
        if (!form.agentPhone.trim()) {
            newErrors.agentPhone = "Please enter the agent phone number.";
            setModal({ show: true, type: "error", message: "Please fill out all required field" });
        }
        if (form.propertyDetails.bedrooms === 0) {
            newErrors.bedrooms = "Please select the number of bedrooms.";
            setModal({ show: true, type: "error", message: "Please fill out all required field" });
        }
        if (form.propertyDetails.bathroom === 0) {
            newErrors.bathroom = "Please select the number of bathrooms.";
            setModal({ show: true, type: "error", message: "Please fill out all required field" });
        }
        if (!form.propertyDetails.size || Number(form.propertyDetails.size) <= 0) {
            newErrors.size = "Please enter the property size.";
            setModal({ show: true, type: "error", message: "Please fill out all required field" });
        }
        if (imageFiles.length === 0 && imagePreviews.length === 0) {
            newErrors.images = "Please upload at least one property image.";
            setModal({ show: true, type: "error", message: "Please fill out all required field" });
        }

        return newErrors;
    };

    const handleSubmit = async (status: 'publish' | 'draft') => {
        // ---- VALIDATION: run the appropriate validator before submitting ----
        const validationErrors = status === 'draft' ? validateDraft() : validatePublish();

        // ---- VALIDATION: if there are any errors, set them in state and stop submission ----
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // ---- VALIDATION: clear any previous errors if validation passes ----
        setErrors({});

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("propertyName", form.propertyName);
            formData.append("price", String(form.price));
            formData.append("propertyDescription", form.propertyDescription);
            formData.append("propertyType", form.propertyType);
            formData.append("sale", form.sale);
            formData.append("city", form.location.city);
            formData.append("state", form.location.state);
            formData.append("fullAddress", form.location.fullAddress);
            formData.append("bedrooms", String(form.propertyDetails.bedrooms));
            formData.append("bathroom", String(form.propertyDetails.bathroom));
            formData.append("size", String(form.propertyDetails.size));
            formData.append("amenities", JSON.stringify(form.amenities));
            formData.append("isFeatured", String(form.isFeatured));
            formData.append("isDraft", status === 'draft' ? "true" : "false");
            formData.append("agentName", form.agentName);
            formData.append("agentPhone", form.agentPhone);
            formData.append("discount", form.discount);
            formData.append("latitude", String(form.coordinates?.latitude ?? ""));
            formData.append("longitude", String(form.coordinates?.longitude ?? ""));
            const existingImages = imagePreviews.filter(src => !src.startsWith('blob:'));
            formData.append("existingImages", JSON.stringify(existingImages));
            imageFiles.forEach((file) => formData.append("images", file));

            let result;
            if (editingProperty) {
                result = await updatePropertyAPI(editingProperty._id, formData);
                if (result.success) {
                    updateProperty(result.property);
                    setModal({ show: true, type: "success", message: "Property updated successfully!" });
                } else {
                    setModal({ show: true, type: "error", message: result.message || "Failed to update property" });
                }
            } else {
                result = await createProperty(formData);
                if (result.success) {
                    publishProperty(result.property);
                    setModal({
                        show: true, type: "success",
                        message: status === 'draft' ? "Property saved to drafts!" : "Property published successfully!",
                    });
                } else {
                    setModal({ show: true, type: "error", message: result.message || "Failed to save property" });
                }
            }
        } catch (error) {
            setModal({ show: true, type: "error", message: "Something went wrong. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };


    const handleModalClose = () => {
        setModal({ ...modal, show: false });
        if (modal.type === "success") {
            setEditingProperty(null);
            manageContext?.setActivePage("All Properties");
             navigate("/adminPage/manage-property"); 
            // ---- BACKEND ADDED: clear form after successful publish ----
            setForm({
                _id: "",
                propertyName: "",
                price: 0,
                propertyDescription: "",
                propertyType: "House",
                sale: "For Sale",
                location: { city: "", state: "", fullAddress: "" },
                propertyDetails: { bedrooms: 0, bathroom: 0, size: 0 },
                coordinates: { longitude: 0, latitude: 0},
                images: [],
                amenities: [],
                isFeatured: false,
                isDraft: false,
                agentName: "",
                agentPhone: "",
                discount: "",
            });
            setImageFiles([]);
            setImagePreviews([]);

            // ---- VALIDATION: clear errors after form reset ----
            setErrors({});
        }
    };

    const amenityList = ["Security", "Garden", "Water", "Electricity", "Gym", "Pool"];

    return (
        <div className="flex flex-col bg-[#E5E7EB] min-h-screen pb-20 overflow-x-hidden">

            {/* Nav */}
            <nav className="h-[76px] bg-white px-4 md:px-10 flex items-center border-b border-[#BAB9B9] shrink-0">
                <h1 className="font-['Lato'] font-bold text-[20px] md:text-[22px] text-[#023337]">
                    Add New Property
                </h1>
            </nav>

            {/* Header row */}
            <form action="">

            
            <div className="flex flex-col sm:flex-row justify-between px-4 md:px-10 py-6 items-start sm:items-center gap-4">
                <div className="flex flex-col gap-[8px]">
                    <h1 className="font-bold font-['Lato'] text-[20px] md:text-[22px] text-[#023337] ">Add New Property</h1>
                    <p className="font-['Lato'] text-[14px] text-[#000000]">Fill in the details below to list a new property</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto shrink-0">
                    <button
                        type="button"
                        onClick={() => handleSubmit('publish')} disabled={isLoading}
                        className="flex-1 sm:flex-none sm:w-[160px] h-[48px] rounded-[8px] border-[1px] border-[#75928B] bg-[#1A3C34] font-bold text-[15px] font-['Lato'] text-[#FFFFFF] whitespace-nowrap px-3"
                    >
                        {isLoading ? "Saving..." : editingProperty ? "Update Property" : "Publish Property"}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit('draft')} disabled={isLoading}
                        className="flex-1 sm:flex-none sm:w-[150px] h-[48px] rounded-[8px] border-[1px] bg-[#FFFFFF] border-[#75928B] flex items-center justify-center gap-2 font-bold text-[15px] text-[#031D17] font-['Lato'] whitespace-nowrap px-3"
                    >
                        <img className="w-[12.8px] h-[12.8px]" src={save} alt="" />
                        Save to Draft
                    </button>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 px-4 md:px-5">

                {/* LEFT — Basic Information */}
                <div className="bg-white p-4 md:p-8 flex-1 rounded-[8px] min-w-0">
                    <div className="mb-6">
                        <h2 className="font-bold font-['Lato'] text-[20px] md:text-[22px] text-[#1A3C34]">Basic Information</h2>
                    </div>

                    <div className="flex flex-col gap-5 max-[321px]:text-[13px]">
                        {/* Property Title */}
                        <div className="flex flex-col gap-[12px]">
                            <label className="font-['Lato'] font-bold text-[16px] text-[#444545]">Property Title</label>
                            <input
                                className={`w-full max-w-[563px] h-[48px] rounded-[8px] border-[1px] px-[12px] bg-[#F9FAFB] outline-none ${errors.propertyName ? "border-red-500" : "border-[#E5E7EB]"}`}
                                name="propertyName"
                                value={form.propertyName}
                                onChange={handleChange}
                                placeholder="Enter property name"
                            />
                            {/* ---- VALIDATION: property name error message ---- */}
                            {errors.propertyName && (
                                <p className="text-red-500 text-[13px] mt-[-6px]">{errors.propertyName}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-[12px]">
                            <label className="font-bold font-['Lato'] text-[16px] text-[#444545]">Property Description</label>
                            <textarea
                                className={`w-full max-w-[563px] min-h-[155px] rounded-[8px] border-[1px] p-3 bg-[#F9FAFB] resize-none outline-none ${errors.propertyDescription ? "border-red-500" : "border-[#E5E7EB]"}`}
                                name="propertyDescription"
                                value={form.propertyDescription}
                                onChange={handleChange}
                                placeholder="Describe the property..."
                            />
                            {/* ---- VALIDATION: description error message ---- */}
                            {errors.propertyDescription && (
                                <p className="text-red-500 text-[13px] mt-[-6px]">{errors.propertyDescription}</p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex flex-col gap-[12px]">
                            <label className="font-['Lato'] font-bold text-[18px] text-[#444545]">Price (₦)</label>
                            <input
                                className={`w-full max-w-[563px] h-[48px] rounded-[8px] border-[1px] px-[12px] bg-[#F9FAFB] outline-none ${errors.price ? "border-red-500" : "border-[#E5E7EB]"}`}
                                name="price"
                                placeholder="0.00"
                                step={1000000}
                                min={0}
                                type="number"
                                value={form.price === 0 ? "" : form.price}
                                onChange={handleChange}
                            />
                            {/* ---- VALIDATION: price error message ---- */}
                            {errors.price && (
                                <p className="text-red-500 text-[13px] mt-[-6px]">{errors.price}</p>
                            )}
                        </div>

                        {/* Property Type + Listing Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] max-w-[563px]">
                            <div className="flex flex-col gap-[12px]">
                                <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Property Type</label>
                                <select
                                    name="propertyType"
                                    value={form.propertyType}
                                    onChange={handleChange}
                                    className="border-[1px] border-[#E5E7EB] rounded-[8px] h-[48px] w-full outline-none bg-[#F9FAFB] px-2"
                                >
                                    <option value="House">House</option>
                                    <option value="Villa">Villa</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Residential">Residential</option>
                                    <option value="Duplex">Duplex</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-[12px]">
                                <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Listing Status</label>
                                <select
                                    name="sale"
                                    value={form.sale}
                                    onChange={handleChange}
                                    className="border-[1px] border-[#E5E7EB] rounded-[8px] h-[48px] w-full outline-none bg-[#F9FAFB] px-2"
                                >
                                    <option value="For Sale">For Sale</option>
                                    <option value="For Rent">For Rent</option>
                                </select>
                            </div>
                        </div>
                         {/* Agent Info */}
                        <div className="flex flex-col md:flex-row gap-[20px] pt-10">
                        <div className="flex flex-col gap-[12px] w-full md:w-[271.5px]">
                            <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Agent Name</label>
                            <input
                               
                                className={`border-[1px] rounded-[8px] h-[48px] px-[12px] bg-[#F9FAFB] outline-none ${errors.agentName ? "border-red-500" : "border-[#E5E7EB]"}`}
                                name="agentName"
                                value={form.agentName}
                                onChange={handleChange}
                                placeholder="Agent name"
                            />
                            {/* ---- VALIDATION: agent name error message ---- */}
                            {errors.agentName && (
                                <p className="text-red-500 text-[13px] mt-[-6px]">{errors.agentName}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-[12px] w-full md:w-[271.5px]">
                            <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Agent Phone</label>
                            <input
                                className={`border-[1px] rounded-[8px] h-[48px] px-[12px] bg-[#F9FAFB] outline-none ${errors.agentPhone ? "border-red-500" : "border-[#E5E7EB]"}`}
                                name="agentPhone"
                                value={form.agentPhone}
                                onChange={handleChange}
                                placeholder="+234 800 000 0000"
                            />
                            {/* ---- VALIDATION: agent phone error message ---- */}
                            {errors.agentPhone && (
                                <p className="text-red-500 text-[13px] mt-[-6px]">{errors.agentPhone}</p>
                            )}
                        </div>
                        </div>

                        {/* Discount */}
                        <div className="flex flex-col pt-5 gap-[12px]">
                        <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Discount (optional e.g 10%)</label>
                        <input className="w-full md:max-w-[563px] border-[1px] rounded-[8px] h-[48px] px-[12px] bg-[#F9FAFB] border-[#E5E7EB] outline-none" name="discount" value={form.discount} onChange={handleChange} placeholder="e.g 10%" />
                        </div>
                        {/* Location */}
                        <div className="pt-10">
                            <h3 className="font-bold text-[18px] text-[#023337]">Location</h3>
                            <div className="flex flex-col sm:flex-row gap-[20px] max-w-[563px] pt-2">
                                <div className="flex flex-col flex-1">
                                    <label className="font-bold font-['Lato'] text-[15px] text-[#444545] mb-3">State</label>
                                    <select
                                        value={form.location.state}
                                        onChange={(e) => {
                                            nestedHandleChange("location", "state", e.target.value);
                                            nestedHandleChange("location", "city", "");
                                        }}
                                        className={`w-full h-[48px] border-[1px] rounded-[8px] py-[10px] px-[12px] bg-[#F9FAFB] outline-none ${errors.state ? "border-red-500" : "border-[#E5E7EB]"}`}>
                                        <option value="">Select State</option>
                                        {allStates.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                    {/* ---- VALIDATION: state error message ---- */}
                                    {errors.state && (
                                        <p className="text-red-500 text-[13px] mt-1">{errors.state}</p>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <label className="font-bold font-['Lato'] text-[15px] text-[#444545] mb-3">City</label>
                                    <select
                                        value={form.location.city}
                                        onChange={(e) => nestedHandleChange("location", "city", e.target.value)}
                                        className={`w-full h-[48px] border-[1px] rounded-[8px] py-[10px] px-[12px] bg-[#F9FAFB] outline-none ${errors.city ? "border-red-500" : "border-[#E5E7EB]"}`}>
                                        <option value="">Select City</option>
                                        {getCitiesByState(form.location.state).map((city) => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    {/* ---- VALIDATION: city error message ---- */}
                                    {errors.city && (
                                        <p className="text-red-500 text-[13px] mt-1">{errors.city}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-[12px] py-4 max-w-[563px]">
                                <label className="font-['Lato'] font-bold text-[16px] text-[#444545]">Full Address</label>
                                <input
                                    className={`w-full h-[48px] border-[1px] rounded-[8px] py-[10px] px-[12px] bg-[#F9FAFB] outline-none mt-2 ${errors.fullAddress ? "border-red-500" : "border-[#E5E7EB]"}`}
                                    value={form.location.fullAddress}
                                    onChange={(e) => nestedHandleChange("location", "fullAddress", e.target.value)}
                                    placeholder="e.g Admiralty way, Lekki phase 1"
                                />
                                {/* ---- VALIDATION: full address error message ---- */}
                                {errors.fullAddress && (
                                    <p className="text-red-500 text-[13px] mt-[-6px]">{errors.fullAddress}</p>
                                )}
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="pt-4">
                            <h2 className="font-bold text-[16px] text-[#023337] mb-4">Property Details</h2>
                            <div className="grid grid-cols-3 gap-4 max-w-[563px]">
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-[15px] max-[321px]:text-[13px] text-[#444545]">Bedroom</label>
                                    <select
                                        value={form.propertyDetails.bedrooms}
                                        onChange={(e) => nestedHandleChange("propertyDetails", "bedrooms", Number(e.target.value))}
                                        className={`border-[1px] w-full h-[48px] rounded-[8px] px-[10px] bg-[#F9FAFB] outline-none ${errors.bedrooms ? "border-red-500" : "border-[#E5E7EB]"}`}
                                    >
                                        <option value="0">Select</option>
                                        {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                    {/* ---- VALIDATION: bedrooms error message ---- */}
                                    {errors.bedrooms && (
                                        <p className="text-red-500 text-[12px]">{errors.bedrooms}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-[15px] max-[321px]:text-[13px] text-[#444545]">Bathroom</label>
                                    <select
                                        value={form.propertyDetails.bathroom}
                                        onChange={(e) => nestedHandleChange("propertyDetails", "bathroom", Number(e.target.value))}
                                        className={`border-[1px] w-full h-[48px] rounded-[8px] px-[10px] bg-[#F9FAFB] outline-none ${errors.bathroom ? "border-red-500" : "border-[#E5E7EB]"}`}
                                    >
                                        <option value="0">Select</option>
                                        {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                    {/* ---- VALIDATION: bathroom error message ---- */}
                                    {errors.bathroom && (
                                        <p className="text-red-500 text-[12px]">{errors.bathroom}</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="font-bold text-[15px] max-[321px]:text-[13px] text-[#444545]">Size (sqm)</label>
                                    <input
                                        className={`border-[1px] w-full h-[48px] rounded-[8px] px-[10px] bg-[#F9FAFB] outline-none ${errors.size ? "border-red-500" : "border-[#E5E7EB]"}`}
                                        value={form.propertyDetails.size}
                                        onChange={(e) => nestedHandleChange("propertyDetails", "size", e.target.value)}
                                        placeholder="e.g 350"
                                    />
                                    {/* ---- VALIDATION: size error message ---- */}
                                    {errors.size && (
                                        <p className="text-red-500 text-[12px]">{errors.size}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom action buttons — visible only on desktop (xl and above) */}
                        <div className="hidden xl:flex justify-end gap-3 mt-8">
                            <button
                                type="button"
                                onClick={() => handleSubmit('draft')} disabled={isLoading}
                                className="w-full sm:w-[140px] h-[48px] rounded-[8px] border-[1px] bg-white border-[#75928B] flex items-center justify-center gap-2 font-bold text-[#031D17]"
                            >
                                <img className="w-[12.8px] h-[12.8px]" src={save} alt="" /> Save Draft
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit('publish')} disabled={isLoading}
                                className="w-full sm:w-[140px] h-[48px] rounded-[8px] bg-[#1A3C34] text-white font-bold "
                            >
                                {editingProperty ? "Update Property" : "Publish Property"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT — Upload + Amenities */}
                <div className="bg-white p-6 md:p-8 flex flex-col gap-8 rounded-[8px] w-full xl:w-[420px] xl:shrink-0 min-w-0 self-start">
                    {/* Upload */}
                    <div>
                        <h2 className="font-bold text-[20px] text-[#1A3C34] mb-2">Upload Property Image</h2>
                        {/* ---- MODIFIED: added drag and drop handlers and dynamic border style ---- */}
                        <label
                            htmlFor="file-upload"
                            className={`relative w-full h-[266px] border-[1px] border-dashed rounded-[8px] flex flex-col items-center justify-center p-4 cursor-pointer transition-colors duration-200 ${
                                isDragging
                                    ? "border-[#1A3C34] bg-[#f0fdf4]"
                                    : "border-[#75928B]"
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                id="file-upload"
                                type="file"
                                multiple accept="image/*" 
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-[#183730] rounded-lg">
                                    <img className="w-6 h-6" src={upload} alt="" />
                                </div>
                                <p className="text-[14px] text-black px-4">Drag and drop images here or click to browse</p>
                            </div>
                            <div className="mt-4 flex items-center gap-2 border border-gray-400 px-4 py-2 rounded-lg">
                                <img src={browse} alt="browse" className="w-4 h-4" />
                                <span className="text-sm font-medium">Browse Files</span>
                            </div>
                        </label>
                        {/* ---- VALIDATION: images error message ---- */}
                        {errors.images && (
                            <p className="text-red-500 text-[13px] mt-2">{errors.images}</p>
                        )}

                        {imagePreviews.length > 0 && (
                            <p className="font-bold text-[14px] text-[#444545] mt-6 mb-2">Uploaded Images</p>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-3">
                            {imagePreviews.map((url, idx) => (
                                <div key={idx} className="relative">
                                    <img src={url} className="w-full h-24 object-cover rounded-lg border shadow-sm" alt="preview" />
                                    <button
                                        onClick={() => {
                                            setImagePreviews(prev => prev.filter((_, i) => i !== idx));
                                            setImageFiles(prev => prev.filter((_, i) => i !== idx));
                                        }}
                                        className="absolute top-1 right-1 bg-white rounded-full p-1"
                                    >
                                        <img src={cancel} alt="remove" className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-col gap-5">
                        <h2 className="font-bold text-[16px] text-[#023337]">Amenities</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {amenityList.map((item) => (
                                <div
                                    key={item}
                                    onClick={() => handleAmenity(item)}
                                    className={`flex items-center gap-2 cursor-pointer border rounded-[8px] px-3 py-3 ${
                                        form.amenities.includes(item) ? "border-[#1A3C34] bg-[#f0fdf4]" : "border-[#E5E7EB]"
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-[4px] flex-shrink-0 flex items-center justify-center border transition-all ${
                                        form.amenities.includes(item)
                                            ? "bg-[#1A3C34] border-[#1A3C34]"
                                            : "bg-white border-gray-300"
                                    }`}>
                                        {form.amenities.includes(item) && (
                                            <span className="text-white text-[11px]">✓</span>
                                        )}
                                    </div>
                                    <span className="text-[13px] text-[#444545]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                {/* coordinates */}
                    <div className="flex flex-col gap-2">
                            
                           <h2 className="font-bold text-[16px] text-[#023337]">Map Coordinates</h2>
                           <div className="flex w-full gap-5 mt-2">
                            <div className="flex flex-col">
                                <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Latitude</label>
                                <input type="number" className="w-full h-[40px] rounded-[8px] border-[1px] px-[12px] bg-[#F9FAFB] border-[#E5E7EB] outline-none mt-3"
                                name="latitude" 
                                placeholder="0.0000"
                                min="0.0000"
                                step="0.0001"
                                value={form.coordinates.latitude === 0 ? "" : form.coordinates.latitude}
                                onChange={handleChange}/>
                            </div>

                            <div className="flex flex-col">
                                <label className="font-bold font-['Lato'] text-[15px] text-[#444545]">Longitude</label>
                                <input type="number" className="w-full h-[40px] rounded-[8px] border-[1px] px-[12px] bg-[#F9FAFB] border-[#E5E7EB] outline-none mt-3"
                                name="longitude"
                                placeholder="0.0000" 
                                min="0.0000"
                                step="0.0001"
                                value={form.coordinates.longitude === 0 ? "" : form.coordinates.longitude}
                                onChange={handleChange}/>
                            </div>

                           </div>
                           

                    </div>



                    
                </div>

            </div>

            {/* Bottom action buttons — visible only on mobile/tablet (below xl), always last on page */}
            <div className="flex xl:hidden justify-end gap-3 mt-6 px-4 md:px-5">
                <button
                    type="button"
                    onClick={() => handleSubmit('draft')} disabled={isLoading}
                    className="flex-1 sm:flex-none sm:w-[140px] h-[48px] rounded-[8px] border-[1px] bg-white border-[#75928B] flex items-center justify-center gap-2 font-bold text-[#031D17]"
                >
                    <img className="w-[12.8px] h-[12.8px]" src={save} alt="" /> Save Draft
                </button>
                <button
                    type="button"
                    onClick={() => handleSubmit('publish')} disabled={isLoading}
                    className="flex-1 sm:flex-none sm:w-[140px] h-[48px] rounded-[8px] bg-[#1A3C34] text-white font-bold"
                >
                     {isLoading ? "Saving..." : editingProperty ? "Update Property" : "Publish Property"}
                </button>
            </div>

            {modal.show && (
                <Modal type={modal.type} message={modal.message} onClose={handleModalClose} />
            )}
        </form> 
        </div>
    );
};