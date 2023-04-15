import { Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { styledComponent } from '../../styledComponents';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 1.4;
const cardHeight = screenWidth / 1.4;

const ServiceCard = ({ title, onPress }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<View
				className='bg-gray-400 rounded-xl justify-center items-center'
				style={{
					width: cardWidth,
					height: cardHeight,
				}}
			>
				<Text className='text-text_light text-xl'>{title}</Text>
			</View>
		</TouchableOpacity>
	);
};

export default ServiceCard;
