import { Routes, Route, Navigate } from "react-router-dom"


import PropertyPage from './Pages/PropertyListing'
import HomePage from './Pages/Home'

import './App.css'
import LogIn from './Pages/LoginIn';
import SignUp from './Pages/SignUp';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';

import PropertyDetails from './Pages/PropertyDetails';
import Error404 from './Pages/Error404';
import ProtectedRoute from './Components/Universal/ProtectedRoute';
import AdminPage from './Pages/AdminPage';
import { useAuth } from "./context/AuthContext";
import VerifyEmail from "./Pages/VerifyEmail";
import AboutPage from "./Pages/About";


function App() {
const { isCheckingAuth } = useAuth();

  // ---- BACKEND ADDED: show nothing while checking auth on refresh ----
  // ---- Prevents flash of wrong UI state ----
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 rounded-full border-4 border-[#1A3C34] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" />} />
         <Route path="/about" element={<AboutPage />} />
        <Route
          path="/login"
          element={ <LogIn/>
          }
        />
        <Route path="/signup" element={<SignUp  />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail/>} />
         

        <Route element={<ProtectedRoute />}>
          <Route path="/property" element={<PropertyPage />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
        </Route>

        <Route element={<ProtectedRoute  adminOnly={true} />}>
          <Route path="/adminPage/*" element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>

      
      
    </>
  );
}

export default App;