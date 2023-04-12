import React from 'react';
import { styledComponent } from '../../styledComponents';
import { TouchableOpacity } from 'react-native-gesture-handler';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const HomeScreen = ({ navigation }) => {
	const backHandle = () => {
		navigation.navigate('SignIn');
	};

	return (
		<View className='mx-5 mt-16 flex-1'>
			<View className='flex-row justify-between'>
				<View className=''>
					<Text className='font-bold text-4xl'>Куда хотите записаться?</Text>
				</View>
				<TouchableOpacity onPress={backHandle}>
					<Text className='font-semibold text-lg'>Выйти</Text>
				</TouchableOpacity>
			</View>
			<View className=''></View>
		</View>
	);
};

export default HomeScreen;
