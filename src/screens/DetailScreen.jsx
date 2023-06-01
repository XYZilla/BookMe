import { styledComponent } from '../../styledComponents';
import { Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import {
	collection,
	deleteDoc,
	doc,
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

	const userId = auth.currentUser.uid;
	const favoriteId = uuid.v4();

	const fetchData = async () => {
		const favoritesQuery = query(
			collection(db, 'favorites'),
			where('serviceId', '==', id),
			where('userId', '==', userId)
		);

		const favoritesSnapshot = await getDocs(favoritesQuery);

		setLike(!favoritesSnapshot.empty);
	};

	const onLike = async () => {
		const favoriteRef = doc(db, 'favorites', favoriteId);

		if (like) {
			await deleteDoc(favoriteRef);
			setLike((prevLike) => !prevLike);
		} else {
			await setDoc(favoriteRef, {
				userId: userId,
				serviceId: id,
			});
			setLike((prevLike) => !prevLike);
		}

		fetchData();
	};

	const onBooking = () => {
		navigation.navigate('Booking', { id, title });
	};

	useEffect(() => {
		fetchData();
	}, []);

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
						title='Продолжить'
					/>
				</View>
			</ScrollView>
		</View>
	);
};

export default DetailScreen;
