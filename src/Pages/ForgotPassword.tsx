import React, { useState } from "react";
import desktop from "../../src/assets/desktop.png"
import mobile from "../../src/assets/mobile.png"
import nestpro from "../../src/assets/logo.png"
import { Link, useNavigate } from "react-router-dom";

// ---- BACKEND: imported forgotPassword from api service ----
import { forgotPassword } from "../services/api";

// ---- BACKEND ADDED: imported Modal component ----
import Modal from "../Components/Universal/Modal";

type User = {
  email: string;
};
type ErrorType = {
  email: boolean;
};

const ForgotPassword = () => {
  const [user, setUser] = useState<User>({
    email: "",
  });
  const [error, setError] = useState<ErrorType>({
    email: false,
  });
  const navigate = useNavigate();

  // ---- BACKEND ADDED: states for loading and modal feedback ----
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
    // typescript needs help knowing that name is a key of user
    const inputFieldName = name as keyof User;
    setUser({ ...user, [inputFieldName]: value });
    // remove the error when there is a value in the input field
    setError({ ...error, [inputFieldName]: false });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     // step 1, create a variable to catch the errors or determine if an error occured
    let hasError = false;

    // step 2, create a placeholder object for the error state
    const newError: ErrorType = { email: false };

    if (!user.email.trim() || !user.email.includes("@")) {
      newError.email = true;
      hasError = true;
    }

    if (hasError) {
      setError(newError);
      return;
    }

    try {
      setIsLoading(true);
       //---- BACKEND CALL: send email to real backend ----
      // ---- BACKEND REMOVED: navigate("/resetpassword") directly ----
      // ---- BACKEND REMOVED: navigate("/resetpassword", { state: { email: user.email } }) ----
      // ---- Now the backend sends a real reset email with a token link ----
      const result = await forgotPassword(user.email);

     if (result.success) {
        // ---- BACKEND ADDED: show success modal then go to login ----
        setModal({
          show: true,
          type: "success",
          message: result.message || "Password reset link sent! Please check your email.",
        });
      } else {
        // ---- BACKEND ADDED: show error modal ----
        setModal({
          show: true,
          type: "error",
          message: result.message || "Something went wrong. Please try again.",
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

    // reset form
    setUser({ email: "" });
    setError({ email: false });
  };

  // ---- BACKEND ADDED: on success modal close go to login ----
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
              </div >
              <div className="flex flex-col gap-[12px]">
                    <h4 className="text-[24px] md:text-[32px] font-semibold">Forgot Password</h4>
              <p className="text-[12px] md:text-[13px] font-[Inter] text-[#525050">welcome back, Please enter your details</p> 
              </div>
            
              <label 
                className={`text-[13px] mb-3 font-medium ${error.email ? "text-red-500" : "text-black"}`}
                htmlFor="email"
              >
                Email
              </label>
            </div>
       
            <input
              type="text"
              name="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full h-9 md:h-11.25 p-2 border-2 text-[10px] md:text-[14px] rounded-lg my-0 md:my-2 block focus:outline-none transition-all duration-200
                ${error.email 
                  ? "border-red-500 placeholder-red-500 " 
                  : "border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                }`}
            />
            
            {error.email && (
              <p className="text-red-500 text-[12px] mb-3">
               {!user.email.trim()
               ? "Email cannot be left blank"
               : "Please enter a valid email address"}
               </p>
            )}
         
           {/* ---- BACKEND ADDED: button shows loading state ---- */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-[49px] bg-[#1A3C34] rounded-lg text-white text-[14px] font-light block my-6 hover:bg-[#264d43] transition-all transform hover:scale-105 disabled:opacity-80 disabled:cursor-not-allowedn px-[24px] py-[12px] "
            >
              {isLoading ? "Sending..." : "Recover Password"}
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

export default ForgotPassword;