import React, { useEffect, useState } from 'react';
import { styledComponent } from '../../styledComponents';
import Field from '../ui/Field';
import Button from '../ui/Button';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { signIn } from '../../firebase/firebase-config';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Alert from '../components/Alert';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const SignIn = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const isEmailValid = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const authHandler = async () => {
		if (!isEmailValid(email) || !password || password.length < 8) {
			setShowAlert(true);
			setErrorMessage('Введите корректные данные!');
			return;
		}
		try {
			setLoading(true);
			await signIn(email, password);
			console.log('User signed in successfully');
			navigation.navigate('Main');
		} catch (error) {
			console.log('Sign in failed:', error.message);
			if (
				error.code === 'auth/user-not-found' ||
				error.code === 'auth/wrong-password'
			) {
				setShowAlert(true);
				setErrorMessage('Неправильный email или пароль!');
				return;
			} else {
				setShowAlert(true);
				setErrorMessage('Ошибка регистрации!');
			}
		} finally {
			setEmail('');
			setPassword('');
			setLoading(false);
		}
	};

	useEffect(() => {
		const loadUserName = async () => {
			const name = await AsyncStorage.getItem('userName');
			if (name) {
				navigation.navigate('Main');
			}
		};
		loadUserName();
	}, []);

	const closeAlert = () => {
		setShowAlert(false);
	};

	return (
		<View className='flex-1 justify-center items-center '>
			{loading ? (
				<ActivityIndicator size='large' />
			) : (
				<>
					<View className='absolute top-0 w-screen '>
						{showAlert && (
							<Alert
								message={errorMessage}
								status='error'
								onClose={closeAlert}
							/>
						)}
					</View>

					<View>
						<Text className='text-text_dark text-3xl font-bold'>Войти</Text>
					</View>
					<View className='w-9/12'>
						<>
							<Field
								value={email}
								onChange={(val) => setEmail(val)}
								placeholder='Введите email'
								icon={
									<MaterialIcons
										name='alternate-email'
										size={24}
									/>
								}
							/>
							<Field
								value={password}
								onChange={(val) => setPassword(val)}
								placeholder='Введите пароль'
								isSecure={true}
								icon={
									<MaterialIcons
										name='lock-outline'
										size={24}
									/>
								}
							/>
							<View className='mt-4 mb-5'>
								<Button
									title='Погнали'
									onPress={authHandler}
								/>
							</View>
						</>

						<View className='flex-row justify-between'>
							<Text className=''>Еще нет аккаунта?</Text>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate('SignUp', setShowAlert(false))
								}
							>
								<Text className='font-semibold'>Зарегистрируйся</Text>
							</TouchableOpacity>
						</View>
					</View>
				</>
			)}
		</View>
	);
};

export default SignIn;
