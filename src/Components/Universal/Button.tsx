import { type FC } from 'react';

interface ButtonProps {
    onClick?: () => void;
}

const Button: FC<ButtonProps> = ({ onClick }) => {
    return (
        <div className="w-full max-w-[163px] "> 
            <button
                onClick={onClick}
                className="font-[Manrope] font-400 w-full h-[49px] lg:w-[163px] max-[376px]:w-[150px] text-[16px] max-[321px]:w-[130px] max-[321px]:h-[40px] max-[320px]:text-[14px] md:max-[768px]:h-[44px] md:w-[150px] rounded-[10px] px-4 py-2 text-white bg-[#1A3C34]  flex items-center justify-center whitespace-nowrap hover:bg-[#264d43] transition-all transform hover:scale-105"
            >
                View Property
            </button>
        </div>
    );
};

export default Button;