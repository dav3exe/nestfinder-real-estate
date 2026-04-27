import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useAdvancedMarkerRef, Pin } from '@vis.gl/react-google-maps';
import locationn from "/src/assets/location.png";


interface MapProps {
  propertyName: string;
  location: {
    fullAddress: string;
    // ---- BACKEND UPDATED: coordinates is optional since not all properties have it ----
   
  };
   coordinates?: { latitude: number, longitude: number }
  image: string;
}

const MapView = ({ location, image, propertyName ,coordinates}: MapProps) => {
  const [open, setOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();


  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
  // ---- BACKEND UPDATED: coordinates is optional, fallback to Lagos coordinates ----
  const position = {
  lat: coordinates?.latitude ?? 6.5244,
  lng: coordinates?.longitude ?? 3.3792
};
  return (
    <div className="mt-10 font-[Manrope]">
      <h5 className="text-[24px] font-bold mb-5 underline">Location</h5>
      
      <div className="h-[444px] w-full rounded-2xl overflow-hidden border">
        <APIProvider apiKey={API_KEY}>
          {/* mapId: "45db0d99611c3461" is a public demo ID for Advanced Markers */}
          <Map
            defaultCenter={position}
            defaultZoom={13}
            mapId={'45db0d99611c3461'} 
            disableDefaultUI={false}
          >
            {/* for the blue pin */}
            <AdvancedMarker
              ref={markerRef}
              position={position}
              onClick={() => setOpen(true)}>
               <Pin background={'#4285F4'} glyphColor={'#000'} borderColor={'#000'} />
            </AdvancedMarker>

            {/* custom Pop-Up */}
            {open && (
              <InfoWindow
                anchor={marker}
                onCloseClick={() => setOpen(false)}
                headerDisabled={true}
              >
                <div className="flex bg-white w-full lg:w-[331px] h-[74px] gap-3 items-center relative p-1">
                  <button onClick={() => setOpen(false)}
                   className="absolute top-1 right-1 text-gray-400 hover:text-black font-bold text-lg leading-none p-1"> &times;</button>
                  <img className="w-[79px] h-full object-cover rounded-[5px]" src={image} alt={propertyName} />
                  <div className="flex flex-col justify-center">
                    <p className="text-[16px] text-gray-800 leading-tight">{propertyName}</p>
                    <p className="font-bold flex gap-2 items-center text-gray-900 mt-1">
                      <img src={locationn} className="w-4 h-4" alt="" />
                      {location.fullAddress}
                    </p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default MapView;