import size from "/src/assets/sqaure.png"
import location from "/src/assets/location.png"
import bed from "/src/assets/bed.png"
import bath from "/src/assets/bath.png"
import { useEffect, useState, type FC } from 'react';
import { RingLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

import Button from '../Universal/Button';
import { useAuth } from "../../context/AuthContext";

// ---- BACKEND: imported getProperties from api service ----
import { getProperties } from '../../services/api';

// ---- BACKEND UPDATED: type now matches backend Property model ----
type Property = {
  _id: string;
  propertyName: string;
  images: string[];
  location: { fullAddress: string };
  propertyDetails: {
    size: number;
    bedrooms: number;
    bathroom: number;
  };
  price: number;
  discount: string;
  isFeatured: boolean;
};

const RealDataFetching: FC = () => {
    const {setShowModal, isLoggedIn}=useAuth()
    const navigate = useNavigate();

    const [results, setResults] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setIsLoading(true);
                const data = await getProperties();
                if (data.success) {
                    setResults(data.properties);
                } else {
                    setError("Failed to load properties");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load properties");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, []);

    if (isLoading) {
        return (
            <div className='flex justify-center items-center min-h-[400px]'>
                <RingLoader color='#1A3C34' size={100} />
            </div>
        );
    }

    if (error) {
        return (
          <div className='flex justify-center items-center py-20'>
            <p className='text-red-500 font-bold'>{error}</p>
          </div>
        );
    }

    return (
        <div className="bg-[#E4F0ED] px-4 md:px-8 flex flex-col justify-center items-center overflow-hidden">
            
            <div className="flex flex-col justify-center items-center gap-[18px] py-[40px] md:py-[73px]">
                <h1 className="font-Manrope font-[700] text-[24px] md:text-[42px] text-center text-[#131817] leading-tight">
                    Discover Our Featured Properties
                </h1>
                <p className="font-Inter font-[400] text-[14px] md:text-[18px] leading-[24px] md:leading-[30px] text-center text-[#535353] w-full max-w-[23rem] md:max-w-[40rem]">
                    Dive into our exquisite collection of our featured properties at Nest Finder Pro. Every corner whispers comfort and every detail is crafted with perfection
                </p>
            </div>

            {/* UPDATED GRID LOGIC: 2 columns at lg (1024px) and 3 columns only at xl (1280px) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-y-[30px] md:gap-y-[47px] lg:gap-y-[55px] gap-x-[20px] w-full max-w-[1240px] justify-items-center inbetween">
                {results?.slice(0, 6).map((result) => {
                    return (
                        <div key={result._id} className="w-full max-w-[387px] flex flex-col shadow-2xl text-start rounded-[20px] relative bg-white transition-transform hover:scale-[1.02] duration-300">
                           
                            <div className="h-[280px] md:h-[322px] w-full overflow-hidden rounded-tl-[10px] rounded-tr-[10px]">
                                <img 
                                    className="h-full w-full object-cover" 
                                    src={result.images[0] || "https://placehold.co/387x322?text=No+Image"} 
                                    alt={result.propertyName} 
                                />
                            </div>

                            <div className="p-5 flex flex-col gap-[15px] md:gap-[19px] bg-[#FFFFFF] rounded-bl-[20px] rounded-br-[20px]">
                                <h3 className="text-[#0A1916] font-bold md:text-[20px] text-[17px] truncate hover:whitespace-normal hover:overflow-visible  uppercase font-[Manrope]" >
                                    {result.propertyName}
                                </h3>
                                
                                <div className="flex items-center gap-2">
                                    <img className="h-4 w-3 shrink-0" src={location} alt="" />
                                    <p className="md:text-[16px] text-[14px] text-gray-600 truncate">{result.location.fullAddress}</p>
                                </div>

                                <div className="flex items-start gap-[10px] md:text-[15px] text-[12px] text-gray-700 font-[Inter]">
                                    <div className="flex items-center gap-1">
                                        <img className="h-4 w-4 shrink-0" src={size} alt="" />
                                        <p>{result.propertyDetails.size} sqm</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <img className="h-4 w-4 shrink-0" src={bed} alt="" />
                                        <p>{result.propertyDetails.bedrooms} Beds</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <img className="h-4 w-4 shrink-0" src={bath} alt="" />
                                        <p>{result.propertyDetails.bathroom} Baths</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Button onClick={() => isLoggedIn ? navigate(`/property/${result._id}`) : setShowModal(true)}/>
                                   <p className="md:text-[26px] lg:text-[30px] max-[321px]:text-[22px] max-[426px]:text-[28px] max-[768px]:text-[29px] font-bold text-[#1A3C34] font-[Gentium_Plus] ">
                        <span className="max-[321px]:text-[22px] lg:text-[30px] md:text-[28px] mr-0.5 max-[376px]:text-[28px] ">₦</span>
                        {result.price.toLocaleString()}
                      </p>
                                </div>
                            </div>

                            {result.discount && (
                                 <div className={`absolute px-4 py-2 rounded-[8px] bg-[#F4A261] text-white top-3 right-3 text-[18px] font-400 shadow-md w-[112px] flex items-center justify-center h-[49px] font-[Manrope] max-[321px]:w-[100px]
                      ${Number(result.discount.replace(/[^0-9]/g, "")) >= 40 ? "bg-green-500" :
                        Number(result.discount.replace(/[^0-9]/g, "")) >= 20 ? "bg-[#F4A261]" : "bg-red-500"}`}>
                        {result.discount} Off
                    </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center my-[50px] md:my-[70px]">
                <button 
                    type="button" 
                    onClick={() => isLoggedIn ? navigate("/Property") : setShowModal(true)}
                    className="bg-[#1A3C34] py-[12px] px-[32px] rounded-[10px] font-Manrope font-[500] text-[#FFFFFF] text-[18px] hover:bg-[#264d43]  shadow-lg hover:bg-[#264d43] transition-all transform hover:scale-105"
                >
                    View All Properties
                </button>
            </div>
        </div>
    );
};

export default RealDataFetching;