import { Link, useNavigate } from "react-router-dom";
import desktop from "../../src/assets/desktop.png"
import mobile from "../../src/assets/mobile.png"
import nestpro from "../../src/assets/logo.png"

import React, { useState , type FC } from "react";
import { registerUser } from "../services/api";
import Modal from "../Components/Universal/Modal";

// Import eye icons from Lucide React
import { Eye, EyeOff } from "lucide-react";  


type Form = {
  email: string;
  password: string;
  confirmpassword: string;
  terms: boolean;
};
type ErrorType = {
  email: boolean;
  password: boolean;
  confirmpassword: boolean;
  terms: boolean;
};

const SignUp:FC = () => {
  
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
    confirmpassword: "",
    terms: false,
  });
  const [error, setError] = useState<ErrorType>({
    email: false,
    password: false,
    confirmpassword: false,
    terms: false,
  });
  
  // ---- PASSWORD VISIBILITY: states for toggling password visibility ----
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // ---- BACKEND ADDED: loading state ----
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ---- BACKEND ADDED: modal state ----
  const [modal, setModal] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputFieldName = name as keyof Form;
    setForm({ ...form, [inputFieldName]: type === "checkbox" ? checked : value });
    setError({ ...error, [inputFieldName]: false });
  };

  // ---- PASSWORD VISIBILITY: functions to toggle password visibility ----
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

 // ---- BACKEND UPDATED: handleSubmit is now async and calls real backend ----
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;
    const newError: ErrorType = {
      email: false,
      password: false,
      confirmpassword: false,
      terms: false,
    };

    if (!form.email.trim() || !form.email.includes("@")) {
      newError.email = true;
      hasError = true;
    }

    if (!form.password.trim() || form.password.length < 8) {
      newError.password = true;
      hasError = true;
    }

    if (!form.confirmpassword.trim() || form.confirmpassword !== form.password) {
      newError.confirmpassword = true;
      hasError = true;
    }

    if (!form.terms) {
      newError.terms = true;
      // ---- BACKEND UPDATED: show modal instead of alert ----
      setModal({
        show: true,
        type: "error",
        message: "You must agree to the terms and conditions.",
      });
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    try {
      setIsLoading(true);

      // ---- BACKEND CALL: send registration data to real backend ----
      const result = await registerUser({
        name: form.email.split("@")[0],
        email: form.email,
        password: form.password,
      });

      if (result.success) {
        // ---- BACKEND ADDED: show success modal then go to login ----
        setModal({
          show: true,
          type: "success",
          message: "Account created! Please check your email to verify your account.",
        });
      } else {
        // ---- BACKEND ADDED: show error modal with backend message ----
        setModal({
          show: true,
          type: "error",
          message: result.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      // ---- BACKEND ADDED: show error modal on network failure ----
      setModal({
        show: true,
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }

    setForm({
      email: "",
      password: "",
      confirmpassword: "",
      terms: false,
    });
  };
  
// ---- BACKEND ADDED: handle modal close ----
  // if success, navigate to login when user clicks OK
  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.type === "success") {
      navigate("/login");
    }
  };
  
  return (
    <div className="w-full h-screen bg-white flex items-center justify-center overflow-hidden font-[Manrope]">
      <div className="flex flex-col md:flex-row w-full h-full max-w-[1600px] mx-auto"> 
        
        {/* FORM SECTION */}
        <div className="w-full h-full md:w-1/2 flex md:mt-9 overflow-y-auto px-4 order-2 md:order-1">
          <form 
            onSubmit={handleSubmit}
            className="md:w-[507px] w-full flex flex-col mx-auto px-2 pb-10 md:pb-0 pt-4 md:pt-6"
          >
            <div className="flex flex-col gap-3">
                <div className="flex gap-4 items-center mb-2">
                    <img className="hidden md:block w-6 cursor-pointer hover:scale-135 hover:transition-all hover:transform" src={nestpro} onClick={()=>navigate("/")} alt="logo-icon" />
                    <h1 onClick={() => navigate("/")} className="text-[#1A3C34] font-[Manrope] font-[700] text-[22.17px] hidden md:block cursor-pointer">NestFinder Pro</h1>
                </div>
                
                <h4 onClick={() => { if (window.innerWidth < 768) navigate("/"); }} className="text-[17px] md:text-[32px] font-semibold tracking-wide md:cursor-default cursor-pointer">Create An account</h4>
                <span className="font-light text-[13px] mb-6 font-[Inter] text-[#525050]">Already have an account?
                    <Link to="/login" className="underline font-medium ml-1 transition-all transform hover:scale-105">Log In</Link>
                </span>
            </div>

            {/* EMAIL FIELD */}
            <label className={`text-[13px] font-medium ${error.email ? "text-red-500" : "text-black"}`} htmlFor="email">Email</label>
            <input
                type="text"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full h-9 md:h-11.25 p-2 border-2 text-[14px] mb-4 rounded-lg my-2 block focus:outline-none transition-all duration-200
                ${error.email ? "border-red-500 " : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
            />
            {error.email && (
              <p className="text-red-500 text-[12px] mb-3">
                {!form.email.trim()
                ? "Email cannot be left blank"
                : "Please enter a valid email address"}
              </p>
            )}
            
            {/* PASSWORD FIELD WITH EYE ICON */}
            <label className={`text-[13px] font-medium ${error.password ? "text-red-500" : "text-black"}`} htmlFor="password">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password (min 8 characters)"
                className={`w-full h-9 md:h-11.25 p-2 border-2 text-[14px] mb-4 rounded-lg my-2 block focus:outline-none transition-all duration-200 pr-12
                ${error.password ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
              />
              
              {/* Eye icon button for password */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {error.password && (
              <p className="text-red-500 text-[12px] -mt-3 mb-3">
                {!form.password.trim()
                ? "Password cannot be left blank"
                : "Password must be at least 8 characters"}
              </p>
            )}
            
            {/* CONFIRM PASSWORD FIELD WITH EYE ICON */}
            <label className={`text-[13px] font-medium ${error.confirmpassword ? "text-red-500" : "text-black"}`}>Confirm Password</label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmpassword"
                id="confirmpassword"
                value={form.confirmpassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`w-full h-9 md:h-11.25 p-2 border-2 text-[14px] mb-4 rounded-lg my-2 block focus:outline-none transition-all duration-200 pr-12
                ${error.confirmpassword ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
              />
              
              {/* Eye icon button for confirm password */}
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {error.confirmpassword && (
              <p className="text-red-500 text-[12px] -mt-3 mb-3">
                {!form.confirmpassword.trim()
                ? "Confirm password cannot be left blank"
                : "Passwords do not match"}
              </p>
            )}
           
            {/* TERMS AND CONDITIONS */}
            <div className='flex flex-row gap-2 items-center mt-2'>
                <input 
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                    className={`w-4 h-4 transition-all duration-200 ${error.terms ? "accent-red-500" : "accent-[#1A3C34]"}`}
                />
                <label htmlFor="terms" className={`text-[12px] ${error.terms ? "text-red-500" : "text-black"}`}>
                    I agree to the terms and conditions
                </label>
            </div>
            
            {/* SIGN UP BUTTON */}
            <button 
              disabled={isLoading}
              className="w-full h-[49px] bg-[#1A3C34] rounded-lg text-white font-light my-6 px-[24px] py-[12px] hover:bg-[#264d43] transition-all transform hover:scale-105 disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* IMAGE SECTION */}
        <div className="w-full h-[40vh] md:h-screen md:w-1/2 order-1 md:order-2 md:fixed md:right-0 md:top-0">
          <img className="hidden md:block w-full h-screen object-cover" src={desktop} alt="desktop-img" />
          <img className="block md:hidden w-full h-full object-cover" src={mobile} alt="mobile-img" />
        </div>

      </div>

      {/* MODAL FOR MESSAGES */}
      {modal.show && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={handleModalClose}
        />
      )}
    </div>
  )
}

export default SignUp;