import { styledComponent } from '../../styledComponents';
import BookingCard from '../components/BookingCard';
import {
	collection,
	getDocs,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase-config';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const Favorites = ({ navigation }) => {
	const [data, setData] = useState([]);
	const userId = auth.currentUser.uid;

	const fetchData = async () => {
		const querySnapshot = await getDocs(
			query(collection(db, 'appointments'), where('userId', '==', userId))
		);

		const newData = [];
		querySnapshot.forEach((doc) => {
			newData.push(doc.data());
		});

		setData(newData);
	};

	useEffect(() => {
		fetchData();
	}, []);

	if (data.length === 0) {
		return (
			<View className='flex-1 justify-center items-center text-center'>
				<Text className='text-2xl font-bold text-left'>Упс...</Text>

				<Text className='text-xl text-left mb-5'>
					Кажется вы еще ничего не добавили
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
		<View className='flex-1'>
			<View className='mx-5 mt-28'>
				<FlatList
					data={data}
					ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
					renderItem={({ item }) => (
						<View>
							<BookingCard
								title={item.title}
								time={item.time}
								date={item.date
									.toDate()
									.toLocaleDateString('ru-RU', {
										weekday: 'long',
										month: 'long',
										day: 'numeric',
									})
									.replace(',', '')}
							/>
						</View>
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>
		</View>
	);
};

export default Favorites;
