import React, { useState } from "react";
import desktop from "../../src/assets/desktop.png";
import mobile from "../../src/assets/mobile.png";
import nestpro from "../../src/assets/logo.png";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

// ---- BACKEND REMOVED: ResetSuccess component no longer needed ----
// ---- We use Modal instead ----
// import ResetSuccess from "./ResetSuccess";

// ---- BACKEND: imported resetPassword from api service ----
import { resetPassword } from "../services/api";

// ---- BACKEND ADDED: imported Modal component ----
import Modal from "../Components/Universal/Modal";


// Import eye icons from Lucide React
import { Eye, EyeOff } from "lucide-react";  

type User = {
  password: string;
  confirmpassword: string;
};
type ErrorType = {
  password: boolean;
  confirmpassword: boolean;
};

const ResetPassword = () => {
  const [user, setUser] = useState<User>({
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState<ErrorType>({
    password: false,
    confirmpassword: false,
  });

  // ---- PASSWORD VISIBILITY: states for toggling password visibility ----
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  // ---- BACKEND ADDED: get token from URL query params ----
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();


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
    const { name, value } = e.target;
    const inputFieldName = name as keyof User;
    setUser({ ...user, [inputFieldName]: value });
    setError({ ...error, [inputFieldName]: false });
  };
// ---- PASSWORD VISIBILITY: functions to toggle password visibility ----
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;
    const newError: ErrorType = {
      password: false,
      confirmpassword: false,
    };

    if (!user.password.trim() || user.password.length < 8) {
      newError.password = true;
      hasError = true;
    }

    if (!user.confirmpassword.trim() || user.confirmpassword !== user.password) {
      newError.confirmpassword = true;
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    // ---- BACKEND ADDED: get token from URL ----
    const token = searchParams.get("token");

    if (!token) {
      setModal({
        show: true,
        type: "error",
        message: "Invalid reset link. Please request a new one.",
      });
      return;
    }

    try {
      setIsLoading(true);

      // ---- BACKEND CALL: send new password to real backend ----
      const result = await resetPassword(token, {
        password: user.password,
        confirmPassword: user.confirmpassword,
      });

      if (result.success) {
        setModal({
          show: true,
          type: "success",
          message: result.message || "Password reset successful! You can now log in.",
        });
      } else {
        setModal({
          show: true,
          type: "error",
          message: result.message || "Something went wrong. Please try again.",
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

    setUser({ password: "", confirmpassword: "" });
  };

  const handleModalClose = () => {
    setModal({ ...modal, show: false });
    if (modal.type === "success") {
      navigate("/login");
    }
  };

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center overflow-hidden font-[Manrope]">
      <div className="flex flex-col md:flex-row w-full h-full max-w-[1600px] mx-auto">
        <div className="w-full h-full md:w-1/2 flex md:mt-9 overflow-y-auto px-4 order-2 md:order-1">
          <form
            onSubmit={handleSubmit}
            className="md:w-[507px] w-full flex flex-col mx-auto px-2 pb-10 md:pb-0 pt-4 md:pt-6"
          >
            <div className="flex flex-col gap-3">
              <div className="flex gap-4 items-center">
                <img
                  className="hidden md:block w-6 cursor-pointer hover:scale-135 hover:transition-all hover:transform"
                  src={nestpro}
                  onClick={() => navigate("/")}
                  alt="arrow"
                />
                <h1 onClick={() => navigate("/")} className="text-[#1A3C34] font-[Manrope] font-[700] text-[22.17px] hidden md:block cursor-pointer">NestFinder Pro</h1>
              </div>
              <h4 className="text-[17px] md:text-[32px] font-semibold">Reset Password</h4>
              <p className="mb-4 md:mb-6 text-[11px] lg:text-[18px]  md:text-[16px] md:w-85 w-full font-[Inter] font-[400] text-[#525050" >
                Please enter a new password to take you back to your account
              </p>
            </div>
             {/* PASSWORD FIELD WITH EYE ICON */}
            <label
              className={`text-[13px] font-medium pb-1.5 md:pb-0 ${error.password ? "text-red-500" : "text-black"}`}
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative w-full">
               <input
                 type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={handleChange}
                  className={`w-full h-9 md:h-11.25 p-2 border-2 text-[10px] md:text-[14px] mb-4 rounded-lg my-0 md:my-2 block focus:outline-none transition-all duration-200
                    ${error.password ? "border-red-500 placeholder-red-500" : "border-gray-300 placeholder-gray-400"}`}
            />
                {/* Eye icon button for password */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 md:top-1/2 top-4.5 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
            </div>
            
            {/* Trinity, I added this error message for password */}
            {error.password && (
              <p className="text-red-500 text-[12px] mb-3">
                {!user.password.trim()
                  ? "Password cannot be left blank"
                  : "Password must be at least 8 characters"}
              </p>
            )}
             {/* CONFIRM PASSWORD FIELD WITH EYE ICON */}
            <label
              className={`text-[13px] font-medium pb-1.5 md:pb-0 ${error.confirmpassword ? "text-red-500" : "text-black"}`}
              htmlFor="confirmpassword"
            >
              Confirm Password
            </label>
            <div className="relative w-full">
              <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmpassword"
              id="confirmpassword"
              placeholder="Re-enter your password"
              value={user.confirmpassword}
              onChange={handleChange}
              className={`w-full h-9 md:h-11.25 p-2 border-2 text-[10px] md:text-[14px] mb-4 rounded-lg my-0 md:my-2 block focus:outline-none transition-all duration-200
                ${error.confirmpassword ? "border-red-500 placeholder-red-500" : "border-gray-300 placeholder-gray-400"}`}
            />
               {/* Eye icon button for confirm password */}
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 md:top-1/2 top-4.5 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
            </div>
           
            {/* Trinity, I added this error message for confirm password */}
            {error.confirmpassword && (
              <p className="text-red-500 text-[12px] mb-3">
                {!user.confirmpassword.trim()
                  ? "Confirm password cannot be left blank"
                  : "Passwords do not match"}
              </p>
            )}

            {/* ---- BACKEND ADDED: button shows loading state ---- */}
            <button
              disabled={isLoading}
              className="w-full h-[49px] bg-[#1A3C34] rounded-lg text-white text-[14px] font-light block my-4 md:my-8 hover:bg-[#264d43] transition-all transform hover:scale-105 disabled:opacity-80 disabled:cursor-not-allowedn px-[24px] py-[12px] "
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <span className="flex flex-row items-center justify-center gap-2 font-light text-[13px]">
              Already have an account?
              <Link to="/login" className="underline font-medium transition-all transform hover:scale-105">Sign In</Link>
            </span>
          </form>
        </div>

        <div className="w-full h-[40vh] md:h-screen md:w-1/2 order-1 md:order-2 md:fixed md:right-0 md:top-0">
          <img className="hidden md:block w-full h-screen object-cover" src={desktop} alt="desktop-img" />
          <img className="block md:hidden w-full h-full object-cover" src={mobile} alt="mobile-img" />
        </div>
      </div>

      {/* ---- BACKEND REMOVED: ResetSuccess component ---- */}
      {/* ---- {showSuccess && <ResetSuccess />} ---- */}

      {/* ---- BACKEND ADDED: modal for success and error messages ---- */}
      {modal.show && (
        <Modal
          type={modal.type}
          message={modal.message}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default ResetPassword;