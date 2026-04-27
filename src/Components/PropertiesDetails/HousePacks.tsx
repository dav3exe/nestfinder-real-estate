import type { FC } from "react";
import locationn from "/src/assets/location.png"
interface HousePacksProps{
  name: string, 
  location: {fullAddress:string}
  price:number
  details:{size: number}
}


const HousePacks:FC<HousePacksProps> = ({ name, location, price,details} )=> {
  return (
    <div className="font-Manrope  w-full flex pb-10 pt-10 justify-between items-center  md:p-0">
      <div className="text-[#000000] text-start">
        <h2 className="text-[18px] md:text-[41px] font-bold font-[Manrope] ">{name}</h2>
        <p className="text-gray-500 text-[14px] md:text-[20px] flex gap-1 items-center font-[Inter]"><img src={locationn} alt="" />{location.fullAddress}</p>
      </div>
      <div className="text-right text-[#000000] font-[Gentium_Plus]">
        <h2 className="md:text-[40px] font-bold text-[21px]"><span>₦</span>{price.toLocaleString()}</h2>
        <p className="text-gray-400 text-[14px]">{details.size}/sqft</p>
      </div>
    </div>
  );
};
export default HousePacks;