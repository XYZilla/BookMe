import { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';

const LottieIcon = ({ source, onAnimationFinish }) => {
	const animationRef = useRef(null);

	useEffect(() => {
		const timeout = setTimeout(() => {
			animationRef.current.play();
		}, 100);

		return () => clearTimeout(timeout);
	}, []);

	const handleAnimationFinish = () => {
		onAnimationFinish();
	};

	return (
		<LottieView
			ref={animationRef}
			source={source}
			autoPlay={false}
			loop={false}
			onAnimationFinish={handleAnimationFinish}
			className='h-52'
		/>
	);
};

export default LottieIcon;
