import { useState, useEffect, useRef } from 'react';
import { styledComponent } from '../../styledComponents';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Field from '../ui/Field';
import Button from '../ui/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomSheet from '../components/BottomSheet';
import { Dimensions, FlatList, ActivityIndicator, Image } from 'react-native';
import CategoryCard from '../components/CategoryCard';
import ServiceCard from '../components/ServiceCard';
import Alert from '../components/Alert';
import {
	collection,
	doc,
	getDocs,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const HomeScreen = ({ navigation }) => {
	const [userName, setUserName] = useState('');
	const [date, setDate] = useState(new Date());
	const bottomSheetModalRef = useRef(null);
	const [isChangeDate, setIsChangeDate] = useState(false);
	const [isChooseService, setIsChooseService] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [showAlert, setShowAlert] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [servicesData, setServicesData] = useState([]);
	const [categoriesData, setCategoriesData] = useState([]);

	const loadUserName = async () => {
		const login = await AsyncStorage.getItem('userName');
		setUserName(login);
	};

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
	};

	const handlePressSelectCategory = (item) => {
		setSelectedCategory(item);
	};

	const closeAlert = () => {
		setShowAlert(false);
	};

	const handleSearch = () => {
		if (!selectedCategory) {
			setShowAlert(true);
			setErrorMessage('Выберите услугу!');
			return;
		}

		const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
			.toString()
			.padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

		const { id } = selectedCategory;

		setSelectedCategory(null);
		setDate(new Date());
		navigation.navigate('Search', {
			categoryId: id,
			date: formattedDate,
			categoryName: selectedCategory.name,
		});
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

	const greeting = `${getGreeting()}, ${userName}!`;

	const fetchData = async () => {
		try {
			const servicesQuerySnapshot = await getDocs(collection(db, 'services'));
			const newServicesData = [];

			servicesQuerySnapshot.forEach((doc) => {
				newServicesData.push(doc.data());
			});

			const categoriesQuerySnapshot = await getDocs(
				collection(db, 'categories')
			);
			const newCategoriesData = [];
			categoriesQuerySnapshot.forEach((doc) => {
				newCategoriesData.push(doc.data());
			});

			const email = await AsyncStorage.getItem('email');

			if (email) {
				const querySnapshot = await getDocs(
					query(collection(db, 'users'), where('email', '==', email))
				);
				const user = querySnapshot.docs[0].data();
				setUserName(user.login);

				// Подписка на обновления поля 'login'
				const userId = querySnapshot.docs[0].id;
				const userDocRef = doc(db, 'users', userId);
				onSnapshot(userDocRef, (doc) => {
					const updatedUser = doc.data();
					setUserName(updatedUser.login);
				});
			}

			setServicesData(newServicesData);
			setCategoriesData(newCategoriesData);
			setIsLoading(false);
		} catch (error) {
			console.log('Error fetching data: ', error);
		}
	};

	const toProfile = () => {
		navigation.navigate('Profile', { login: userName });
	};

	useEffect(() => {
		loadUserName();
		fetchData();
	}, []);

	return (
		<View className='flex-1'>
			<View>
				<View className='absolute top-0 w-screen z-10'>
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
						<TouchableOpacity onPress={toProfile}>
							<Image
								source={require('../images/avatar.png')}
								className='w-20 h-20 rounded-full object-cover'
							/>
						</TouchableOpacity>
					</View>
					<View className='mt-5'>
						<TouchableOpacity onPress={openServiceChooseHandler}>
							<Field
								placeholder='Выберите категорию'
								editable={false}
								value={selectedCategory?.name ?? ''}
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
					{isLoading ? (
						<View className='justify-center items-center mt-5'>
							<ActivityIndicator size='large' />
						</View>
					) : (
						<View>
							<FlatList
								data={servicesData}
								horizontal
								pagingEnabled
								showsHorizontalScrollIndicator={false}
								snapToInterval={Dimensions.get('window').width / 1.4 + 10}
								contentContainerStyle={{ paddingHorizontal: 19.5 }}
								ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
								renderItem={({ item }) => (
									<View>
										<ServiceCard
											title={item.name}
											image={item.image_url}
											onPress={() =>
												navigation.navigate('Detail', {
													id: item.id,
													title: item.name,
													image: item.image_url,
													address: item.address,
													desc: item.desc,
													rating: item.rating,
													count_reviews: item.count_reviews,
												})
											}
										/>
									</View>
								)}
								keyExtractor={(item) => item.id}
							/>
						</View>
					)}
				</View>
			</View>

			<BottomSheet
				ref={bottomSheetModalRef}
				onClose={closeBottomSheet}
			>
				{isChangeDate && (
					<View>
						<View className='flex-row justify-between px-5 mt-[-10px] mb-2'>
							<Text className='text-lg font-semibold py-2'>Выберите дату</Text>
							<TouchableOpacity onPress={closeBottomSheet}>
								<Text className='text-lg font-semibold py-2 text-blue-500'>
									готово
								</Text>
							</TouchableOpacity>
						</View>
						<DateTimePicker
							value={date}
							mode='date'
							display='inline'
							accentColor='black'
							onChange={onChangeDate}
							minimumDate={new Date(currentYear, 0, 1)}
							maximumDate={new Date(currentYear, 11, 31)}
						/>
					</View>
				)}
				{isChooseService && (
					<View className='mx-5 h-screen'>
						<View className='flex-row justify-between mt-[-10px] mb-2'>
							<Text className='text-lg font-semibold py-2'>
								Выберите категорию
							</Text>
							<TouchableOpacity onPress={closeBottomSheet}>
								<Text className='text-lg font-semibold py-2 text-blue-500'>
									готово
								</Text>
							</TouchableOpacity>
						</View>
						<FlatList
							data={categoriesData}
							numColumns={3}
							renderItem={({ item }) => (
								<CategoryCard
									title={item.name}
									onPress={() => handlePressSelectCategory(item)}
								/>
							)}
							keyExtractor={(item) => item.id}
						/>
					</View>
				)}
			</BottomSheet>
		</View>
	);
};

export default HomeScreen;
