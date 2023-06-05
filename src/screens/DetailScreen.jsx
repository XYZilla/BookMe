import { styledComponent } from '../../styledComponents';
import {
	Image,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	setDoc,
	where,
} from 'firebase/firestore';

import uuid from 'react-native-uuid';
import { auth, db } from '../../firebase/firebase-config';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const DetailScreen = ({ navigation, route }) => {
	const [like, setLike] = useState(false);
	const { id } = route.params;
	const { title } = route.params;
	const { address } = route.params;
	const { image } = route.params;
	const { desc } = route.params;
	const { rating } = route.params;
	const { count_reviews } = route.params;
	const [isLoading, setIsLoading] = useState(true);
	const [appointmentExist, setAppointmentExist] = useState(false);

	const userId = auth.currentUser.uid;

	const fetchData = async () => {
		const appointmentsQuery = query(
			collection(db, 'appointments'),
			where('userId', '==', userId),
			where('title', '==', title)
		);

		const appointmentsSnapshot = await getDocs(appointmentsQuery);

		if (!appointmentsSnapshot.empty) {
			setAppointmentExist(true);
		}

		// Проверяем, есть ли услуга в избранном для текущего пользователя
		const favoriteServiceRef = doc(db, 'favorites', id);
		const favoriteServiceSnapshot = await getDoc(favoriteServiceRef);

		if (favoriteServiceSnapshot.exists()) {
			setLike(true);
		}
		setIsLoading(false);
	};

	const onLike = async () => {
		setLike(!like);

		// Создаем объект, представляющий информацию об избранной услуге
		const favoriteService = {
			serviceId: id,
			userId: userId,
		};

		// Получаем ссылку на документ в коллекции 'favorites' с идентификатором, равным serviceId
		const favoriteServiceRef = doc(db, 'favorites', id);

		// Если услуга уже в избранном, удаляем ее из коллекции 'favorites'
		if (like) {
			try {
				await deleteDoc(favoriteServiceRef);
				console.log('Услуга удалена из избранного');
			} catch (error) {
				console.error('Ошибка при удалении услуги из избранного:', error);
			}
		} else {
			// Если услуга не в избранном, добавляем ее в коллекцию 'favorites'
			try {
				await setDoc(favoriteServiceRef, favoriteService);
				console.log('Услуга добавлена в избранное');
			} catch (error) {
				console.error('Ошибка при добавлении услуги в избранное:', error);
			}
		}
	};

	const onBooking = () => {
		navigation.navigate('Booking', { id, title });
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (isLoading) {
		return (
			<View className='flex-1 justify-center items-center'>
				<ActivityIndicator size='large' />
			</View>
		);
	}

	return (
		<View className='flex-1'>
			<View className='absolute top-14 z-10'>
				<View className='flex-row justify-between w-screen'>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						className='h-11 w-11 flex justify-center items-center rounded-xl mx-5 backdrop-opacity-10 backdrop-invert bg-white/60'
					>
						<Ionicons
							name='ios-arrow-back-outline'
							size={24}
							color='black'
						/>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onLike}
						className='h-11 w-11 flex justify-center items-center rounded-xl mx-5 backdrop-opacity-10 backdrop-invert bg-white/60'
					>
						<Ionicons
							name='heart'
							size={24}
							color={like ? 'red' : 'black'}
						/>
					</TouchableOpacity>
				</View>
			</View>
			<View>
				<Image
					style={{ width: '100%', height: '70%' }}
					source={{
						uri: image,
					}}
				/>
			</View>

			<ScrollView
				scrollEventThrottle={16}
				className={`h-screen bg-white mt-[-210px] rounded-t-3xl`}
			>
				<View className='flex-row justify-between mt-3'>
					<Text className='text-3xl ml-5 font-semibold'>{title}</Text>
				</View>
				<View className='items-start mx-5 mt-3 mb-5 flex-row '>
					<Rating
						type='star' // Change to 'heart' or 'rocket' for different rating icons
						ratingCount={5} // Number of rating icons to display
						imageSize={20} // Size of the rating icon
						startingValue={rating} // Initial rating value
						onFinishRating={(rating) => console.log(rating)} // Callback function when a rating is selected
						readonly // Prevents the user from changing the rating value
					/>

					<Text className='text-lg font-medium ml-1 mt-[-5px]'>
						/ {count_reviews} отзывов
					</Text>
				</View>
				<View className='flex-row justify-between mx-5 mb-5'>
					<View className='flex-row'>
						<Feather
							name='map-pin'
							size={24}
							color='black'
						/>
						<Text className='text-lg font-medium ml-1'>{address}</Text>
					</View>

					<View className='flex-row'>
						<TouchableOpacity>
							<Ionicons
								name='ios-logo-whatsapp'
								size={24}
								color='black'
							/>
						</TouchableOpacity>

						<TouchableOpacity className='ml-3'>
							<Feather
								name='phone-call'
								size={24}
								color='black'
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View className='mx-5'>
					<Text className='text-[16px] font-normal ml-1'>{desc}</Text>
				</View>
				<View className='mx-5 mt-5 mb-5'>
					<Button
						onPress={onBooking}
						title={appointmentExist ? 'Вы записаны' : 'Продолжить'}
						disabled={appointmentExist ? true : false}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

export default DetailScreen;
