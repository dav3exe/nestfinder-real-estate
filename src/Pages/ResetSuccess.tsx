// import React, { useState } from "react";
import { Link } from "react-router-dom";
import img from "../../src/assets/success.png"



// create individual state for email input field
const ResetSuccess = () => {
  return (
    <div className=" fixed inset-0 bg-black/50 flex items-center justify-center z-50 font-[Manrope] ">
      <div className="bg-white rounded-xl shadow-2xl px-6 py-8 flex flex-col items-center  animate-scaleIn gap-[20px] md:w-[350px]  w-[280px]">
        <img className="w-10 mb-4" src={img} alt="success-reset" />
        <h1 className="md:text-[18px] text-[13px] text-[#081411]" >Password changed successfully</h1>
        <p className="text-[12px] text-[#525050] text-center">Your password has been updated successfully you can now login with the new password.</p>
        
        <Link to="/login">
          <button className="w-[142px] h-[49px] bg-[#1A3C34] rounded-lg text-white text-[14px] flex items-center justify-center md:mt-4 mt-2  hover:bg-[#A5A8A8] px-[24px] py-[12px]">
          Go to Login
        </button>
        </Link>
      </div>
      </div>
  )
};

export default ResetSuccess