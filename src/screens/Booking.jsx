import React, { useEffect, useState } from 'react';
import { styledComponent } from '../../styledComponents';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import Button from '../ui/Button';
import { db, auth } from '../../firebase/firebase-config';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import uuid from 'react-native-uuid';
import LottieIcon from '../components/LottieIcon';
import succesAnimation from '../../animations/success.json';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const Booking = ({ route, navigation }) => {
	const [times, setTimes] = useState([]);
	const [selectedTimeId, setSelectedTimeId] = useState(0);
	const [selectedTimeTitle, setSelectedTimeTitle] = useState();
	const [date, setDate] = useState(new Date());
	const { id } = route.params;
	const { title } = route.params;
	const currentYear = new Date().getFullYear();
	const [isLoading, setIsLoading] = useState(true);
	const [isSuccess, setIsSuccess] = useState(false);
	const [appointmentExist, setAppointmentExist] = useState(false);

	const fetchData = async () => {
		try {
			const servicesQuerySnapshot = await getDocs(collection(db, 'services'));
			const serviceId = id;
			let availableTimeSlots = [];

			servicesQuerySnapshot.forEach((doc) => {
				const service = doc.data();

				if (service.id === serviceId) {
					const serviceTimeSlots = service.available_time_slots || [];

					serviceTimeSlots.forEach((timeSlot) => {
						if (timeSlot.date === formatDate(date)) {
							availableTimeSlots = availableTimeSlots.concat(timeSlot.times);
						}
					});
				}
			});

			setTimes(availableTimeSlots);
			setIsLoading(false);
		} catch (error) {
			console.log('Error fetching data: ', error);
		}
	};

	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	};

	useEffect(() => {
		fetchData();
	}, [date]);

	const onChangeDate = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		const formattedDate = formatDate(currentDate);
		setDate(currentDate);
		fetchData(formattedDate);
	};

	const userId = auth.currentUser.uid;

	const onAppointment = async () => {
		try {
			const appointmentId = uuid.v4();
			const appointmentRef = doc(db, 'appointments', appointmentId);
			const appointmentSnapshot = await getDoc(appointmentRef);
			if (appointmentSnapshot.exists()) {
				setAppointmentExist(true);
			} else {
				await setDoc(appointmentRef, {
					userId: userId,
					id: appointmentId,
					title: title,
					time: selectedTimeTitle || times[0],
					date: date,
					active: true,
				});
				setIsSuccess(true);
			}
		} catch (error) {
			setIsSuccess(false);
		}
	};

	const selectedTime = (title, id) => {
		setSelectedTimeTitle(title);
		setSelectedTimeId(id);
	};

	if (isSuccess) {
		return (
			<View className='flex-1 justify-center items-center'>
				<LottieIcon
					source={succesAnimation}
					onAnimationFinish={() => navigation.navigate('Home')}
				/>
			</View>
		);
	}

	return (
		<View>
			<View className='mt-2 flex-row justify-between items-center'>
				<View className='mx-5'>
					<Text className='text-xl font-semibold'>Выберите дату и время</Text>
				</View>
				<View className='mx-2'>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Ionicons
							name='ios-close'
							size={35}
							color='black'
						/>
					</TouchableOpacity>
				</View>
			</View>

			<View className='mx-5 mt-5'>
				<View className='mb-8'>
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

				<View>
					<Text className='text-xl font-semibold mb-2'>
						Доступное время для записи
					</Text>
					{isLoading ? (
						<View className='justify-center items-center mt-5'>
							<ActivityIndicator size='large' />
						</View>
					) : (
						<View>
							{times.length === 0 ? (
								<Text className='text-lg font-medium mb-2 text-gray-500'>
									На эту дату нет времени для записи
								</Text>
							) : (
								<FlatList
									data={times}
									numColumns={5}
									renderItem={({ item, index }) => (
										<TouchableOpacity onPress={() => selectedTime(item, index)}>
											<View
												className={`${
													selectedTimeId === index ? 'bg-black' : ''
												} p-2.5 rounded-lg mx-1 `}
											>
												<Text
													className={`text-lg ${
														selectedTimeId === index
															? 'text-white'
															: 'text-black'
													}`}
												>
													{item}
												</Text>
											</View>
										</TouchableOpacity>
									)}
									keyExtractor={(item) => item}
								/>
							)}
						</View>
					)}
				</View>
			</View>
			<View className='mx-5 mt-10 mb-5'>
				<Button
					title={times.length === 0 ? 'Выберите другую дату' : 'Записаться'}
					disabled={times.length === 0 ? true : false}
					colors={
						times.length === 0 ? ['bg-gray-200'] : ['bg-primary', '#EBB209']
					}
					onPress={onAppointment}
				/>
			</View>
		</View>
	);
};

export default Booking;
