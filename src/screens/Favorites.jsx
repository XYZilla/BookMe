import { styledComponent } from '../../styledComponents';
import {
	collection,
	getDocs,
	onSnapshot,
	query,
	where,
	doc,
	getDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase-config';
import { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FavoriteCard from '../components/FavoriteCard';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const Favorites = ({ navigation }) => {
	const [favorites, setFavorites] = useState([]);
	const [services, setServices] = useState([]);
	const userId = auth.currentUser.uid;

	const fetchFavorites = async () => {
		const querySnapshot = await getDocs(
			query(collection(db, 'favorites'), where('userId', '==', userId))
		);

		const newData = [];
		querySnapshot.forEach((doc) => {
			newData.push(doc.data());
		});

		setFavorites(newData);
	};

	const fetchServices = async () => {
		const serviceData = [];

		for (const favorite of favorites) {
			const serviceDoc = await getDoc(doc(db, 'services', favorite.serviceId));
			if (serviceDoc.exists()) {
				serviceData.push(serviceDoc.data());
			}
		}

		setServices(serviceData);
	};

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, 'favorites'), where('userId', '==', userId)),
			(snapshot) => {
				const newData = [];
				snapshot.forEach((doc) => {
					newData.push(doc.data());
				});
				setFavorites(newData);
			}
		);

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		fetchServices();
	}, [favorites]);

	useEffect(() => {
		fetchFavorites();
	}, []);

	if (services.length === 0) {
		return (
			<View className='flex-1 justify-center items-center text-center'>
				<Text className='text-2xl font-bold text-left'>Упс...</Text>
				<Text className='text-xl text-left mb-5'>
					Кажется, вы еще ничего не добавили
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
				<FlatList
					data={services}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<FavoriteCard
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
					)}
				/>
			</View>
		</View>
	);
};

export default Favorites;
