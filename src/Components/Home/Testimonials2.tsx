import michael from "/src/assets/micheal.png"
import sophie from "/src/assets/sophie.png"
import carey from "/src/assets/carey.png"
import micah from "/src/assets/micah.png"
import emmanuel from "/src/assets/emma.png"

const Testimonials2 = () => {
  return (
    <div>
        <div className="flex flex-col justify-center items-center gap-[47px] pb-22 max-w-[1200px] w-full px-4 mx-auto container">
            
            {/* Header Section */}
            <div className="flex flex-col justify-center items-center gap-[12px]">
                <p className="font-[Manrope] font-[700] text-[#131817] text-center text-[16px] uppercase tracking-wider">testimonials</p>
                <h1 className="font-[Manrope] font-[700] text-[#131817] text-center md:text-[42px] text-[30px] leading-tight px-4">What Our Satisfied Clients Say</h1>
            </div>

            {/* Grid Logic: 1 column mobile, 6 columns for tablet/desktop to handle your col-spans */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-[30px] w-full">
                
                {/* Michael Carter - col-span-2 */}
                <div className="bg-[#EEEEEE] flex flex-col justify-between items-start md:h-[185px] min-h-[185px] py-[20px] px-[20px] shadow-sm rounded-[10px] md:col-span-3 lg:col-span-2">
                    <p className="font-[Inter] font-[500] text-start text-[13.5px] leading-[26px] w-full">
                        Finding my dream Apartment was so easy with Nest Finder Pro. The Listings were accurate, the agents were responsive and i was happy to move in
                    </p>
                    <div className="flex flex-row justify-center items-center gap-[13px] mt-4 md:mt-0">
                        <img className="h-[47px] w-[47px] rounded-full object-cover" src={michael} alt="michael" />
                        <h2 className="font-[Raleway] font-[500] text-[18px] text-[#1A1212]">Michael Carter</h2>
                    </div>
                </div>

                {/* Sophie Ann - col-span-2 */}
                <div className="bg-[#EEEEEE] flex flex-col justify-between items-start md:h-[185px] min-h-[185px] py-[20px] px-[20px] shadow-sm rounded-[10px] md:col-span-3 lg:col-span-2">
                    <p className="font-[Inter] font-[500] text-start text-[14px] leading-[26px] w-full">
                        NestFinder Pro made the whole property search stress free. Their verified listings gave me confidence that what i saw was what i got
                    </p>
                    <div className="flex flex-row justify-center items-center gap-[13px] mt-4 md:mt-0">
                        <img className="h-[47px] w-[47px] rounded-full object-cover" src={sophie} alt="sophie" />
                        <h2 className="font-Raleway font-[500] text-[18px] text-[#1A1212]">Sophie Ann</h2>
                    </div>
                </div>

                {/* Carey- Yin-un - col-span-2 */}
                <div className="bg-[#EEEEEE] flex flex-col justify-between items-start md:h-[185px] min-h-[185px] py-[20px] px-[20px] shadow-sm rounded-[10px] md:col-span-3 lg:col-span-2">
                    <p className="font-[Inter] font-[500] text-start text-[14px] leading-[26px] w-full">
                        I was skeptical about searching for home online but NestFinder Pro changed that. They are professional, and incredible people i can trust
                    </p>
                    <div className="flex flex-row justify-center items-center gap-[13px] mt-4 md:mt-0">
                        <img className="h-[47px] w-[47px] rounded-full object-cover" src={carey} alt="carey" />
                        <h2 className="font-[Raleway] font-[500] text-[18px] text-[#1A1212]">Carey- Yin-un</h2>
                    </div>
                </div>

                {/* Micah Richards - col-span-3 */}
                <div className="bg-[#EEEEEE] flex flex-col justify-between items-start md:h-[185px] min-h-[185px] py-[20px] px-[20px] rounded-[10px] shadow-sm md:col-span-3">
                    <p className="font-[Inter] font-[500] text-start text-[14px] leading-[26px] w-full">
                        NestFinder Pro made the whole property search stress free. Their verified listings gave me confidence that what i saw was what i got
                    </p>
                    <div className="flex flex-row justify-center items-center gap-[13px] mt-4 md:mt-0">
                        <img className="h-[47px] w-[47px] rounded-full object-cover" src={micah} alt="micah" />
                        <h2 className="font-[Raleway] font-[500] text-[18px] text-[#1A1212]">Micah Richards</h2>
                    </div>
                </div>

                {/* Emmanuel Bait - col-span-3 */}
                <div className="bg-[#EEEEEE] flex flex-col justify-between items-start md:h-[185px] min-h-[185px] py-[20px] px-[20px] rounded-[10px] shadow-sm md:col-span-3">
                    <p className="font-[Inter] font-[500] text-start text-[14px] leading-[26px] w-full">
                        I was skeptical about searching for home online but NestFinder Pro changed that. They are professional, and incredible people i can trust
                    </p>
                    <div className="flex flex-row justify-center items-center gap-[13px] mt-4 md:mt-0">
                        <img className="h-[47px] w-[47px] rounded-full object-cover" src={emmanuel} alt="emmanuel" />
                        <h2 className="font-[Raleway] font-[500] text-[18px] text-[#1A1212]">Emmanuel Bait</h2>
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Testimonials2;