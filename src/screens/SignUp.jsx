import React, { useState } from 'react';
import { styledComponent } from '../../styledComponents';
import Field from '../ui/Field';
import Button from '../ui/Button';
import { Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { signUp } from '../../firebase/firebase-config';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const SignUp = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);

	const isEmailValid = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const authHandler = async () => {
		if (!isEmailValid(email) || !password || password.length < 8) {
			Alert.alert('Введите корректные данные!');
			return;
		}
		try {
			setLoading(true);
			await signUp(email, password, name);
			console.log('User signed up successfully');
			Alert.alert('Вы успешно зарегистрировались');
			navigation.navigate('SignIn');
		} catch (error) {
			console.log('Sign Up failed:', error.message);
			Alert.alert('Ошибка регистрации', error.message);
		} finally {
			setName('');
			setEmail('');
			setPassword('');
			setLoading(false);
		}
	};

	return (
		<View className='flex-1 justify-center items-center '>
			{loading ? (
				<ActivityIndicator />
			) : (
				<>
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
							/>

							<Field
								value={email}
								onChange={(val) => setEmail(val)}
								placeholder='Введите email'
							/>

							<Field
								value={password}
								onChange={(val) => setPassword(val)}
								placeholder='Введите пароль'
								isSecure={true}
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
