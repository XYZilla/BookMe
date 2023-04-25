import { useState, useEffect, useRef } from 'react';
import { styledComponent } from '../../styledComponents';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Field from '../ui/Field';
import Button from '../ui/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet from '../components/BottomSheet';
import { Dimensions, FlatList, TouchableWithoutFeedback } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import ServiceCard from '../components/ServiceCard';
import Alert from '../components/Alert';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const HomeScreen = ({ navigation }) => {
	const [userName, setUserName] = useState('');
	const [date, setDate] = useState(new Date());
	const bottomSheetModalRef = useRef(null);
	const [isChangeDate, setIsChangeDate] = useState(false);
	const [isChooseService, setIsChooseService] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

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
		setIsChooseService(false);
		openBottomSheet();
	};

	const openServiceChooseHandler = () => {
		setIsChooseService(true);
		setIsChangeDate(false);
		openBottomSheet();
	};

	const onChangeDate = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setDate(currentDate);
		setTimeout(() => {
			setIsChangeDate(false);
			closeBottomSheet();
		}, 100);
	};

	const handlePressSelectCategory = (item) => {
		setSelectedCategory(item);
		closeBottomSheet();
	};

	const closeAlert = () => {
		setShowAlert(false);
	};

	const handleSearch = () => {
		if (!selectedCategory) {
			setShowAlert(true);
			setErrorMessage('Выберитие услугу!');
			return;
		}
		navigation.navigate('Search');
		setSelectedCategory({});
		setShowAlert(false);
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

	const data = [
		{ id: '1', text: 'Элемент 1' },
		{ id: '2', text: 'Элемент 2' },
		{ id: '3', text: 'Элемент 3' },
		{ id: '4', text: 'Элемент 4' },
		{ id: '5', text: 'Элемент 5' },
		{ id: '6', text: 'Элемент 6' },
		{ id: '7', text: 'Элемент 7' },
		{ id: '8', text: 'Элемент 8' },
		{ id: '9', text: 'Элемент 9' },
	];

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
		<TouchableWithoutFeedback onPress={closeBottomSheet}>
			<View className='flex-1'>
				<View className='w-screen'>
					{showAlert && (
						<Alert
							message={errorMessage}
							status='error'
							onClose={closeAlert}
						/>
					)}
				</View>
				<View className='mx-5 mt-16'>
					<View className='flex-row justify-between'>
						<View className='w-9/12'>
							<Text className='font-normal text-2xl mb-1'>{greeting}</Text>
							<Text className='font-bold text-4xl'>
								Куда хотите записаться?
							</Text>
						</View>
						<TouchableOpacity onPress={exitHandle}>
							<Text className='font-semibold text-lg'>Выйти</Text>
						</TouchableOpacity>
					</View>
					<View className='mt-5'>
						<TouchableOpacity onPress={openServiceChooseHandler}>
							<Field
								placeholder='Выберите услугу'
								editable={false}
								value={selectedCategory?.text ?? ''}
								icon={
									<MaterialCommunityIcons
										name='widgets-outline'
										size={24}
									/>
								}
							/>
						</TouchableOpacity>

						<TouchableOpacity onPress={openDatePickerHandler}>
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
								onPress={handleSearch}
							/>
						</View>
					</View>
				</View>

				<View className='h-screen'>
					<Text className='text-xl font-semibold mb-2 ml-5'>Популярные</Text>
					<FlatList
						data={data}
						horizontal
						snapToInterval={Dimensions.get('window').width / 1.4 + 10}
						contentContainerStyle={{ paddingHorizontal: 19.5 }}
						ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
						renderItem={({ item }) => (
							<View>
								<ServiceCard
									title={item.text}
									onPress={() =>
										navigation.navigate('Detail', {
											title: item.text,
										})
									}
								/>
							</View>
						)}
						keyExtractor={(item) => item.id}
					/>
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
						<View className='mx-5 h-screen'>
							<Text className='text-lg font-semibold py-2'>
								Выберите услугу
							</Text>
							<FlatList
								data={data}
								numColumns={3}
								renderItem={({ item }) => (
									<CategoryCard
										title={item.text}
										onPress={() => handlePressSelectCategory(item)}
									/>
								)}
								keyExtractor={(item) => item.id}
							/>
						</View>
					)}
				</BottomSheet>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default HomeScreen;
