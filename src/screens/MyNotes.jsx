import { styledComponent } from '../../styledComponents';
import BookingCard from '../components/BookingCard';
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	onSnapshot,
	query,
	where,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase-config';
import { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '../components/BottomSheet';
import Button from '../ui/Button';
import { TouchableWithoutFeedback } from 'react-native';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const MyNotes = ({ navigation }) => {
	const [data, setData] = useState([]);
	const bottomSheetModalRef = useRef(null);
	let appointmentId = '';
	const userId = auth.currentUser.uid;

	const fetchData = async () => {
		const querySnapshot = await getDocs(
			query(
				collection(db, 'appointments'),
				where('active', '==', true),
				where('userId', '==', userId)
			)
		);

		const newData = [];
		querySnapshot.forEach((doc) => {
			newData.push(doc.data());
		});

		setData(newData);
	};

	const openBottomSheet = () => {
		bottomSheetModalRef.current?.present();
	};

	const closeBottomSheet = () => {
		bottomSheetModalRef.current?.close();
	};

	useEffect(() => {
		fetchData();
		const unsubscribe = onSnapshot(
			query(
				collection(db, 'appointments'),
				where('active', '==', true),
				where('userId', '==', userId)
			),
			(snapshot) => {
				const newData = [];
				snapshot.forEach((doc) => {
					newData.push(doc.data());
				});
				setData(newData);
			}
		);

		return () => unsubscribe();
	}, []);

	const canselAppointment = async (id) => {
		try {
			const documentId = id;

			// Создайте ссылку на документ с использованием id
			const documentRef = doc(db, 'appointments', documentId);

			await deleteDoc(documentRef);
			console.log('Документ успешно удален');
		} catch (error) {
			console.error('Ошибка при удалении документа:', error);
		}
	};

	if (data.length === 0) {
		return (
			<View className='flex-1 justify-center items-center text-center'>
				<Text className='text-2xl font-bold text-left'>Упс...</Text>

				<Text className='text-xl text-left mb-5'>
					Кажется вы еше никуда не записались
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
						(appointmentId = item.id),
						(
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
									onPress={openBottomSheet}
								/>
							</View>
						)
					)}
					keyExtractor={(item) => item.id}
				/>
			</View>

			<BottomSheet
				ref={bottomSheetModalRef}
				onClose={closeBottomSheet}
				snapPoint={'25'}
			>
				<View className='mx-5 mt-5'>
					<View className='justify-center items-center mt-2'>
						<View className='w-full mb-3'>
							<Button
								title='Отмена'
								onPress={closeBottomSheet}
								colors={['bg-secondary', '#D9D9D9']}
							/>
						</View>
						<View className='w-full'>
							<Button
								title='Отменить запись'
								colors={['bg-red-500', '#dc2626', 'text-text_light']}
								onPress={() => canselAppointment(appointmentId)}
							/>
						</View>
					</View>
				</View>
			</BottomSheet>
		</View>
	);
};

export default MyNotes;
