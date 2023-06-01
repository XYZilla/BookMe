import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	updateProfile,
	updatePassword,
} from 'firebase/auth';
import {
	getFirestore,
	doc,
	setDoc,
	getDocs,
	query,
	collection,
	where,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
	apiKey: 'AIzaSyCYNmHo4Br5PT_LzjBbD74582z_O1HH7h4',
	authDomain: 'bookme-bdef8.firebaseapp.com',
	projectId: 'bookme-bdef8',
	storageBucket: 'bookme-bdef8.appspot.com',
	messagingSenderId: '809619917577',
	appId: '1:809619917577:web:2f46183a0470feef79e1d8',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();

export const signUp = async (email, password, login) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		if (user) {
			console.log('User registered:', user.uid);

			// Добавление пользователя в Firestore
			const userDocRef = doc(db, 'users', user.uid);
			await setDoc(userDocRef, {
				login: login,
				uid: user.uid,
				email: user.email,
			});
		} else {
			console.log('Registration failed:', error.message);
		}
	} catch (error) {
		console.log('Registration failed:', error.message);
		throw error;
	}
};

export const signIn = async (emailOrLogin, password) => {
	try {
		let userCredential;
		let user;

		// Проверяем, является ли введенное значение email или login
		if (emailOrLogin.includes('@')) {
			// Вход по email
			userCredential = await signInWithEmailAndPassword(
				auth,
				emailOrLogin,
				password
			);
			user = userCredential.user;
		} else {
			// Вход по login
			// Находим пользователя по login в Firestore
			const querySnapshot = await getDocs(
				query(collection(db, 'users'), where('login', '==', emailOrLogin))
			);
			const users = querySnapshot.docs.map((doc) => doc.data());
			user = users[0]; // Предполагаем, что найден только один пользователь

			if (user) {
				await AsyncStorage.setItem('userName', user.login);

				// Аутентификация пользователя по email и паролю
				userCredential = await signInWithEmailAndPassword(
					auth,
					user.email,
					password
				);
				user = userCredential.user;
			}
		}

		if (user) {
			console.log('User signed in:', emailOrLogin);
			await AsyncStorage.setItem('email', user.email);
			await AsyncStorage.setItem('password', password);
		} else {
			throw new Error('Failed to sign in');
		}
	} catch (error) {
		console.log('Sign in failed:', error.message);
		throw error;
	}
};

export const changePassword = async (currentPassword, newPassword) => {
	try {
		const user = auth.currentUser;
		const credentials = await signInWithEmailAndPassword(
			auth,
			user.email,
			currentPassword
		);
		await updatePassword(credentials.user, newPassword);
		console.log('Password changed successfully');
	} catch (error) {
		console.log('Failed to change password:', error.message);
		throw error;
	}
};
