import { TouchableOpacity } from 'react-native';
import React from 'react';
import { styledComponent } from '../../styledComponents';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const ServiceCard = ({ title, onPress }) => {
	return (
		<View className='flex-1 mb-5'>
			<TouchableOpacity onPress={onPress}>
				<View className='bg-slate-300 mr-5 h-60 w-60 rounded-xl justify-center items-center'>
					<Text>{title}</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default ServiceCard;
