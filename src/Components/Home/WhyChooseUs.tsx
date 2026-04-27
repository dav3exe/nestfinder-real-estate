// import React from 'react'
import whyUs1 from "/src/assets/smart.jpg"
import whyUs2 from "/src/assets/verified.jpg"
import whyUs3 from "/src/assets/modern.jpg"
import searchLogo from "/src/assets/search.png"
import verifyIcon from "/src/assets/verified.png"
import homeIcon from "/src/assets/modern.png"

const WhyChooseUs = () => {
  return (
    <div className=" items-center justify-center flex flex-col max-w-[1200px] w-full  px-4 mx-auto container  ">
        <div className="flex flex-col justify-center items-center gap-[40px]  pb-30 ">
            <div className="flex flex-col justify-center items-center gap-[9px] py-[20px]">
                <p className="font-[Manrope] font-[700] text-center text-[16px] text-[#353535]">WHY CHOOSE US?</p>
                <h1 className="font-[Manrope] font-[700] text-center md:text-[42px]  md:w-[600px] lg:w-full text-[30px] px-4 text-[#131817]">Find Your Perfect Home With NestFinder Pro</h1>
            </div>
            <div className="grid lg:grid-cols-3 grid-cols-1 flex-wrap justify-center items-center gap-[20px] w-full inbetween">
                <div className="  max-w-[387px] w-full  h-[496px] rounded-[11px] border-[1px] border-[#E6E3E3] rounded-[10px] mx-auto">
                    <img className="rounded-tl-[10px]  max-w-[387px] w-full rounded-tr-[10px] h-[353px]" src={whyUs1} alt="Home" />
                    <div className="max-w-[387px] w-full flex flex-col justify-start items-start gap-[8px]  py-[20px] md:py-[28px] px-[14px]">
                        <span className="flex flex-row justify-center items-center gap-[8px]"><img src={searchLogo} alt="Search" /><h3 className="font-[Manrope] font-[500] lg:text-[18px] text-[15px] text-[#0D1412]">Smart Property search</h3></span>
                        <p className="font-[Inter] font-[400] text-[14px] text-center leading-[25px] text-[#535353] w-full">Easily find your perfect home with NetFinder Pro smart filters, search by price, range and location</p>
                    </div>
                </div>
                <div className="max-w-[387px] w-full h-[496px] rounded-[11px] border-[1px] border-[#E6E3E3] rounded-[10px] mx-auto">
                    <img className="rounded-tl-[10px] max-w-[387px] w-full  rounded-tr-[10px] h-[353px] " src={whyUs2} alt="Home" />
                    <div  className="max-w-[387px] w-full flex flex-col justify-start items-start gap-[8px] py-[20px] md:py-[28px] px-[14px]">
                        <span className="flex flex-row justify-center items-center gap-[8px]"><img src={verifyIcon} alt="Verify" /><h3 className="font-[Manrope] font-[500] lg:text-[18px] text-[15px text-[#0D1412]">Verified Listings & Agents</h3></span>
                        <p className="font-[Inter] font-[400] text-[14px] text-center leading-[25px] text-[#535353] w-full">Easily find your perfect home with NetFinder Pro smart filters, search by price, range and location</p>
                    </div>
                </div>
                <div className="max-w-[387px] w-full h-[496px] rounded-[11px] border-[1px] border-[#E6E3E3] rounded-[10px] mx-auto">
                    <img className="rounded-tl-[10px] max-w-[387px] w-full  rounded-tr-[10px] h-[353px] " src={whyUs3} alt="Home" />
                    <div  className="max-w-[387px] w-full flex flex-col justify-start items-start gap-[8px] py-[20px] md:py-[28px] px-[14px]">
                        <span className="flex flex-row justify-center items-center gap-[8px]"><img src={homeIcon} alt="Verify" /><h3 className="font-[Manrope] font-[500] lg:text-[18px] text-[15px text-[#0D1412]">Modern living & Refined</h3></span>
                        <p className="font-[Inter] font-[400] text-[14px] text-center leading-[25px] text-[#535353] w-full">Easily find your perfect home with NetFinder Pro smart filters, search by price, range and location</p>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default WhyChooseUs