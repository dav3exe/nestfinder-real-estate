import desktop from "/src/assets/housedesktop.png"
import mobile  from "/src/assets/housemobile.png"

const PropertyHeader = () => {
  return (
   
    <main className='bg-[#0A1210] lg:py-15 w-full px-4 h-[250px] lg:h-[369px] relative z-0 overflow-hidden'>
      <div className="flex flex-col md:max-w-[1200px] w-full mx-auto container h-full relative">
        
       
        <div className='w-full max-w-[400px] md:max-w-[700px] pt-10 lg:pt-20 px-[6px] md:px-0'>
          <h1 className='text-white font-[Manrope] text-[32px] lg:text-[72px] font-700 leading-tight tracking-wide'>
            Property Listings
          </h1>
          <p className='text-white font-normal lg:text-[18px] text-[14px] leading-[22px] mt-2'>
            Browse our curated collection of premium properties
          </p>
        </div>

       
        <div className='absolute hidden md:block md:-right-10 lg:right-0 top-53 -translate-y-1/2 lg:w-[607px] md:w-[450px]'>
          <img 
            src={desktop} 
            alt="Property" 
            className="w-full h-auto object-contain"
          />
        </div>

  
        <div className='absolute right-[-20px] bottom-0 md:hidden block w-[200px]'>
          <img 
            src={mobile}
            alt="Property Mobile" 
            className="w-full h-auto object-contain"
          />
        </div>

      </div>
    </main>
  )
}

export default PropertyHeader;