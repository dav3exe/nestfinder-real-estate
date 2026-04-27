import React, { useContext, useEffect, useState } from "react";
import { PropertyContext } from "../../context/AddPropertyContext";
import { ManageContext } from "../../context/ManagePropertyContext";
import up from "/src/assets/up.png"
import down from "/src/assets/down.png"
import dot from "/src/assets/dot.png"
import Pagination from "../Universal/Pagination";
import { useNavigate } from "react-router-dom";
// ---- BACKEND: imported getUsersCount from api service ----
// ---- BACKEND ADDED: also imported getDashboardStats for real percentage data ----
import { getUsersCount, getDashboardStats } from "../../services/api";

const Dashboard: React.FC = () => {
  const { properties, deleteProperty, setEditingProperty } = useContext(PropertyContext)!;
  const { setActivePage } = useContext(ManageContext)!;
  const navigate = useNavigate();

  // Filter out any empty or incomplete property objects to prevent the "0 Naira / Empty Image" row
  const validProperties = properties.filter(property => property.propertyName && property._id);

  // these counts come from your local properties data as before ----
  const totalProperties = validProperties.length;
  const activeListings = validProperties.filter(property => property.sale === "For Sale" || property.sale === "For Rent").length;
  const pendingProperties = validProperties.filter(property => property.isDraft===true).length;

  // ---- BACKEND ADDED: fetch real users count from backend ----
  const [totalUsers, setTotalUsers] = useState<number>(0);

  // ---- BACKEND ADDED: stats state — only used for percentages and arrow direction ----

  // This state only holds the percentage change compared to last month
  const [stats, setStats] = useState({
    totalProperties: { percent: 0 },
    activeListings: { percent: 0 },
    pendingProperties: { percent: 0 },
    totalUsers: { percent: 0 },
  });

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        // ---- BACKEND ADDED: fetch both users count and dashboard stats at the same time ----
        const [data, statsData] = await Promise.all([
          getUsersCount(),     // gets total users count + percent
          getDashboardStats(), // gets percentage changes for properties
        ]);

        if (data.success) {
          setTotalUsers(data.count);
        }

        // ---- BACKEND ADDED: set only the percentage data from backend ----

        if (statsData.success) {
          setStats({
            totalProperties: { percent: statsData.stats.totalProperties.percent },
            activeListings: { percent: statsData.stats.activeListings.percent },
            pendingProperties: { percent: statsData.stats.pendingProperties.percent },
            totalUsers: { percent: data.percent ?? 0 },
          });
        }
      } catch (error) {
        console.error("Failed to fetch users count:", error);
      }
    };
    fetchUsersCount();
  }, []);

  const StatCard = ({ 
  title, 
  value, 
  percent, 
  onTitleClick 
}: { 
  title: string, 
  value: number, 
  percent: number, 
  onTitleClick?: () => void 
}) => {
  // Logic to determine color and icon based on percentage
  const isPositive = percent > 0;
  const isNegative = percent < 0;
  const isNeutral = percent === 0;

  return (
  <div className="bg-white p-4 rounded-xl border-[1px] border-[#1A3C34] shadow-sm">
    <p 
      onClick={onTitleClick}
      className={`text-[#23272E] text-[18px] font-bold font-['Lato'] inline-block ${
        onTitleClick ? "cursor-pointer underline hover:transition-all hover:transform hover:scale-105" : ""
      }`}
    >
      {title}
    </p>
    <div className="flex gap-1 mt-3 relative items-end">
      <h2 className="text-[28px] font-bold text-[#023337]">{value.toLocaleString()}</h2>
      <span className={`flex items-center mb-2 text-[11px] font-medium font-500 ${
        isPositive ? "text-[#21C45D]" : isNegative ? "text-red-500" : "text-gray-400"
      }`}>
        {/* Only show the arrow image if the percentage is not 0 */}
        {isNeutral && (
          <img className="w-2 h-2 mr-1" src={isNeutral ? dot : isPositive ? up : down} alt="" />
        )}
        {/* Math.abs removes the minus sign if the number is negative */}
        {Math.abs(percent)}%
      </span>
    </div>
  </div>
  );
};

  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage] = useState(4);

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  
  const currentPropertyPagin = [...validProperties].reverse().slice(firstPostIndex, lastPostIndex);

  return (
    <div className="flex flex-col bg-[#F3F4F6] min-h-screen w-full">
      <nav className="w-full h-[76px] bg-white px-4 md:px-10 flex items-center border-b sticky top-0 z-10">
        <h1 className="font-['Lato'] font-bold text-[22px] text-[#023337]">Dashboard</h1>
      </nav>

      <div className="px-4 md:px-10 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="font-['Lato'] font-bold text-[22px] text-[#023337]">DashBoard</h1>
            <p className="text-[14px] font-normal text-black font-['Lato']">Welcome back, Admin</p>
          </div>
          <button 
            onClick={() => {
                setActivePage("Add Property");
                navigate("/adminPage/add-property");
            }}
            className="w-full sm:w-auto bg-[#1A3C34] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#264d43] transition-all transform hover:scale-105 shadow-md">
            Add Property
          </button>
        </div>

        {/* ---- BACKEND UPDATED: value still uses original local counts ---- */}
        {/* ---- BACKEND UPDATED: image and percent are now handled internally by StatCard logic ---- */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Properties" 
          value={totalProperties} 
          percent={stats.totalProperties.percent} 
        />
        <StatCard 
          title="Total Users" 
          value={totalUsers}  
          percent={stats.totalUsers.percent} 
          onTitleClick={() => navigate("users")}
        />
        <StatCard 
          title="Active Listings" 
          value={activeListings} 
          percent={stats.activeListings.percent} 
        />
        <StatCard 
          title="Pending Properties" 
          value={pendingProperties} 
          percent={stats.pendingProperties.percent} 
        />
      </div>

        <div className="mt-12 bg-white rounded-lg overflow-hidden border">
          <div className="px-6 md:px-8 py-6">
            <h3 className="font-medium font-['Lato'] text-[22px] md:text-[24px] text-black">Recent Properties</h3>
          </div>

          <div className="overflow-x-auto px-2 md:px-5">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-[#B1FFED] text-[#023337] text-[15px] font-bold text-left">
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-8 py-4">Price</th>
                  <th className="px-8 py-4">Listing</th>
                  <th className="px-8 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {currentPropertyPagin.map((proper) => (
                  // ---- BACKEND UPDATED: key uses _id instead of id ----
                  <tr key={proper._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 min-w-[250px]">
                      <div className="flex items-center gap-3">
                        {proper.images && (
                          <img 
                            src={Array.isArray(proper.images) ? proper.images[0] : proper.images} 
                            alt="" 
                            className="w-12 h-12 rounded-lg object-cover border" 
                          />
                        )}
                        <span className="font-bold text-[#0A1916] text-[14px] lg:text-[15px]">
                          {proper.propertyName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-[#4F887B] text-[14px]">{proper.propertyType}</td>
                    <td className="px-6 py-5 text-[#4F887B] text-[14px] truncate hover:whitespace-normal hover:overflow-visible max-w-[150px]">
                      {proper.location.fullAddress}
                    </td>
                    <td className="px-8 py-5 font-bold text-[#1A3C34]">₦{proper.price.toLocaleString()}</td>
                    <td className="px-8 py-5 ">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${proper.sale === "For Sale" ? "bg-[#10B981]" : "bg-[#F59E0B]"}`}></span>
                        <span className="text-[#023337] font-medium text-[14px] whitespace-nowrap">{proper.sale}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => { setEditingProperty(proper); navigate("/adminPage/edit-property"); }} className="text-[#21C45D] font-bold text-[13px]">Edit</button>
                        <span className="text-[#21C45D]">/</span>
                        <button onClick={() => deleteProperty(proper._id)} className="text-red-500 font-bold text-[13px]">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {validProperties.length === 0 && (
            <div className="py-20 text-center text-[#75928B]">No properties found.</div>
          )}
        </div>

        <div className='w-full flex justify-center mt-8'>
          <Pagination
            totalPosts={validProperties.length}
            postPerPage={postPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;