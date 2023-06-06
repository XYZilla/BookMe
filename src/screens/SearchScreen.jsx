import { useState, useEffect } from 'react';
import { styledComponent } from '../../styledComponents';
import { FlatList } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import SearchServiceCard from '../components/SearchServiceCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const SearchScreen = ({ route, navigation }) => {
	const [data, setData] = useState([]);

	const { categoryId } = route.params;
	const { categoryName } = route.params;
	const { date } = route.params;

	const fetchData = async () => {
		const servicesQuerySnapshot = await getDocs(
			query(collection(db, 'services'), where('categoryId', '==', categoryId))
		);

		const newServicesData = [];

		servicesQuerySnapshot.forEach((doc) => {
			const serviceData = doc.data();
			const availableTimeSlots = serviceData.available_time_slots || [];

			availableTimeSlots.forEach((timeSlot) => {
				if (timeSlot.date === date) {
					newServicesData.push(serviceData);
				}
			});
		});

		setData(newServicesData);
	};

	const currentDate = new Date(date); // Преобразование строки даты в объект Date
	const formattedDate = currentDate.toLocaleDateString('ru-RU', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	});

	useEffect(() => {
		fetchData();
	}, []);

	if (data.length === 0) {
		return (
			<View className='flex-1 justify-center items-center text-center'>
				<Text className='text-2xl font-bold text-left'>Упс...</Text>
				<Text className='text-xl w-80 text-left mb-5'>
					К сожалению по вашему запросу ничего не найдено
				</Text>
				<MaterialCommunityIcons
					name='emoticon-sad'
					size={150}
					color='black'
					style={{ opacity: 0.1 }}
				/>
			</View>
		);
	}

	return (
		<View className='flex-1 justify-center items-center text-center'>
			<View className='mt-[100px]'>
				<View className='flex-row justify-between mt-5 mb-2'>
					<Text className='text-lg font-semibold'>{categoryName}</Text>
					<Text className='text-lg font-semibold'>{formattedDate}</Text>
				</View>
				<FlatList
					data={data}
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					renderItem={({ item }) => (
						<View>
							<SearchServiceCard
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
		</View>
	);
};

export default SearchScreen;
