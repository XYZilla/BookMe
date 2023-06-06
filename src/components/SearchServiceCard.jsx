import { Image, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { styledComponent } from '../../styledComponents';

const Text = styledComponent.StyledText;

const SearchServiceCard = ({ title, onPress, image }) => {
	return (
		<View className='mt-1 mb-5'>
			<TouchableOpacity onPress={onPress}>
				<Image
					source={{
						uri: image,
					}}
					className='h-52 w-96 rounded-xl'
				/>

				<Text className='text-text_dark text-xl mx-3 mt-1'>{title}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default SearchServiceCard;
