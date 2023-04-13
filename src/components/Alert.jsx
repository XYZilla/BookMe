import { useEffect, useState } from 'react';
import { styledComponent } from '../../styledComponents';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated, TouchableOpacity } from 'react-native';

const Text = styledComponent.StyledText;

const Alert = ({ message, status, onClose }) => {
	const [offset] = useState(new Animated.Value(-200));

	useEffect(() => {
		Animated.timing(offset, {
			toValue: 0,
			duration: 500,
			useNativeDriver: true,
		}).start();
	}, [offset]);

	const closeAlert = () => {
		Animated.timing(offset, {
			toValue: -200,
			duration: 500,
			useNativeDriver: true,
		}).start(onClose);
	};

	let color = '';
	switch (status) {
		case 'success':
			color = 'bg-green-200';
			break;
		case 'warning':
			color = 'bg-orange-200';
			break;
		case 'error':
			color = 'bg-red-400';
			break;

		default:
			break;
	}

	return (
		<Animated.View
			className={`${color} w-full h-32 justify-center pt-20 flex-row`}
			style={{
				transform: [
					{
						translateY: offset,
					},
				],
			}}
		>
			<MaterialIcons
				name='error-outline'
				size={24}
				color='white'
			/>
			<Text className='ml-2 text-lg mt-[-2px] text-text_light font-semibold'>
				{message}
			</Text>
			<TouchableOpacity
				onPress={closeAlert}
				className='ml-10'
			>
				<MaterialIcons
					name='close'
					size={24}
					color='white'
				/>
			</TouchableOpacity>
		</Animated.View>
	);
};

export default Alert;
