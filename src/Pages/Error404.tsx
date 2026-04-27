import { Link } from "react-router-dom";


const Error404 = () => {
  return (
    <div 
      className="h-screen w-full flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-white relative px-4"
    >
      
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-7xl md:text-9xl font-bold mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Oops! Page not found
        </h2>
        <p className="text-[14px] md:text-[16px] text-gray-200 mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link to="/">
          <button className="px-8 py-3 bg-[#1A3C34] hover:bg-[#264d43] text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Error404;