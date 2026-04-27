import { useState, type FC } from 'react';
// Added useLocation to track which page is currently active
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from "/src/assets/logo.png";
import logoo from "/src/assets/foot.png";
import hamburger from "/src/assets/hamburger.png";
import { useAuth } from '../../context/AuthContext';

// ---- BACKEND ADDED: imported removeToken to clear JWT on logout ----
import { removeToken } from '../../services/api';

const HeaderNavBar: FC = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser, setShowModal, isAdmin, setIsAdmin } = useAuth();
  const [isMenu, setIsMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current path


  const isActive = (path: string) => location.pathname === path;

  
  const navLinkClass = (path: string) => 
    `transition-colors duration-300 hover:text-[#1A3C34] ${
      isActive(path) ? "text-[#1A3C34]" : "text-[#838585]"
    }`;

  const handleNameClick = () => {
    if (isAdmin) navigate('/adminPage');
  };

  const handleLoggedIn = () => {
    navigate('/login');
    setIsMenu(false);
  };

  const handleLoggedOut = () => {
    removeToken();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser({ name: "", email: "" });
    navigate('/login');
    setIsMenu(false);
  };

  const handlePropertyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    isLoggedIn ? navigate('/property') : setShowModal(true);
    setIsMenu(false);
  };

   const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/about') 
    setIsMenu(false);
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
    setIsMenu(false);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
    const footer = document.getElementById("footer-section");
  if (footer) {
    footer.scrollIntoView({ 
      behavior: "smooth", 
      block: "start" 
    });
    return
  }
    setIsMenu(false);
  };

  const handleSignUpClick = () => {
    navigate('/signup');
    setIsMenu(false);
  };

  return (
    <div className="md:bg-white bg-[#1A3C34] w-full lg:mb-3 relative nav z-30 ">
      <div className="lg:mx-auto lg:container lg:max-w-[1200px] w-full px-6  md:px-3 lg:px-0 flex flex-row justify-between items-center py-[15px] md:py-[10px] navv">

        <div className="flex flex-row items-center gap-[8px]">
          <img className="hidden md:block" src={logo} alt="Logo" />
          <img className="block md:hidden w-[25px]" src={logoo} alt="Logo Mobile" />
          <p className="font-[Manrope] font-[700] text-[18px]  text-[#FFFFFF] md:text-[#1A3C34]">
            NestFinder Pro
          </p>
        </div>

        {/* DESKTOP NAVIGATION with Active States */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2 lg:gap-[32px] font-[Manrope] font-[400] text-[18px]">
          <Link to="/" onClick={handleHomeClick} className={navLinkClass('/')}>
            Home
          </Link>
          <Link to="/about" onClick={handleAboutClick} className={navLinkClass('/about')}>
            About
          </Link>
          <Link to="/contact" onClick={handleContactClick} className={navLinkClass('/contact')}>
            Contact
          </Link>
          <Link to="/property" onClick={handlePropertyClick} className={navLinkClass('/property')}>
            Property
          </Link>
        </nav>

        <div className="hidden md:flex items-center justify-end gap-[12px] md:min-w-[200px] font-[Manrope]">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <p
                onClick={handleNameClick}
                className={`text-[#1A3C34] ${isAdmin ? "cursor-pointer underline font-[700] hover:transition-all hover:transform hover:scale-105 " : ""}`}
              >
                Hi, {user.name}
              </p>
              <button
                onClick={handleLoggedOut}
                className="border-[1px] border-[#1A3C34] rounded-[10px] py-[10px] px-[20px] text-[#1A3C34] hover:bg-[#1A3C34] hover:text-white transition-all font-[400]"
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button onClick={handleLoggedIn} className="border rounded-[10px] py-[10px] px-[24px] text-[#1A3C34] font-[400] hover:scale-105 hover:transition-all hover:transform">Login</button>
              <button
                className="bg-[#1A3C34] rounded-[10px] py-[10px] px-[24px] text-white hover:bg-[#264d43] hover:scale-105 hover:transition-all hover:transform"
                onClick={handleSignUpClick}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <div className="block md:hidden cursor-pointer" onClick={() => setIsMenu(!isMenu)}>
          <img src={hamburger} alt="Menu" className="w-[30px] h-[30px] brightness-0 invert" />
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenu && (
        <div className="absolute top-full right-0 w-full bg-[#1A3C34] text-white flex flex-col items-center gap-6 py-8 md:hidden shadow-xl border-t border-[#2a554a] font[Manrope]">
          
          {isLoggedIn && isAdmin && (
             <button 
                onClick={() => { navigate('/adminPage'); setIsMenu(false); }}
                className="bg-[#F4A261] text-[#1A3C34] font-bold py-2 px-10 rounded-md mb-2 shadow-lg"
             >
                Admin Dashboard
             </button>
          )}

          <nav className="flex flex-col items-center gap-6 font-Manrope text-[18px]">
            <Link to="/" onClick={handleHomeClick} className={isActive('/') ? "text-[#F4A261] font-bold" : ""}>Home</Link>
            <Link to="/about" className={isActive('/about') ? "text-[#F4A261] font-bold" : ""}>About</Link>
            <Link to="/contact" onClick={handleContactClick} className={isActive('/contact') ? "text-[#F4A261] font-bold" : ""}>Contact</Link>
            <Link to="/property" onClick={handlePropertyClick} className={isActive('/property') ? "text-[#F4A261] font-bold" : ""}>Property</Link>
          </nav>

          <div className="flex flex-col gap-4 w-full px-10">
            {isLoggedIn ? (
              <>
                <p className="text-center text-[16px] font-medium opacity-90">
                  Hi, {user.name} {isAdmin && <span className="text-[12px] bg-[#F4A261] px-2 py-0.5 rounded text-[#1A3C34] ml-2 " >Admin</span>}
                </p>
                <button onClick={handleLoggedOut} className="border border-white py-2 rounded-md hover:bg-white hover:text-[#1A3C34] transition-all">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button onClick={handleLoggedIn} className="border border-white py-2 rounded-md">Login</button>
                <button onClick={handleSignUpClick} className="bg-white py-2 rounded-md text-[#1A3C34] font-bold">Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderNavBar;