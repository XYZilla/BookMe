import { useState, useEffect, useRef, Component } from 'react';
import { styledComponent } from '../../styledComponents';
import { ChangeUserName, changePassword } from '../../firebase/firebase-config';
import { AntDesign, Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BottomSheet from '../components/BottomSheet';
import { Button, TouchableWithoutFeedback } from 'react-native';
import Field from '../ui/Field';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const Profile = ({ navigation }) => {
	const [userName, setUserName] = useState('');
	const bottomSheetModalRef = useRef(null);
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [isChooseLogin, setIsChooseLogin] = useState(false);
	const [isChoosePassword, setIsChoosePassword] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const name = await AsyncStorage.getItem('userName');
				if (name) {
					setUserName(name);
				}

				const usersQuerySnapshot = await getDocs(
					query(collection(db, 'users'), where('login', '==', name))
				);
				const user = usersQuerySnapshot.docs[0].data();
				setEmail(user.email);
			} catch (error) {
				console.log('Error fetching data: ', error);
			}
		};

		fetchData();
	}, []);

	const openBottomSheet = () => {
		bottomSheetModalRef.current?.present();
	};

	const closeBottomSheet = () => {
		setIsChooseLogin(false);
		setIsChoosePassword(false);
		bottomSheetModalRef.current?.close();
	};

	const ChangeName = () => {
		setIsChooseLogin(true);
		setIsChoosePassword(false);
		openBottomSheet();
	};

	const ChangePassword = () => {
		setIsChoosePassword(true);
		setIsChooseLogin(false);
		openBottomSheet();
	};

	const MyNotes = () => {
		navigation.navigate('MyNotes');
	};

	const NotesHistory = () => {
		navigation.navigate('HistoryNotes');
	};

	const Favorites = () => {
		navigation.navigate('Favorites');
	};
	const removeUserData = async () => {
		try {
			await AsyncStorage.removeItem('userName');
			await AsyncStorage.removeItem('password');
		} catch (e) {
			console.log('Error removing user data from AsyncStorage:', e);
		}
	};

	const exitHandle = () => {
		removeUserData();
		navigation.navigate('SignIn');
	};

	// Функция для применения изменения пароля
	//currentPassword - текущий пароль
	//newPassword - новый пароль
	const applyChangePassword = async (currentPassword, newPassword) => {
		try {
			await changePassword(currentPassword, newPassword);
		} catch (error) {
			// Обработка ошибки изменения пароля
			console.log(error);
		}
	};

	const applyChangeUserName = async (currentUser, newUserName) => {
		try {
			await ChangeUserName(currentUser, newUserName);
		} catch (error) {
			// Обработка ошибки изменения пароля
			console.log(error);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={closeBottomSheet}>
			<View className='flex-1'>
				<View className='mx-5 mt-5 '>
					<View className='justify-center items-center'>
						<AntDesign
							name='frown'
							size={110}
							color='black'
						/>
						<Text className='font-bold text-3xl mt-2'>{userName}</Text>
						<Text className='text-[#565656]'>{email}</Text>
					</View>
				</View>

				<View className='mx-5 mt-14'>
					<TouchableOpacity onPress={ChangeName}>
						<View>
							<Text className='font-semibold text-lg'>{userName}</Text>
							<Text className='text-[#A0A0A0]'>Сменить имя пользователя</Text>
						</View>
						<View className='items-center justify-end ml-80 -mt-8'>
							<AntDesign
								name='right'
								size={18}
								color='black'
							/>
						</View>
					</TouchableOpacity>
				</View>

				<View className='mx-5 mt-10'>
					<TouchableOpacity onPress={ChangePassword}>
						<View>
							<Text className='font-semibold text-lg'>Пароль</Text>
							<Text className='text-[#A0A0A0]'>Сменить пароль</Text>
						</View>
						<View className='items-center justify-end ml-80 -mt-8'>
							<AntDesign
								name='right'
								size={18}
								color='black'
							/>
						</View>
					</TouchableOpacity>
				</View>

				<View className='mx-5 mt-10'>
					<TouchableOpacity onPress={MyNotes}>
						<View>
							<Text className='font-semibold text-lg'>Мои записи</Text>
							<Text className='text-[#A0A0A0]'>Посмотреть активные записи</Text>
						</View>
						<View className='items-center justify-end ml-80 -mt-8'>
							<AntDesign
								name='right'
								size={18}
								color='black'
							/>
						</View>
					</TouchableOpacity>
				</View>

				<View className='mx-5 mt-10'>
					<TouchableOpacity onPress={NotesHistory}>
						<View className='items-left'>
							<Text className='font-semibold text-lg'>История записей</Text>
							<Text className='text-[#A0A0A0]'>Посмотреть историю записей</Text>
						</View>
						<View className='items-center justify-end ml-80 -mt-8'>
							<AntDesign
								name='right'
								size={18}
								color='black'
							/>
						</View>
					</TouchableOpacity>
				</View>
				<View className='mx-5 mt-10'>
					<TouchableOpacity onPress={Favorites}>
						<View className='items-left'>
							<Text className='font-semibold text-lg'>Избранное</Text>
							<Text className='text-[#A0A0A0]'>
								Посмотреть избранные услуги
							</Text>
						</View>
						<View className='items-center justify-end ml-80 -mt-8'>
							<AntDesign
								name='right'
								size={18}
								color='black'
							/>
						</View>
					</TouchableOpacity>
				</View>

				<View>
					<View className='mx-5 items-start'>
						<TouchableOpacity onPress={exitHandle}>
							<View className='mt-16'>
								<MaterialIcons
									name='logout'
									size={20}
									color='black'
								/>
							</View>
							<View className='-mt-6'>
								<Text className='font-semibold text-lg ml-8'>Выйти</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>

				<BottomSheet
					ref={bottomSheetModalRef}
					onClose={closeBottomSheet}
					snapPoint={`70%`}
				>
					{isChooseLogin && (
						<>
							<Field
								placeholder='Введите cтарый логин'
								autoFocus={true}
							/>
							<Field
								placeholder='Введите новый логин'
								autoFocus={true}
							/>

							<View className='flex-row justify-center'>
								<Button
									title='Назад'
									onPress={closeBottomSheet}
								/>
								<Button title='Продолжить' />
							</View>
						</>
					)}
					{isChoosePassword && (
						<>
							<View>
								<Field
									placeholder='Введите старый пароль'
									autoFocus={true}
								></Field>
								<Field
									placeholder='Введите новый пароль'
									autoFocus={true}
								></Field>
							</View>

							<View className='flex-row justify-center'>
								<Button
									title='Назад'
									onPress={closeBottomSheet}
								/>
								<Button title='Продолжить' />
							</View>
						</>
					)}
				</BottomSheet>
			</View>
		</TouchableWithoutFeedback>
	);
};

export default Profile;
