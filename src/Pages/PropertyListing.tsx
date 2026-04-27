import { useMemo, useState, useEffect, type FC } from "react";
import { CircleLoader } from "react-spinners";
import Button from "../Components/Universal/Button";
import Pagination from "../Components/Universal/Pagination";
import PropertyHeader from "../Components/PropertyListing/PropertyHeader";
import Sort from "../Components/PropertyListing/Sort";
import { useNavigate } from "react-router-dom";
import size from "/src/assets/sqaure.png";
import location from "/src/assets/location.png";
import bed from "/src/assets/bed.png";
import bath from "/src/assets/bath.png";
import home from "/src/assets/houseline.png";
import listing from "/src/assets/listing.png";
import price from "/src/assets/price.png";
import clear from "/src/assets/clear.png";
import { useAuth } from '../context/AuthContext';
import HeaderNavBar from '../Components/Universal/HeaderNavBar';
import Footer from '../Components/Universal/Footer';
import error from "/src/assets/error.png"
// ---- BACKEND: imported getProperties from api service ----
import { getProperties } from "../services/api";

// ---- BACKEND REMOVED: useFetch hook no longer needed for properties ----
// import { useFetch } from '../Hooks/useFetch';

// ---- BACKEND ADDED: imported all 36 Nigeria states ----
import { allStates } from "../data/nigeriaStates";

// ---- BACKEND UPDATED: Property type now matches backend model ----
// ---- BACKEND REMOVED: old Property type with id, image, details fields ----
interface Property {
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
  sale: string;
  propertyType: string;
}

interface Filter {
  location: { fullAddress: string };
  propertyType: string;
  details: { bedrooms: string };
  listing: string;
  minPrice: string;
  maxPrice: string;
}

