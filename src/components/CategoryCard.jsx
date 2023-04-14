import { TouchableOpacity } from 'react-native';
import React from 'react';
import { styledComponent } from '../../styledComponents';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const CategoryCard = ({ title, onPress }) => {
	return (
		<View className='flex-1'>
			<TouchableOpacity onPress={onPress}>
				<View className='bg-secondary m-1 h-20 rounded-xl justify-center items-center'>
					<Text>{title}</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default CategoryCard;
