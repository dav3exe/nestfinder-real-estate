import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Images from '../Components/PropertiesDetails/Images';
import HousePacks from '../Components/PropertiesDetails/HousePacks';
import PropertiesDetail from '../Components/PropertiesDetails/PropertiesDetail';
import MapView from '../Components/PropertiesDetails/MapView';
import CardComponent from '../Components/PropertiesDetails/CardComponent';
import AgentForm from '../Components/PropertiesDetails/AgentForm';
import { CircleLoader } from 'react-spinners';
import Button from '../Components/Universal/Button';
import size from "/src/assets/sqaure.png"
import location from "/src/assets/location.png"
import bed from "/src/assets/bed.png"
import bath from "/src/assets/bath.png"
import HeaderNavBar from '../Components/Universal/HeaderNavBar';
import Footer from '../Components/Universal/Footer';

// ---- BACKEND: imported getPropertyById and getProperties from api service ----
import { getPropertyById, getProperties } from '../services/api';

// ---- BACKEND REMOVED: useFetch hook no longer needed ----
// import { useFetch } from '../Hooks/useFetch';

// ---- BACKEND UPDATED: Property interface now matches backend model ----
// ---- BACKEND REMOVED: old Property type with id, image, details fields ----
interface Property {
  _id: string;
  propertyName: string;
  images: string[];
  location: {
    fullAddress: string;
    
  };
  propertyDetails: {
    size: number;
    bedrooms: number;
    bathroom: number;
  };
  coordinates: { 
    latitude: number; 
    longitude: number };

  price: number;
  discount: string;
  agentName: string;
  agentPhone: string;
  amenities: string[];
  propertyDescription: string;
}

const PropertyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // ---- BACKEND CALL: fetch single property by id ----
        // ---- BACKEND REMOVED: useFetch('/data/properties.json') + .find() ----
        const [propertyData, allData] = await Promise.all([
          getPropertyById(id!),
          getProperties(),
        ]);

        if (propertyData.success) {
          setProperty(propertyData.property);
        }

        if (allData.success) {
          setAllProperties(allData.properties);
        }
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className='flex justify-center font-bold h-screen items-center'>
        <CircleLoader size={40} color={'green'} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className='flex justify-center font-bold h-screen items-center text-4xl'>
        Property not found
      </div>
    );
  }

  return (
    <div>
      <div className='md:px-5'>
           <HeaderNavBar />
      </div>
     
      <div className="w-full mx-auto container px-3 md:px-10 space-y-14 mt-8 md:max-w-[1280px]">

        {/* ---- BACKEND UPDATED: pass full images array to Images component ---- */}
        {/* ---- BACKEND REMOVED: mainImage single string ---- */}
        <Images images={property.images} />

        <HousePacks
          name={property.propertyName}
          location={property.location}
          price={property.price}
          // ---- BACKEND UPDATED: propertyDetails instead of details ----
          details={property.propertyDetails}
        />

        {/* Desktop Layout */}
        <div className="flex-col lg:flex-row gap-10 hidden md:flex">
          <div className="flex-1">
            <PropertiesDetail property={property} />
            <MapView
            coordinates={property.coordinates}
              location={property.location}
              image={property.images[0] || "/src/assets/housing.jpg"}
              propertyName={property.propertyName}
            />
          </div>
          <div className="flex flex-col gap-5">
            <CardComponent agentPhone={property.agentPhone} agentName={property.agentName} />
            <AgentForm propertyId={property._id} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex-col lg:flex-row gap-10 flex md:hidden">
          <PropertiesDetail property={property} />
          <CardComponent agentPhone={property.agentPhone} agentName={property.agentName} />
          <AgentForm propertyId={property._id} />
          <MapView
            location={property.location}
             coordinates={property.coordinates}
            image={property.images[0] || "/src/assets/housing.jpg"}
            propertyName={property.propertyName}
          />
        </div>

        {/* Explore More Properties Section */}
        <div className='mt-16 mb-30 items-center justify-center'>
          <div className='lg:text-[41px] text-[25px] mb-7 text-center md:text-start'>
            Explore More Properties
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-y-[30px] md:gap-y-[47px] lg:gap-y-[55px] gap-x-[20px] w-full max-w-[1200px] justify-items-center inbetween'>
            {allProperties
              /* ---- BACKEND UPDATED: filter by _id instead of id ---- */
              .filter((prop) => prop._id !== id)
              .slice(0, 3)
              .map((result) => (
                <div key={result._id} className="w-full max-[321px]:w-[290px] max-w-[387px] flex flex-col shadow-2xl text-start rounded-[20px] relative bg-white transition-transform hover:scale-[1.02] duration-300 okay">
                  
                  <div className="h-[280px] md:h-[322px] w-full overflow-hidden rounded-tl-[10px] rounded-tr-[10px]">
                    {/* ---- BACKEND UPDATED: images[0] instead of image ---- */}
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

                    <div className="flex items-start gap-[10px] md:text-[15px] text-[12px] text-gray-700 font-[Inter]">
                      <div className="flex items-center gap-1">
                        <img className="h-4 w-4 shrink-0" src={size} alt="" />
                        {/* ---- BACKEND UPDATED: propertyDetails.size ---- */}
                        <p>{result.propertyDetails.size} sqm</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <img className="h-4 w-4 shrink-0" src={bed} alt="" />
                        {/* ---- BACKEND UPDATED: propertyDetails.bedrooms ---- */}
                        <p>{result.propertyDetails.bedrooms} Beds</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <img className="h-4 w-4 shrink-0" src={bath} alt="" />
                        {/* ---- BACKEND UPDATED: propertyDetails.bathroom ---- */}
                        <p>{result.propertyDetails.bathroom} Baths</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* ---- BACKEND UPDATED: _id instead of id ---- */}
                      <Button onClick={() => navigate(`/property/${result._id}`)} />
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
              ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PropertyDetails;