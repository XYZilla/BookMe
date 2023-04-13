import { useState, useEffect } from 'react';
import { styledComponent } from '../../styledComponents';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const HomeScreen = ({ navigation }) => {
	const [userName, setUserName] = useState('');

	const currentTime = new Date();
	const currentHour = currentTime.getHours();

	const getGreeting = () => {
		if (currentHour >= 6 && currentHour < 12) {
			return 'Доброе утро';
		} else if (currentHour >= 12 && currentHour < 18) {
			return 'Добрый день';
		} else if (currentHour >= 18 && currentHour < 24) {
			return 'Добрый вечер';
		} else {
			return 'Доброй ночи';
		}
	};

	const greeting = `${getGreeting()}, ${userName}!`;

	useEffect(() => {
		const loadUserName = async () => {
			const name = await AsyncStorage.getItem('userName');
			if (name) {
				setUserName(name);
			}
		};
		loadUserName();
	}, []);

	const removeUserData = async () => {
		try {
			await AsyncStorage.removeItem('userName');
		} catch (e) {
			console.log('Error removing user data from AsyncStorage:', e);
		}
	};

	const backHandle = () => {
		removeUserData();
		navigation.navigate('SignIn');
	};

	return (
		<View className='mx-5 mt-16 flex-1'>
			<View className='flex-row justify-between'>
				<View className='w-9/12'>
					<Text className='font-normal text-3xl mb-1'>{greeting}</Text>
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
