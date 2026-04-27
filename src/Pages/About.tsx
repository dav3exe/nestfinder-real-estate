import  { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavBar from '../Components/Universal/HeaderNavBar';
import Footer from '../Components/Universal/Footer';
import about from "/src/assets/properties/sunset.png"
import house from "/src/assets/houseee.png"
import { useAuth } from '../context/AuthContext';
import SignInModal from '../Components/Universal/SignInModal';
const AboutPage: FC = () => {
  const navigate = useNavigate();
   const {isLoggedIn, setShowModal,showModal} = useAuth()
   const handlePropertyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    isLoggedIn ? navigate('/property') : setShowModal(true);
    
  };
  return (
    <div className="bg-white min-h-screen font-Manrope">
        <HeaderNavBar/>
      
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#1A3C34]/80 z-10" />
        <img 
          src={house}
          alt="Modern Architecture" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-6">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
            Redefining Real Estate <br/> in Nigeria
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
            At NestFinder Pro, we don't just find houses; we discover the place where your stories begin.
          </p>
        </div>
      </section>

     
      <section className="py-16 md:py-24 px-6 lg:px-0">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-[#1A3C34] text-3xl md:text-4xl font-bold mb-6">Our Journey</h2>
            <p className="text-[#535353] leading-relaxed mb-6 text-lg">
              Founded in Lagos, NestFinder Pro emerged from a simple observation: the search for a perfect home should be as joyful as living in one. We realized that the Nigerian real estate market needed a bridge built on transparency, technology, and trust.
            </p>
            <p className="text-[#535353] leading-relaxed text-lg">
              Today, we serve thousands of clients across the country, leveraging cutting-edge tools to connect property seekers with verified, high-quality listings.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-3xl font-bold text-[#F4A261]">500+</p>
                <p className="text-sm text-[#75928B]">Properties Verified</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#F4A261]">1.2k</p>
                <p className="text-sm text-[#75928B]">Happy Families</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={about}
              alt="Luxury Apartment" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values / Why Choose Us */}
      <section className="bg-[#E4F0ED] py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-0 text-center">
          <h2 className="text-[#1A3C34] text-3xl md:text-4xl font-bold mb-16">Why NestFinder Pro?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#1A3C34] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A3C34] mb-4">Verified Listings</h3>
              <p className="text-[#535353]">Every property on our platform undergoes a rigorous verification process to ensure your safety.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border-t-4 border-[#F4A261]">
              <div className="w-14 h-14 bg-[#1A3C34] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A3C34] mb-4">Swift Technology</h3>
              <p className="text-[#535353]">Our smart filters and real-time map integration make finding your next home faster than ever.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#1A3C34] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#1A3C34] mb-4">Expert Support</h3>
              <p className="text-[#535353]">Our dedicated team of real estate experts is available to guide you through legalities and paperwork.</p>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-20 text-center px-6">
        <h2 className="text-[#1A3C34] text-3xl font-bold mb-6">Ready to find your dream nest?</h2>
        <button 
          onClick={handlePropertyClick}
          className="bg-[#1A3C34] text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-[#264d43] transition-all transform hover:scale-105"
        >
          Explore Properties
        </button>
      </section>
      <Footer/>
      {showModal && <SignInModal />}
    </div>
  );
};

export default AboutPage;