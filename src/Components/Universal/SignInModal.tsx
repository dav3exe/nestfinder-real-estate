import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';



const SignInModal: FC = () => {
    const { setShowModal } = useAuth()
    const navigate = useNavigate()
    const handleLogIn = () => {
        setShowModal(false); 
         navigate('/login')     
    }
    const handleSignUp = () => {
        setShowModal(false); 
         navigate('/signup')     
    }

    return (
        <div className='fixed top-0 left-0 w-screen h-screen backdrop-blur-md bg-black/40 flex items-center justify-center z-[9999] p-4 font-[Manrope]'>
            
            <div className='relative w-full max-w-md bg-white p-8 md:p-12 flex flex-col items-center justify-center rounded-2xl shadow-2xl'>
                
                <button
                    className='absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors'
                    onClick={() => setShowModal(false)}>
                    <span className="text-2xl font-light">✕</span>
                </button>

                <div className='w-full text-center space-y-6'>
                    <div className="space-y-3">
                        <h1 className='text-2xl md:text-3xl font-bold text-[#1A3C34] leading-tight'>
                            Ready to find your <br/> dream home?
                        </h1>
                        <p className='text-gray-500 text-[14px] md:text-[15px] leading-relaxed px-4'>
                            Join our community to explore exclusive property listings, save your favorites, and connect with top agents.
                        </p>
                    </div>

                    
                    <div className="flex flex-col gap-3 pt-4">
                        <button 
                            className="w-full bg-[#1A3C34] hover:bg-[#264d43]  rounded-lg py-3.5 text-white font-semibold text-[15px] shadow-sm" 
                            onClick={handleSignUp}
                        >
                            Create an Account
                        </button>
                        
                        <div className="flex items-center gap-2 py-1">
                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                            <span className="text-gray-400 text-xs uppercase tracking-widest">or</span>
                            <div className="h-[1px] bg-gray-200 flex-1"></div>
                        </div>

                        <button
                            className="w-full border-2 border-gray-200 text-gray-700 hover:border-[#1A3C34] hover:text-[#1A3C34] rounded-lg py-3 font-medium text-[15px]"
                            onClick={handleLogIn}
                        >
                            Log in to your account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInModal;