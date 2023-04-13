import React, { useState } from 'react';
import { styledComponent } from '../../styledComponents';
import Field from '../ui/Field';
import Button from '../ui/Button';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { signUp } from '../../firebase/firebase-config';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import Alert from '../components/Alert';
import LottieIcon from '../components/LottieIcon';
import succesAnimation from '../../animations/success.json';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const SignUp = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isSuccess, setIsSucces] = useState(false);

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
			await signUp(email, password, name);
			console.log('User signed up successfully');
			setIsSucces(true);
		} catch (error) {
			console.log('Sign Up failed:', error.message);
			if (error.code === 'auth/email-already-in-use') {
				setShowAlert(true);
				setErrorMessage('Этот email уже зарегистрирован');
				return;
			} else {
				setShowAlert(true);
				setErrorMessage('Ошибка регистрации!');
			}
		} finally {
			setName('');
			setEmail('');
			setPassword('');
			setLoading(false);
		}
	};

	const closeAlert = () => {
		setShowAlert(false);
	};

	if (isSuccess) {
		return (
			<View className='flex-1 justify-center items-center'>
				<LottieIcon
					source={succesAnimation}
					onAnimationFinish={() => navigation.navigate('SignIn')}
				/>
			</View>
		);
	}

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
						<Text className='text-text_dark text-3xl font-bold'>
							Регистрация
						</Text>
					</View>
					<View className='w-9/12'>
						<>
							<Field
								value={name}
								onChange={(val) => setName(val)}
								placeholder='Введите имя'
								icon={
									<AntDesign
										name='user'
										size={24}
										color='black'
									/>
								}
							/>

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
								placeholder='Придумайте пароль'
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
									title='Далее'
									onPress={authHandler}
								/>
							</View>
						</>

						<View className='flex-row justify-between'>
							<Text className=''>Уже есть аккаунт?</Text>
							<TouchableOpacity onPress={() => navigation.goBack()}>
								<Text className='font-semibold'>Войти</Text>
							</TouchableOpacity>
						</View>
					</View>
				</>
			)}
		</View>
	);
};

export default SignUp;
