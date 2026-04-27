// import React from 'react'
import type { FC } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"


// TG i decided to change the props drilling to context api so we can have cleaner code, go to the folder called context to see the authcontext and anything you don't understand let me know
const HeaderContentSec: FC = () => { 
  const {setShowModal, isLoggedIn}=useAuth()
  const navigate = useNavigate()

  return (
    <div className="bg-[url(/src/assets/header.jpg)] bg-no-repeat bg-cover ">
        <div className="bg-[#000000B2] h-[712px]">
        <div className="container mx-auto flex flex-col justify-center items-center gap-[45px] md:gap-[48px] py-[173px] ">
            <h1 className="font-[Manrope] font-[700] text-[28px] md:text-[70px] text-center text-[#FFFFFF] w-[20rem] md:w-[40rem] leading-tight max-[321px]:text-[24px]">Smart Way To Find Your Next Home</h1>
            <p className="font-Inter font-[400] text-[14px] md:text-[21px] leading-[34px] text-center text-[#FFFFFF] w-[20rem] md:w-[45rem]  max-[321px]:w-[18rem] font-[Inter]">Unlock your dream home at NestFinder Pro. We help you compare, discover and make sure you have a lovely stay in your beautiful apartment.  </p>

            <button className="bg-[#F4A261] py-[12px] px-[24px] w-[285px] md:w-[145px] rounded-[10px] font-[Manrope] font-[400] text-[18px] text-[#FFFFFF] hover:bg-[#f89a4d] transition-all transform hover:scale-105" type="submit" onClick={() => isLoggedIn? navigate("/Property") : setShowModal(true)}>Get Started</button>

        </div>
        </div>
    </div>
  )
}

export default HeaderContentSec