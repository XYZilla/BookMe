import { useState, useEffect, useRef } from 'react';
import { styledComponent } from '../../styledComponents';
import { ChangeUserName, changePassword } from '../../firebase/firebase-config';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BottomSheet from '../components/BottomSheet';
import { ActivityIndicator, Image } from 'react-native';
import Field from '../ui/Field';
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import Button from '../ui/Button';
import LottieIcon from '../components/LottieIcon';
import succesAnimation from '../../animations/success.json';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const Profile = ({ navigation, route }) => {
	const [userName, setUserName] = useState('');
	const [newUserName, setNewUserName] = useState('');
	const bottomSheetModalRef = useRef(null);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [email, setEmail] = useState('');
	const [isChooseLogin, setIsChooseLogin] = useState(false);
	const [isChoosePassword, setIsChoosePassword] = useState(false);
	const [isChooseExit, setIsChooseExit] = useState(false);
	const [isSuccessChangeLogin, setIsSuccessChangeLogin] = useState(false);
	const [isSuccessChangePassword, setIsSuccessChangePassword] = useState(false);
	const [isLoading, setIsLoading] = useState();

	const fetchData = async () => {
		try {
			const { login } = route.params;
			if (login) {
				setUserName(login);
			}

			const email = await AsyncStorage.getItem('email');
			setEmail(email);
		} catch (error) {
			console.log('Error fetching data: ', error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const openBottomSheet = () => {
		bottomSheetModalRef.current?.present();
	};

	const closeBottomSheet = () => {
		setIsChooseLogin(false);
		setIsChoosePassword(false);
		setIsChooseExit(false);
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
			await AsyncStorage.removeItem('password');
			await AsyncStorage.removeItem('email');
			await AsyncStorage.removeItem('userName');
			navigation.navigate('SignIn');
		} catch (e) {
			console.log('Error removing user data from AsyncStorage:', e);
		}
	};

	const exitHandle = () => {
		setIsChooseExit(true);
		openBottomSheet();
	};

	// Функция для применения изменения пароля
	//currentPassword - текущий пароль
	//newPassword - новый пароль
	const applyChangePassword = async (currentPassword, newPassword) => {
		try {
			setIsChoosePassword(false);
			setIsLoading(true);
			await changePassword(currentPassword, newPassword);
			setIsSuccessChangePassword(true);
			setIsLoading(false);
		} catch (error) {
			// Обработка ошибки изменения пароля
			console.log(error);
		}
	};

	const applyChangeUserName = async () => {
		try {
			setIsChooseLogin(false);
			setIsLoading(true);
			const usersQuerySnapshot = await getDocs(
				query(collection(db, 'users'), where('email', '==', email))
			);

			if (usersQuerySnapshot.empty) {
				// Обработка случая, когда пользователь с указанным email не найден
				console.log('Пользователь не найден');
				return;
			}

			const userDoc = usersQuerySnapshot.docs[0];
			const userId = userDoc.id;

			await updateDoc(doc(db, 'users', userId), {
				login: newUserName,
			});
			setIsSuccessChangeLogin(true);
			setIsLoading(false);

			console.log('Логин успешно изменен');
		} catch (error) {
			// Обработка ошибки
			console.log('Ошибка при изменении логина:', error);
		}
	};

	const onChangeLoginFinish = () => {
		setUserName(newUserName);
		closeBottomSheet();
		setIsSuccessChangeLogin(false);
		setNewUserName('');
	};

	const onChangePasswordFinish = async () => {
		closeBottomSheet();
		setIsSuccessChangePassword(false);
		await AsyncStorage.removeItem('password');
		await AsyncStorage.setItem('password', newPassword);
	};

	return (
		<View className='flex-1'>
			<View>
				<View className='mx-5 mt-28'>
					<View className='justify-center items-center'>
						<Image
							source={require('../images/avatar.png')}
							className='w-40 h-40 rounded-full object-cover'
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
			</View>

			<BottomSheet
				ref={bottomSheetModalRef}
				onClose={closeBottomSheet}
				snapPoint={
					isChooseLogin
						? '57.5'
						: isChooseExit
						? '30'
						: isSuccessChangeLogin
						? '30'
						: isLoading
						? '30'
						: isSuccessChangePassword
						? '30'
						: '60'
				}
			>
				{isChooseLogin && (
					<>
						<View className='mx-2'>
							<Field
								placeholder='Введите новый логин'
								autoFocus={true}
								onChange={(val) => setNewUserName(val)}
								value={newUserName}
							/>

							<View className='flex-row justify-around mt-4'>
								<View className='w-48'>
									<Button
										title='Отмена'
										onPress={closeBottomSheet}
										colors={['bg-secondary', '#D9D9D9']}
									/>
								</View>
								<View className='w-48'>
									<Button
										title='Готово'
										onPress={applyChangeUserName}
									/>
								</View>
							</View>
						</View>
					</>
				)}
				{isChoosePassword && (
					<>
						<View className='mx-2'>
							<Field
								placeholder='Введите старый пароль'
								autoFocus={true}
								isSecure={true}
								onChange={(val) => setCurrentPassword(val)}
							/>
							<Field
								placeholder='Введите новый пароль'
								isSecure={true}
								onChange={(val) => setNewPassword(val)}
							/>

							<View className='flex-row justify-around mt-4'>
								<View className='w-48'>
									<Button
										title='Отмена'
										onPress={closeBottomSheet}
										colors={['bg-secondary', '#D9D9D9']}
									/>
								</View>
								<View className='w-48'>
									<Button
										title='Готово'
										onPress={() =>
											applyChangePassword(currentPassword, newPassword)
										}
									/>
								</View>
							</View>
						</View>
					</>
				)}
				{isChooseExit && (
					<>
						<View className='mx-5'>
							<Text className='font-semibold text-lg mt-3'>
								Вы точно хотите выйти?
							</Text>
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
										title='Выйти'
										colors={['bg-red-500', '#dc2626', 'text-text_light']}
										onPress={removeUserData}
									/>
								</View>
							</View>
						</View>
					</>
				)}
				{isSuccessChangeLogin && (
					<>
						<View className='justify-center items-center'>
							<LottieIcon
								source={succesAnimation}
								onAnimationFinish={onChangeLoginFinish}
							/>
						</View>
					</>
				)}

				{isLoading && (
					<View className='justify-center items-center flex-1'>
						<ActivityIndicator size='large' />
					</View>
				)}

				{isSuccessChangePassword && (
					<>
						<View className='justify-center items-center'>
							<LottieIcon
								source={succesAnimation}
								onAnimationFinish={onChangePasswordFinish}
							/>
						</View>
					</>
				)}
			</BottomSheet>
		</View>
	);
};

export default Profile;
