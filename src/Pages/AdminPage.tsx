import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../Components/AdminPage/SideBar';
import Dashboard from '../Components/AdminPage/DashBoard';
import ManageContent from '../Components/AdminPage/ManageContent[1]';
import { AddPropertyContent } from '../Components/AdminPage/AddPropertyContent[1]';
import Enquiries from '../Components/AdminPage/Enquiries';
import { useContext, useEffect } from 'react';
import { ManageContext } from '../context/ManagePropertyContext';
import Users from '../Components/AdminPage/Users';

const AdminPage = () => {

  const manageContext = useContext(ManageContext);
  const activePage = manageContext?.activepage;
  const setActivePage = manageContext?.setActivePage;
  const location = useLocation();

  // ---- BACKEND ADDED: sync activePage with URL on page refresh ----
  useEffect(() => {
    if (location.pathname === "/adminPage/manage-property") {
      if (activePage !== "Add Property" && activePage !== "Update Property") {
        setActivePage?.("All Properties");
      }
    } else if (location.pathname === "/adminPage/add-property") {
      setActivePage?.("Add Property");
    // ---- BACKEND ADDED: sync enquiries page on refresh ----
    } else if (location.pathname === "/adminPage/enquiries") {
      setActivePage?.("Enquiries");
    } else if (location.pathname === "/adminPage" || location.pathname === "/adminPage/dashboard") {
      if (activePage !== "Add Property" && activePage !== "Update Property") {
        setActivePage?.("Dashboard");
      }
    }
  }, [location.pathname]);
  return (
    <div className='flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden w-full bg-[#F3F4F6]'>
      
       <Sidebar />
      
       <main className='flex-1 w-full h-full overflow-y-auto pb-24 lg:pb-0'>
  
         <div className='w-full max-w-[1440px] mx-auto container flex flex-col items-center justify-start'>
            <div className='w-full'>
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="add-property" element={<AddPropertyContent />} />
                    <Route path="edit-property" element={<AddPropertyContent />} />
                    <Route path="manage-property" element={<ManageContent />} />
                    {/* ---- BACKEND ADDED: enquiries route ---- */}
                    <Route path="enquiries" element={<Enquiries />} />
                    <Route path="users" element={<Users />} />
                    
                
                </Routes>
            </div>
         </div>

       </main>
       
    </div>
  );
}

export default AdminPage;