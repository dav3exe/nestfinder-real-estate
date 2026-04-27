import Vector from "/src/assets/log.png"
import location from "/src/assets/map.png"
import Phone from "/src/assets/call.png"
import message from "/src/assets/info.png"
import { type FC } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const Footer: FC = () => {
    const { isLoggedIn, setShowModal } = useAuth()
    const navigate = useNavigate();
     const handlePropertyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    isLoggedIn ? navigate('/property') : setShowModal(true);
   
  };

   const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    isLoggedIn ? navigate('/about') : setShowModal(true);
   
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Logic for contact (scrolling or navigation)
    isLoggedIn ? navigate('/') : setShowModal(true);
  
  };
    return (
        <footer className="bg-[#0A0A0A] w-full" id="footer-section">
            <div className="max-w-[1200px] mx-auto px-4 py-[40px] md:py-[60px] nav">
                
               
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 xl:gap-[88px]">
                    
                    
                    <div className="flex flex-col gap-8 w-full lg:max-w-[380px] xl:max-w-[450px]">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-[13px] items-center">
                                <img className="w-[20px] h-[20px]" src={Vector} alt="logo" />
                                <h1 className="text-white font-[Manrope] font-[700] text-[23.5px]">NestFinder Pro</h1>
                            </div>
                            <p className="text-white text-[16px] md:text-[18px] font-[400] font-[Manrope] leading-relaxed">
                                Your trusted partner in finding premium properties across Nigeria. We connect buyers, sellers and renters with verified listings
                            </p>
                        </div>

                        <form className="flex flex-col sm:flex-row gap-3 w-full">
                            <input 
                                className="border border-[#696464] rounded-[10px] w-full lg:flex-1 h-[49px] bg-transparent text-white px-[15px] focus:outline-none focus:border-[#1A3C34] font-[Inter] font-400" 
                                type="email" 
                                placeholder="Enter your email address" 
                            />
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    isLoggedIn ? navigate('/') : setShowModal(true)
                                }} 
                                className="bg-[#1A3C34] text-white font-[400] font-[Manrope] rounded-[10px] px-6 h-[49px] whitespace-nowrap transition-colors hover:bg-[#132c26]"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                    
                    <div className="
                        w-full lg:w-auto 
                        
                        flex flex-wrap justify-between
                        md:grid md:grid-cols-3 
                        gap-y-10 
                        lg:flex lg:flex-row lg:gap-8 xl:gap-[80px]
                    ">
                        
                       
                        <div className="flex flex-col gap-6 font-[Inter]">
                            <h5 className="text-[20px] text-white whitespace-nowrap  font-[700]">QUICK LINKS</h5>
                            <nav className="flex flex-col gap-4 uppercase text-white font-[500]">
                              <Link to="/" onClick={handleHomeClick} className="hover:text-[#1A3C34]">
                                    Home
                                </Link>
                                <Link to="/about" onClick={handleAboutClick} className="hover:text-[#1A3C34]">
                                    About
                                </Link>
                                <Link to="/contact" onClick={handleContactClick} className="hover:text-[#1A3C34]">
                                    Contact
                                </Link>
                                <Link to="/property" onClick={handlePropertyClick} className="hover:text-[#1A3C34]">
                                    Properties
                                </Link>
                            </nav>
                        </div>

                       
                        <div className="flex flex-col gap-6 md:items-start text-left font-[Inter] ">
                            <h5 className="font-[700] text-[20px] text-white whitespace-nowrap">PROPERTY</h5>
                            <nav className="flex flex-col gap-4 font-[500]">
                                <a className="text-[16px] text-white hover:text-[#1A3C34] transition-colors" href="#">HOUSES</a>
                                <a className="text-[16px] text-white hover:text-[#1A3C34] transition-colors" href="#">APARTMENT</a>
                                <a className="text-[16px] text-white hover:text-[#1A3C34] transition-colors" href="#">VILLAS</a>
                                <a className="text-[16px] text-white hover:text-[#1A3C34] transition-colors" href="#">DUPLEX</a>
                            </nav>
                        </div>

                        
                        <div className="flex flex-col gap-6 min-w-[200px] w-full md:w-auto mt-4 md:mt-0 ]">
                            <h5 className="text-[20px] text-white font-[Inter] font-[700]">CONTACT</h5>
                            <div className="flex flex-col gap-5 font-[500] font-[Poppins]">
                                <div className="flex gap-3 items-start">
                                    <img className="w-5 h-5 mt-1" src={location} alt="map" />
                                    <p className="text-[16px] text-white leading-snug">123 Prestige Drive, Lagos</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <img className="w-5 h-5" src={Phone} alt="call" />
                                    <p className="text-[16px] text-white">+234 800 000 0000</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <img className="w-5 h-5" src={message} alt="info" />
                                    <p className="text-[16px] text-white">info@realauto.com</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;