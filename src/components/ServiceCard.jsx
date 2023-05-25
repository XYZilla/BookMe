import { Dimensions, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { styledComponent } from '../../styledComponents';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 1.4;
const cardHeight = screenWidth / 1.4;

const ServiceCard = ({ title, onPress, image }) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<Image
				source={{
					uri: image,
				}}
				style={{
					width: cardWidth,
					height: cardHeight,
					borderRadius: 10,
				}}
			/>

			<Text className='text-text_dark text-xl mx-3 mt-1'>{title}</Text>
		</TouchableOpacity>
	);
};

export default ServiceCard;
