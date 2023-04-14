import { useState, useEffect, useRef } from 'react';
import { styledComponent } from '../../styledComponents';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Field from '../ui/Field';
import Button from '../ui/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet from '../components/BottomSheet';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const HomeScreen = ({ navigation }) => {
	const [userName, setUserName] = useState('');
	const [date, setDate] = useState(new Date());
	const bottomSheetModalRef = useRef(null);
	const [isChangeDate, setIsChangeDate] = useState(false);
	const [isChooseService, setIsChooseService] = useState(false);

	const currentTime = new Date();
	const currentYear = new Date().getFullYear();
	const currentHour = currentTime.getHours();

	const openBottomSheet = () => {
		bottomSheetModalRef.current?.present();
	};

	const closeBottomSheet = () => {
		setIsChangeDate(false);
		setIsChooseService(false);
		bottomSheetModalRef.current?.close();
	};

	const openDatePickerHandler = () => {
		setIsChangeDate(true);
		openBottomSheet();
	};

	const openServiceChooseHandler = () => {
		setIsChooseService(true);
		openBottomSheet();
	};

	const onChangeDate = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setDate(currentDate);
		setTimeout(() => {
			setIsChangeDate(false);
			closeBottomSheet();
		}, 200);
	};

	const formattedDate = date.toLocaleDateString('ru-RU', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	});

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

	const exitHandle = () => {
		removeUserData();
		navigation.navigate('SignIn');
	};

	return (
		<View className=' mt-16 flex-1'>
			<View className='mx-5'>
				<View className='flex-row justify-between'>
					<View className='w-9/12'>
						<Text className='font-normal text-2xl mb-1'>{greeting}</Text>
						<Text className='font-bold text-4xl'>Куда хотите записаться?</Text>
					</View>
					<TouchableOpacity onPress={exitHandle}>
						<Text className='font-semibold text-lg'>Выйти</Text>
					</TouchableOpacity>
				</View>
				<View className='mt-5'>
					<TouchableOpacity
						onPress={!isChangeDate ? openServiceChooseHandler : null}
					>
						<Field
							placeholder='Выберите услугу'
							editable={false}
							icon={
								<MaterialCommunityIcons
									name='widgets-outline'
									size={24}
								/>
							}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={!isChangeDate ? openServiceChooseHandler : null}
					>
						<Field
							value={formattedDate}
							placeholder='Выберите дату'
							editable={false}
							icon={
								<FontAwesome5
									name='calendar-alt'
									size={24}
								/>
							}
						/>
					</TouchableOpacity>

					<View className='mt-4 mb-5'>
						<Button
							title='Найти'
							onPress={openBottomSheet}
						/>
					</View>
				</View>
			</View>
			<BottomSheet
				ref={bottomSheetModalRef}
				onClose={closeBottomSheet}
			>
				{isChangeDate && (
					<DateTimePicker
						value={date}
						mode='date'
						display='inline'
						accentColor='black'
						onChange={onChangeDate}
						minimumDate={new Date(currentYear, 0, 1)}
						maximumDate={new Date(currentYear, 11, 31)}
					/>
				)}
				{isChooseService && (
					<View>
						<Text>Выберите услугу</Text>
						{/* здесь можно добавить компоненты для выбора услуг */}
					</View>
				)}
			</BottomSheet>
		</View>
	);
};

export default HomeScreen;
