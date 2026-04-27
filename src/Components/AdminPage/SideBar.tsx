import Logo from "/src/assets/logo.png"
import user from "/src/assets/manage.png"
import home from "/src/assets/dashboard.png"
import users from "/src/assets/users.png"
import enquiries from "/src/assets/clipboard.png"
import circle from "/src/assets/addd.png"

import { ManageContext } from "../../context/ManagePropertyContext"
import { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// ---- BACKEND ADDED: imported removeToken to clear JWT on logout ----
import { removeToken } from "../../services/api"

const Sidebar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const manageContext = useContext(ManageContext)
    if (!manageContext) return ("No content")

    const { activepage, setActivePage } = manageContext

    // ---- HELPER CONSTANTS FOR NAVIGATION LOGIC ----
    const isActive = (path: string) => location.pathname === path;
    const isPageActive = (page: string) => activepage === page;

    // ---- NAVIGATION FUNCTIONS (CLEANER ONCLICK HANDLERS) ----
    const handleDashboardClick = () => {
        setActivePage("Dashboard");
        navigate("/adminPage");
    };

    const handleAddPropertyClick = () => {
        setActivePage("Add Property");
        navigate("/adminPage/add-property");
    };

    const handleManageClick = () => {
        setActivePage("All Properties");
        navigate("/adminPage/manage-property");
    };

    // ---- BACKEND ADDED: navigate to enquiries page ----
    const handleEnquiriesClick = () => {
        setActivePage("Enquiries");
        navigate("/adminPage/enquiries");
    };

    const handleLogout = () => {
        removeToken();
        navigate("/login");
    };

    // This encapsulates the tutor's logic for active states 
    const getSidebarActiveStates = () => {
        const isDashboardActive =
              (isActive("/adminPage") || isActive("/adminPage/users")) 
              &&
            !isPageActive("Add Property") &&
            !isPageActive("Update Property") &&
            !isPageActive("All Properties") &&
            !isPageActive("For Sale") &&
            !isPageActive("For Rent") &&
            !isPageActive("Featured") &&
            !isPageActive("Draft") &&
            !isPageActive("Enquiries");

        const isAddPropertyActive =
            isActive("/adminPage/add-property") ||
            isPageActive("Add Property") ||
            isPageActive("Update Property");

        const isManageActive =
            (isActive("/adminPage/manage-property") ||
                isPageActive("All Properties") ||
                isPageActive("For Sale") ||
                isPageActive("For Rent") ||
                isPageActive("Featured") ||
                isPageActive("Draft")) &&
            !isPageActive("Add Property") &&
            !isPageActive("Update Property");

        // ---- BACKEND ADDED: Enquiries is active when on enquiries page ----
        const isEnquiriesActive =
            isPageActive("Enquiries") ||
            isActive("/adminPage/enquiries");

        return { isDashboardActive, isAddPropertyActive, isManageActive, isEnquiriesActive };
    };

    const { isDashboardActive, isAddPropertyActive, isManageActive, isEnquiriesActive } = getSidebarActiveStates();

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#BAB9B9] z-50 lg:static lg:w-[260px] lg:min-h-screen lg:border-t-0 lg:border-r flex lg:flex-col justify-between">
            
            <div className="w-full flex lg:flex-col">

                {/* Logo — desktop only */}
                <div className="hidden lg:flex items-center gap-[4px] p-[20px] h-[76px] w-[260px]">
                    <div className="flex items-center gap-[10.22px] w-[162.22px] h-[46px]">
                        <img className="cursor-pointer hover:transition-all hover:transform hover:scale-135" src={Logo} onClick={() => navigate("/")} alt="Arrow Logo" />
                        <h1 className="font-Manrope font-bold text-[17.89px] leading-none text-[#1A3C34]">
                            NestFinder Pro
                        </h1>
                    </div>
                </div>

                {/* MENU SECTION */}
                <div className="flex flex-row lg:flex-col w-full lg:mt-[15px] lg:gap-6">
                    <div className="hidden lg:flex px-6 h-6 items-center">
                        <h1 className="font-lato font-normal text-[15px] text-[#4F887B] uppercase tracking-wide">
                            Main Menu
                        </h1>
                    </div>

                    <div className="flex flex-row lg:flex-col w-full justify-around lg:justify-start lg:gap-5 py-2 lg:py-0">
                        
                        {/* Home — mobile only */}
                        <div 
                            onClick={() => navigate("/")} 
                            className="flex flex-col items-center w-full py-1 px-1 gap-0.5 cursor-pointer lg:hidden text-[#4F887B]"
                        >
                            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-lato text-[9px]">Home</span>
                        </div>

                        {/* Dashboard */}
                        <div 
                            onClick={handleDashboardClick} 
                            className={`flex flex-col lg:flex-row items-center w-full lg:w-[260px] py-1 lg:py-[9px] px-1 lg:px-4 gap-0.5 lg:gap-2 cursor-pointer transition-colors
                            ${isDashboardActive ? "lg:bg-[#1A3C34] text-[#1A3C34] lg:text-white" : "text-[#4F887B] lg:bg-transparent"}`}
                        >
                            <img className={`w-4 h-4 lg:w-6 lg:h-6 ${isDashboardActive ? "" : "opacity-70"}`} src={home} alt="home" />
                            <span className="font-lato text-[9px] lg:text-[16px]">Dashboard</span>
                        </div>

                        {/* Add Property */}
                        <div 
                            onClick={handleAddPropertyClick} 
                            className={`flex flex-col lg:flex-row items-center w-full lg:w-[260px] py-1 lg:py-[9px] px-1 lg:px-4 gap-0.5 lg:gap-2 cursor-pointer transition-colors
                            ${isAddPropertyActive ? "lg:bg-[#1A3C34] text-[#1A3C34] lg:text-white" : "text-[#4F887B] lg:bg-transparent"}`}
                        >
                            <img className={`w-4 h-4 lg:w-6 lg:h-6 ${isAddPropertyActive ? "" : "opacity-70"}`} src={circle} alt="add" />
                            <span className="hidden md:block font-lato text-[9px] lg:text-[16px]">Add Property</span>
                            <span className="font-lato text-[9px] block md:hidden">Add</span>
                        </div>

                        {/* Manage Property */}
                        <div 
                            onClick={handleManageClick} 
                            className={`flex flex-col lg:flex-row items-center w-full lg:w-[260px] py-1 lg:py-[9px] px-1 lg:px-4 gap-0.5 lg:gap-2 cursor-pointer transition-colors
                            ${isManageActive ? "lg:bg-[#1A3C34] text-[#1A3C34] lg:text-white" : "text-[#4F887B] lg:bg-transparent"}`}
                        >
                            <img className={`w-4 h-4 lg:w-6 lg:h-6 ${isManageActive ? "" : "opacity-70"}`} src={user} alt="manage" />
                            <span className="hidden md:block font-lato text-[9px] lg:text-[16px]">Manage Property</span>
                            <span className="font-lato text-[9px] block md:hidden">Manage</span>
                        </div>

                        {/* ---- BACKEND ADDED: Enquiries sidebar item ---- */}
                        <div 
                            onClick={handleEnquiriesClick} 
                            className={`flex flex-col lg:flex-row items-center w-full lg:w-[260px] py-1 lg:py-[9px] px-1 lg:px-4 gap-0.5 lg:gap-2 cursor-pointer transition-colors
                            ${isEnquiriesActive ? "lg:bg-[#1A3C34] text-[#1A3C34] lg:text-white" : "text-[#4F887B] lg:bg-transparent"}`}
                        >
                            <img className={`w-4 h-4 lg:w-6 lg:h-6 ${isEnquiriesActive ? "" : "opacity-70"}`} src={enquiries} alt="enquiries" />
                            <span className="hidden md:block font-lato text-[9px] lg:text-[16px]">Enquiries</span>
                            <span className="font-lato text-[9px] block md:hidden">Enquiries</span>
                        </div>

                        {/* Logout — mobile only */}
                        <div
                            onClick={handleLogout}
                            className="flex flex-col items-center w-full py-1 px-1 gap-0.5 cursor-pointer lg:hidden text-[#FF0000]"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-lato text-[9px]">Logout</span>
                        </div>

                    </div>
                </div>
            </div>

            {/* Logout — desktop sidebar only */}
            <div className="hidden lg:flex items-center px-5 py-6 mt-auto">
                <div className="flex items-center gap-2">
                    <img src={users} alt="user" />
                    <button
                        onClick={handleLogout}
                        className="text-[#FF0000] font-lato text-[16px] font-medium hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;