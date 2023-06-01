import { TouchableOpacity } from 'react-native';
import React from 'react';
import { styledComponent } from '../../styledComponents';
import { FontAwesome5 } from '@expo/vector-icons';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const BookingCard = ({ title, date, time, onPress }) => {
	return (
		<TouchableOpacity onLongPress={onPress}>
			<View className='bg-white h-20 rounded-2xl mb-5'>
				<View className='flex-row justify-between'>
					<View>
						<View className='justify-start mx-5 mt-2'>
							<Text className='text-lg font-semibold'>Запись в {title}</Text>
						</View>
						<View className='justify-start mx-5 mt-1 flex-row'>
							<Text className='text-lg mr-1'>{date},</Text>
							<Text className='text-lg mr-1'>{time}</Text>
						</View>
					</View>
					<View className='bg-primary rounded-xl w-14 p-2 justify-center items-center absolute right-2 top-[17]'>
						<FontAwesome5
							name='bookmark'
							size={30}
							color='black'
						/>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default BookingCard;
