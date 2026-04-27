import desktop from "../../src/assets/desktop.png"
import mobile from "../../src/assets/mobile.png"
import nestpro from "../../src/assets/logo.png"
import { Link, useNavigate } from "react-router-dom";
import React, { useState, type FC } from "react";
import { useAuth } from "../context/AuthContext";

// Import eye icons you'll need to install lucide-react
import { Eye, EyeOff } from "lucide-react"; 

// ---- BACKEND: imported loginUser and saveToken from api service ----
import { loginUser, saveToken } from "../services/api";

// ---- BACKEND ADDED: imported Modal component ----
import Modal from "../Components/Universal/Modal";

type Form = { 
  email: string; 
  password: string; 
  terms: boolean; 
};

type ErrorType = {
   email: boolean;
   password: boolean; 
};

const LogIn: FC = () => {

  const { setIsLoggedIn, setUser, setIsAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState<Form>({ email: "", password: "", terms: false });
  const [error, setError] = useState<ErrorType>({ email: false, password: false });
  
  // ---- PASSWORD VISIBILITY: new state for toggling password visibility ----
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputFieldName = name as keyof Form;
    setForm({ ...form, [inputFieldName]: type === "checkbox" ? checked : value });
    setError({ ...error, [inputFieldName as keyof ErrorType]: false });
  };

  // ---- PASSWORD VISIBILITY: function to toggle password visibility ----
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = form;

    // Validation
    let hasError = false;
    const newError: ErrorType = { email: false, password: false };

    if (!email.trim() || !email.includes("@")) {
      newError.email = true;
      hasError = true;
    }
    if (!password.trim() || password.length < 8) {
      newError.password = true;
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    try {
      setIsLoading(true);

      const result = await loginUser({ email, password });

      if (result.success) {
        saveToken(result.token);
        setIsLoggedIn(true);
        setUser({ name: result.user.name, email: result.user.email });

        if (result.user.role === "admin") {
          setIsAdmin(true);
          navigate("/adminPage");
        } else {
          setIsAdmin(false);
          navigate("/");
        }
      } else {
        setModal({
          show: true,
          type: "error",
          message: result.message || "Login failed. Please try again.",
        });
      }
    } catch (error) {
      setModal({
        show: true,
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center overflow-hidden">
      <div className="flex flex-col md:flex-row w-full h-screen max-w-[1600px] mx-auto items-center justify-center container">
        
        <div className="w-full h-full md:w-1/2 md:mr-[50%] flex md:mt-9 overflow-y-auto px-4 order-2 md:order-1">
          <form onSubmit={handleSubmit} className="md:w-[507px] w-full flex flex-col mx-auto px-2 pb-10 md:pb-0 pt-4 md:pt-6">
            <div className="flex flex-col gap-3">
              <div className="flex gap-4 items-center mb-2">
                
                <img className="hidden md:block w-6 cursor-pointer hover:scale-135 hover:transition-all hover:transform" src={nestpro} onClick={() => navigate("/")} alt="arrow" />
                <h1 onClick={() => navigate("/")} className="text-[#1A3C34] font-[Manrope] font-[700] text-[22.17px] hidden md:block cursor-pointer">NestFinder Pro</h1>
              </div>
              
              <h4 
                onClick={() => { if (window.innerWidth < 768) navigate("/"); }} 
                className="text-[17px] md:text-[32px] font-[700] font-[Manrope] md:cursor-default cursor-pointer text-[#081411]"
              >
                Log in
              </h4>
              <p className="mb-4 text-[11px] md:text-[13px] font-[Inter] text-[#525050]">welcome back, Please enter your details</p>
            </div>

            <label className={`text-[13px] ${error.email ? "text-red-500" : "text-black"}`}>Email</label>
            <input 
              type="text" 
              name="email" 
              id="email"
              value={form.email} 
              onChange={handleChange} 
              placeholder="Enter your email"
              className={`w-full font-[Manrope] font-[400] h-11.25 p-2 border-2 text-[14px] mb-4 rounded-lg my-2 focus:outline-none transition-all duration-200
               ${error.email ? "border-red-500 placeholder-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"}`}
            />

            {error.email && (
              <p className="text-red-500 text-[12px] mb-3 font-[Manrope]">
                {!form.email.trim() ? "Email cannot be left blank" : "Please enter a valid email address"}
              </p>
            )}

            <label className={`text-[13px] font-[Manrope] font-medium ${error.password ? "text-red-500" : "text-black"}`}>Password</label>
            
            {/* ---- UPDATED: Password input with eye icon wrapper ---- */}
            <div className="relative w-full mb-4">
              <input 
                type={showPassword ? "text" : "password"}
                name="password" 
                id="password"
                value={form.password} 
                onChange={handleChange} 
                placeholder="Enter your password"
                className={`w-full h-11.25 p-2 border-2 font-[Manrope] text-[14px] rounded-lg my-2 focus:outline-none transition-all duration-200 pr-12
                 ${error.password ? "border-red-500 placeholder-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"}`}
              />
              
              {/* Eye icon button */}
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
              <p className="text-red-500 text-[12px] -mt-3 mb-3 font-[Manrope]">
                {!form.password.trim() ? "Password cannot be left blank" : "Password must be at least 8 characters"}
              </p>
            )}

            <div className='flex flex-row justify-between md:mt-2 md:pb-6 font-[Manrope]'>
              <div className='flex flex-row gap-1 '>
                <input type="checkbox" id="terms" name="terms" checked={form.terms} onChange={handleChange} className="accent-[#1A3C34]" />
                <p className='text-[12px]'>Remember Me</p>
              </div>
              <span className="text-[12px] text-red-500 hover:cursor-pointer underline transition-all transform hover:scale-105">
                <Link to="/forgotpassword">Forgot Password?</Link>
              </span>
            </div>

            <button 
              disabled={isLoading}
              className="w-full font-[Manrope] h-[49px] bg-[#1A3C34] rounded-lg text-white font-light my-6 hover:bg-[#264d43] transform hover:scale-105 px-[24px] py-[12px] disabled:opacity-80 disabled:cursor-not-allowed">
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <span className="flex justify-center gap-2 font-light text-[14px] font-[Manrope]">
              Not registered yet? <Link to="/signup" className="underline font-medium transition-all transform hover:scale-105">Create an Account</Link>
            </span>
          </form>
        </div>

        <div className="w-full h-[40vh] md:h-screen md:w-1/2 order-1 md:order-2 md:fixed md:right-0 md:top-0">
          <img className="hidden md:block w-full h-screen object-cover" src={desktop} alt="desktop-img" />
          <img className="block md:hidden w-full h-full object-cover" src={mobile} alt="mobile-img" />
        </div>
      </div>

      {modal.show && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal({ ...modal, show: false })}
        />
      )}
    </div>
  );
};

export default LogIn;