const PropertyPage: FC = () => {
  const { setShowModal, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // ---- BACKEND UPDATED: replaced useFetch with useEffect + getProperties ----
  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [applyFilter, setApplyFilter] = useState<Filter | null>();
  const [filter, setFilter] = useState<Filter>({
    location: { fullAddress: "" },
    propertyType: "",
    details: { bedrooms: "" },
    listing: "",
    minPrice: "",
    maxPrice: "",
  });
  const [sortBy, setSortBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, _setPostPerPage] = useState(12);

  // ---- BACKEND ADDED: fetch properties from real backend ----
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        // ---- BACKEND CALL: fetch all published properties ----
        const data = await getProperties();
        if (data.success) {
          setResults(data.properties);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredResults = useMemo(() => {
    if (!results) return [];
    if (!applyFilter) return results;

    return results
      .filter((filtered) => {
        const locationMatch = applyFilter.location.fullAddress
          ? filtered.location.fullAddress
              .toLowerCase()
              .includes(applyFilter.location.fullAddress.toLowerCase())
          : true;

        // ---- BACKEND UPDATED: propertyType instead of PropertyType ----
        const property = applyFilter.propertyType
          ? filtered.propertyType === applyFilter.propertyType
          : true;

        // ---- BACKEND UPDATED: propertyDetails.bedrooms instead of details.bedrooms ----
        const bedrooms = applyFilter.details.bedrooms
          ? filtered.propertyDetails.bedrooms === Number(applyFilter.details.bedrooms)
          : true;

        const sale = applyFilter.listing
          ? filtered.sale === applyFilter.listing
          : true;

        const priceNum = Number(filtered.price);
        const minPrice = applyFilter.minPrice
          ? priceNum >= Number(applyFilter.minPrice)
          : true;
        const maxPrice = applyFilter.maxPrice
          ? priceNum <= Number(applyFilter.maxPrice)
          : true;

        return locationMatch && property && bedrooms && sale && minPrice && maxPrice;
      })
      .sort((a, b) => {
        if (sortBy === "lowToHigh") return Number(a.price) - Number(b.price);
        if (sortBy === "highToLow") return Number(b.price) - Number(a.price);
        if (sortBy === "Discounted") {
          // ---- BACKEND UPDATED: discount is a string like "10%" ----
          return (
            Number(b.discount.replace(/[^0-9]/g, "")) -
            Number(a.discount.replace(/[^0-9]/g, ""))
          );
        }
        return 0;
      });
  }, [results, applyFilter, sortBy]);

  if (isLoading) {
    return (
      <div className="flex justify-center font-bold h-screen items-center">
        <CircleLoader size={40} color={"green"} />
      </div>
    );
  }

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentProperty = filteredResults?.slice(firstPostIndex, lastPostIndex);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "location") {
      setFilter({ ...filter, location: { fullAddress: value } });
    } else if (name === "bedrooms") {
      setFilter({ ...filter, details: { ...filter.details, bedrooms: value } });
    } else {
      const inputFieldName = name as keyof Filter;
      setFilter({ ...filter, [inputFieldName]: value });
    }
  };

  const handleClear = () => {
    const emptyFilter = {
      location: { fullAddress: "" },
      propertyType: "",
      details: { bedrooms: "" },
      listing: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilter(emptyFilter);
    setApplyFilter(emptyFilter);
    setSortBy("");
    setCurrentPage(1);
  };

  return (
    <div>
     
        <HeaderNavBar />
      
      
      <div className="font-Manrope z-0">
        <PropertyHeader />
      </div>

      <div className="flex flex-col items-center justify-center md:max-w-[1200px] w-full mx-auto container">
        <div className="flex flex-col relative z-10 items-center justify-center">

          {/* Filter Bar */}
          <div className='flex flex-col lg:flex-row shadow-xl bg-white max-[321px]:w-[310px] lg:h-[123px] lg:max-w-[1200px] lg:py-[27px] lg:px-[30px] lg:justify-between lg:w-full mb-9 mt-9 items-center lg:items-end rounded-[10px] h-auto py-[12px] md:px-[8px] gap-[21px] lg:gap-4 text-[#656565] selectdiv mx-4 lg:mx-0 max-w-[398px] text-[13px] md:text-[16px] font-[Manrope]'>

            <div className='w-full max-[321px]:w-[310px] lg:w-[180px] xl:w-[220px] h-[69px] select px-3 lg:px-0'>
              <label htmlFor='location' className='flex items-center gap-1 mb-1'>
                <img src={location} alt='' />
                Location
              </label>
              {/* ---- BACKEND UPDATED: now shows all 36 Nigeria states ---- */}
              <select
                name='location'
                id='location'
                value={filter.location.fullAddress}
                onChange={handleChange}
                className='w-full h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px] select'>
                <option value=''>All States</option>
                {allStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className='flex gap-[13px] max-[321px]:w-[310px] w-full items-center lg:max-w-[366px] px-3 lg:px-0 justify-center lg:contents selectdiv'>
              <div className='w-full lg:w-[180px] xl:w-[210px] h-[69px] select'>
                <label htmlFor='propertyType' className='flex items-center gap-1 mb-1'>
                  <img src={home} alt='' />
                  Property Type
                </label>
                <select
                  name='propertyType'
                  value={filter.propertyType}
                  onChange={handleChange}
                  id='propertyType'
                  className='w-full h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px] select'>
                  <option value=''>Property type</option>
                  <option value='House'>House</option>
                  <option value='Villa'>Villa</option>
                  <option value='Duplex'>Duplex</option>
                  <option value='Residential'>Residential</option>
                  <option value='Apartment'>Apartment</option>
                </select>
              </div>
              <div className='w-full lg:w-[170px] xl:w-[200px] h-[69px] select'>
                <label htmlFor='bedrooms' className='flex items-center gap-1 mb-1'>
                  <img src={bed} alt='' />
                  No of Bedrooms
                </label>
                {/* ---- BACKEND UPDATED: now shows 1-50 bedroom options ---- */}
                <select
                  name='bedrooms'
                  value={filter.details.bedrooms}
                  onChange={handleChange}
                  className='w-full h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px] select'>
                  <option value=''>Bedrooms</option>
                  {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={String(num)}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className='w-full max-[321px]:w-[310px] lg:w-[180px] xl:w-[220px] h-[69px] select px-3 lg:px-0'>
              <label htmlFor='listing' className='flex items-center gap-1 mb-1'>
                <img src={listing} alt='' />
                Status list
              </label>
              <select
                name='listing'
                onChange={handleChange}
                value={filter.listing}
                className='w-full h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px] select'>
                <option value=''>Status</option>
                <option value='For Rent'>For Rent</option>
                <option value='For Sale'>For Sale</option>
              </select>
            </div>

            <div className='max-w-[366px] max-[321px]:w-[310px] lg:w-[190px] xl:w-[230px] h-[69px] px-3 lg:px-0 items-center'>
              <label htmlFor='price' className='flex items-center gap-1 mb-1'>
                <img src={price} alt='' />
                Price
              </label>
              <div className='flex gap-[6px]'>
                <input
                  type='number'
                  placeholder='min'
                  min={0}
                  step={1000000}
                  className='w-full lg:w-[96px] h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px] min-w-0'
                  name='minPrice'
                  onChange={handleChange}
                  value={filter.minPrice}
                />
                <input
                  type='number'
                  placeholder='max'
                  className='w-full lg:w-[96px] h-[39px] border-[1px] p-[10px] rounded-[10px] text-[14px] min-w-0'
                  name='maxPrice'
                  min={0}
                  step={1000000}
                  onChange={handleChange}
                  value={filter.maxPrice}
                />
              </div>
            </div>

            <button
              onClick={() => { setApplyFilter(filter); setCurrentPage(1); }}
              className='w-full max-[321px]:w-[290px] max-[376px]:w-[320px] max-w-[350px] lg:max-w-[100px] xl:w-[120px] h-[39px] bg-[#1A3C34] rounded-[10px] text-white font-semibold px-3 lg:px-0 hover:bg-[#264d43] transition-all transform hover:scale-105'>
              Apply
            </button>
          </div>

          {filteredResults.length > 0 && (
            <div className="w-full ">
              <Sort
                allPosts={results?.length}
                filteredPosts={filteredResults?.length}
                setSortBy={setSortBy}
                sortBy={sortBy}
                setApplyFilter={setApplyFilter}
                filter={filter}
              />
            </div>
          )}

          {filteredResults.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[30px] md:gap-y-[47px] lg:gap-y-[55px] gap-x-[20px] w-full justify-items-center inbetween px-6'>
              {currentProperty.map((result) => (
                <div
                  key={result._id}
                  className="w-full max-w-[387px] shadow-2xl text-start flex flex-col rounded-[20px] relative bg-white transition-transform hover:scale-[1.02] duration-300 okay">

                  <div className="h-[280px] md:h-[322px] w-full overflow-hidden rounded-tl-[10px] rounded-tr-[10px]">
                    {/* ---- BACKEND UPDATED: images array, use images[0] ---- */}
                    <img
                      className="h-full w-full object-cover"
                      src={result.images[0] || "https://placehold.co/387x322?text=No+Image"}
                      alt={result.propertyName}
                    />
                  </div>

                  <div className="p-5 flex flex-col gap-[15px] md:gap-[19px] bg-[#FFFFFF] rounded-bl-[20px] rounded-br-[20px]">
                    <h3 className="text-[#0A1916] font-bold md:text-[20px] text-[17px] truncate uppercase font-[Manrope]">
                      {result.propertyName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <img className="h-4 w-3 shrink-0" src={location} alt="" />
                      <p className="md:text-[16px] text-[14px] text-gray-600 truncate font-[Inter]">{result.location.fullAddress}</p>
                    </div>
                    <div className="flex items-start gap-[10px] md:text-[15px] text-[14px] text-gray-700 font-[Inter]">
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
                      <Button
                        onClick={() => isLoggedIn ? navigate(`/property/${result._id}`) : setShowModal(true)}
                      />
                     <p className="md:text-[26px] lg:text-[30px] max-[321px]:text-[21px] max-[426px]:text-[25px] max-[768px]:text-[29px] font-bold text-[#1A3C34] font-[Gentium_Plus] ">
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
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 h-[803.69px] mb-12 ">
              <div className="flex flex-col items-center justify-center gap-[82px]">
                <img className="w-[714px] h-[578.69px]" src={clear} alt="" />
                <div className="flex items-center flex-col">
                 <div className='flex flex-col md:flex-row items-center md:gap-2 gap-1 justify-center w-full max-w-4xl'>
        {/* Added max-w-4xl to keep the layout tight on huge screens */}
        <img src={error} alt='' className='w-5 h-5 flex-shrink-0 justify-self-center ' /> 
        {/* Added flex-shrink-0 so the icon doesn't squash when text gets long */}
        <p className='text-[#FF0000] font-medium text-center text-[16px] lg:text-[20px] leading-tight'>
            We couldn't find any properties matching your search criteria
        </p>
    </div>
                  <p>Try other filters</p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="w-[146px] h-[49px] rounded-[10px] py-[12px] px-[24px] bg-[#1A3C34] text-white hover:bg-[#264d43] transition-all transform hover:scale-105 my-12 ">
                Clear Filters
              </button>
            </div>
          )}
{filteredResults.length > 0 &&
          <div className="w-full px-6 my-8">
            <Pagination
              totalPosts={filteredResults.length}
              postPerPage={postPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyPage;