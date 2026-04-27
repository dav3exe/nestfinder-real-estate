import {  type FC } from 'react';

import RealDataFetching from '../Components/Home/RealDataFetching';
import Display from '../Components/Home/Display';
import Testimonials from '../Components/Home/Testimonials';
import Testimonials2 from '../Components/Home/Testimonials2';
import SignInModal from '../Components/Universal/SignInModal';
import HeaderContentSec from '../Components/Home/HeaderContentSec';
import WhyChooseUs from '../Components/Home/WhyChooseUs';
import { useAuth } from '../context/AuthContext';
import HeaderNavBar from '../Components/Universal/HeaderNavBar';
import Footer from '../Components/Universal/Footer';




const HomePage: FC = () => {
	
	const {showModal} = useAuth()

	return (
		<>
			<div >
				 <HeaderNavBar />
                <HeaderContentSec />
                <Testimonials />
				<RealDataFetching  />
				<WhyChooseUs/>
				<Testimonials2 />
				
				
				<Display  />
				<Footer/>
			</div>
			{showModal && <SignInModal  />}
		</>
	);
};

export default HomePage;
