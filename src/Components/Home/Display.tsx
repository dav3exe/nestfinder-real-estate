
import { useNavigate } from "react-router-dom";
import { type FC } from "react";
import { useAuth } from "../../context/AuthContext";


const Display:FC = () => {
   const {isLoggedIn,setShowModal} = useAuth()
    const navigate = useNavigate();
  return (
    <div className=" max-w-[1200px] w-full px-8 md:px-4 mx-auto container flex justify-center items-center pb-22">
     <div className="bg-[#00000066] w-full max-w-[1240px] lg:h-[581px] h-[370px] rounded-[10px]">

       <div className="bg-[url(/src/assets/housing.jpg)] bg-no-repeat bg-cover  w-full lg:h-[581px] h-[370px] rounded-[10px] relative">

       <div className="flex flex-col justify-center items-center gap-5 lg:gap-[31px]  lg:w-[622px]  w-[80%] lg:h-[392px] md:h-[220px] h-[250px] absolute bottom-15 left-7 lg:bottom-20 lg:left-10 -translate-y-1.2 backdrop-blur-md bg-white/30 rounded-2xl shadow-xl  ">
            <h1 className="font-[Manrope] font-[700] text-center text-[20px] lg:text-[42px] text-[rgb(255,255,255)] tracking-[3%] w-[90%] lg:w-[25rem]  max-[321px]:text-[16px]">Ready To Find Your Perfect Home</h1>
            <p className="font-[Manrope] font-[400] lg:text-[18px] text-[12px] px-4 md:px-0 text-center w-[100%] lg:w-[25rem] ">Browse verified listings, connect with trusted agents, and move in with confidence.</p>
            <div className="bg-[#1A3C34] flex justify-center items-center  max-[321px]:py-[8px]  max-[321px]:px-[18px] py-[12px] px-[24px] rounded-[10px] lg:w-[461px] w-[90%] hover:bg-[#264d43] transition-all transform hover:scale-105 ">
                <button onClick={()=>isLoggedIn ? navigate('/property') : setShowModal(true)}  className="font-[Manrope] font-400 md:text-[18px] max-[321px]:text-[12px]  text-[14px] text-[#FFFFFF] " type="submit">Explore All Properties</button>
            </div>
      
        </div>
        
        </div>
     </div>
    </div>
  )
}

export default Display