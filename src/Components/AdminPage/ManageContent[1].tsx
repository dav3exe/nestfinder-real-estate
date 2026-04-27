import React, { useContext, useState } from "react"
import { PropertyContext } from "../../context/AddPropertyContext" 
import { ManageContext } from "../../context/ManagePropertyContext"
import search from "/src/assets/searchm.png"
import Pagination from "../Universal/Pagination"
import { useNavigate } from 'react-router-dom'
// ---- BACKEND: imported updateProperty to publish drafts ----
import { updateProperty as updatePropertyAPI } from "../../services/api"
import Modal from "../Universal/Modal"
export const ManageContent: React.FC = () => {
  const navigate = useNavigate()
  const propertiesContext = useContext(PropertyContext)
  const manageContext = useContext(ManageContext)
 
  if (!propertiesContext || !manageContext) {
    return <p className="p-10">Content loading...</p>
  }

  const { properties, deleteProperty, setEditingProperty,updateProperty } = propertiesContext
  const { activepage, setActivePage, searchBar, setSearchBar } = manageContext

  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(6);
 // ---- BACKEND ADDED: modal state for success and error messages ----
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  // Filtering Logic
  const filteredProperties = properties.filter((property) => {
    let pageMatch = false;
    if (activepage === "All Properties" || activepage === "Dashboard") pageMatch = true;
    else if (activepage === "Featured") pageMatch = property.isFeatured === true;
    else if (activepage === "Draft") pageMatch = property.isDraft === true;
    else pageMatch = property.sale === activepage;

    const matchSearch = (property.propertyName?.toLowerCase() || "").includes(searchBar.toLowerCase()) || 
      (property.propertyType?.toLowerCase() || "").includes(searchBar.toLowerCase()) || 
      (property.location?.city?.toLowerCase() || "").includes(searchBar.toLowerCase()) || 
      (property.location?.state?.toLowerCase() || "").includes(searchBar.toLowerCase());

    return pageMatch && matchSearch;
  });

  
  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentPropertyPagin = filteredProperties.slice(firstPostIndex, lastPostIndex);

  // ---- BACKEND ADDED: publish a draft property directly from manage table ----
  const handlePublishDraft = async (propertyId: string) => {
    try {
      // ---- find the property we want to publish ----
      const prop = properties.find((p) => p._id === propertyId);
      if (!prop) return;

      // ---- build full FormData with all existing property data ----
      const formData = new FormData();
      formData.append("propertyName", prop.propertyName);
      formData.append("price", String(prop.price));
      formData.append("propertyDescription", prop.propertyDescription);
      formData.append("propertyType", prop.propertyType);
      formData.append("sale", prop.sale);
      formData.append("city", prop.location.city);
      formData.append("state", prop.location.state);
      formData.append("fullAddress", prop.location.fullAddress);
      formData.append("bedrooms", String(prop.propertyDetails.bedrooms));
      formData.append("bathroom", String(prop.propertyDetails.bathroom));
      formData.append("size", String(prop.propertyDetails.size));
      formData.append("amenities", JSON.stringify(prop.amenities));
      formData.append("isFeatured", String(prop.isFeatured));
      formData.append("agentName", prop.agentName || "");
      formData.append("agentPhone", prop.agentPhone || "");
      formData.append("discount", prop.discount || "");
      // ---- set isDraft to false to publish ----
      formData.append("isDraft", "false");

      const result = await updatePropertyAPI(propertyId, formData);

      if (result.success) {
        updateProperty(result.property);
        setModal({
          show: true,
          type: "success",
          message: "Property published successfully!",
        });
      } else {
        setModal({
          show: true,
          type: "error",
          message: result.message || "Failed to publish property",
        });
      }
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  // ---- BACKEND ADDED: delete with modal confirmation ----
  const handleDelete = async (propertyId: string) => {
    await deleteProperty(propertyId);
  };
  return (
    <div className="flex flex-col bg-[#F3F4F6] min-h-screen w-full pb-10">
      <nav className="h-[76px] w-full bg-white px-4 md:px-10 flex items-center border-b border-[#BAB9B9] sticky top-0 z-20">
        <h1 className="font-['Lato'] font-bold text-[20px] md:text-[22px] text-[#023337]">Manage Properties</h1>
      </nav>

      <div className="px-4 md:px-10 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-[22px] text-[#023337] font-['Lato']">Manage Properties</h2>
            <p className="text-[14px] text-gray-600 font-['Lato']">Fill in the details below to list a new property</p>
          </div>
          <button 
            onClick={() => {
              setActivePage("Add Property");
              navigate("/adminPage/add-property");
            }}
            className="w-full sm:w-auto bg-[#1A3C34] text-white px-6 py-3 rounded-[8px] font-bold text-[15px] hover:bg-[#264d43] transition-all transform hover:scale-105">
            Add New Property
          </button>
        </div>

    
        <div className="bg-white rounded-[8px] shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
          
          <div className="flex flex-col xl:flex-row gap-4 p-4 justify-between border-b border-gray-50">
            <div className="flex overflow-x-auto no-scrollbar bg-[#D7FFF6] p-1 rounded-[8px] w-full xl:w-fit">
              {(["All Properties", "For Sale", "For Rent", "Featured", "Draft"] as const).map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => { setActivePage(tab); setCurrentPage(1); }} 
                  className={`px-4 py-2 rounded-md text-[13px] md:text-[14px] font-medium whitespace-nowrap transition-all ${activepage === tab ? "bg-white text-[#414242] shadow-sm" : "text-[#75928B]"}`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="relative w-full xl:w-[300px]">
              <input 
                type="text" 
                placeholder="Search properties" 
                value={searchBar}
                onChange={(e) => setSearchBar(e.target.value)}
                className="w-full h-[44px] bg-[#EFF8F6] rounded-[8px] px-4 pr-10 outline-none text-[14px] font-['Lato'] border border-transparent focus:border-[#1A3C34]"
              />
              <img className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 opacity-60" src={search} alt="search icon" />
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#B1FFED] h-[56px]">
                  <th className="px-6 text-[15px] font-bold text-[#023337]">Property</th>
                  <th className="px-6 text-[15px] font-bold text-[#023337]">Type</th>
                  <th className="px-6 text-[15px] font-bold text-[#023337]">Location</th>
                  <th className="px-6 text-[15px] font-bold text-[#023337]">Price</th>
                  <th className="px-6 text-[15px] font-bold text-[#023337]">Status</th>
                  <th className="px-6 text-[15px] font-bold text-[#023337] text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {currentPropertyPagin.map((property) => (
                  <tr key={property._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 min-w-[250px]">
                      <div className="flex items-center gap-3">
                        {property.images && (
                          <img 
                            src={Array.isArray(property.images) ? property.images[0] : property.images} 
                            alt="" 
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200" 
                          />
                        )}
                        <span className="font-bold text-[#0A1916] text-[14px] md:text-[15px]">
                          {property.propertyName}
                        </span>
                        {/* ---- BACKEND ADDED: show Draft badge on draft properties ---- */}
                            {property.isDraft && (
                              <span className="text-[11px] text-orange-500 font-medium">Draft</span>
                            )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#403F3F] text-[14px] whitespace-nowrap">{property.propertyType}</td>
                    <td className="px-6 py-4 text-[#403F3F] text-[14px]">
                      <p className="truncate hover:whitespace-normal hover:overflow-visible max-w-[180px]">{property.location.fullAddress} </p>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#023337] whitespace-nowrap">₦{property.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                   {/* ---- BACKEND UPDATED: show Draft status for draft properties ---- */}
                        <span className={`w-2 h-2 rounded-full ${property.isDraft ? "bg-[#808080]" :
                            property.sale === "For Sale" ? "bg-[#10B981]" : "bg-[#F59E0B]"}`}></span>
                        <span className="text-[#023337] font-medium text-[14px] whitespace-nowrap">{property.isDraft ? "Pending" : property.sale}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button 
                          onClick={() => { 
                            setEditingProperty(property);
                            navigate("/adminPage/edit-property");
                          }} 
                          className="text-[#21C45D] font-medium text-[14px] hover:underline"
                        >
                          Edit
                        </button>
                        {/* ---- BACKEND ADDED: Publish button only for draft properties ---- */}
                          {property.isDraft && (
                            <>
                            <span className="text-[#21C45D]">/</span>
                              <button
                                onClick={() => handlePublishDraft(property._id)}
                                className="text-[#1A3C34] font-normal text-[15px] hover:underline">
                                Publish
                              </button>
                              
                            </>
                          )}

                          {/* ---- Delete button — always shown ---- */}
                        <span className="text-gray-300">/</span>
                        <button 
                          onClick={() => handleDelete(property._id)}
                          className="text-[#FF0000] font-medium text-[14px] hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProperties.length === 0 && (
              <div className="py-20 text-center text-[#75928B] w-full">
                <p>No properties found for your search.</p>
              </div>
            )}
          </div>
        </div>

       
        <div className="w-full flex justify-center mt-8 ">
          <Pagination
            totalPosts={filteredProperties.length}
            postPerPage={postPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </div>
       {/* ---- BACKEND ADDED: modal for success and error messages ---- */}
      {modal.show && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}
    </div>
  )
}

export default ManageContent;