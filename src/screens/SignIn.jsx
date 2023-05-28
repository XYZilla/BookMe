import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	getUserByLogin,
	createUserWithEmailAndPassword,
	updateProfile,
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

export const signUp = async (email, password, displayName) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		if (user) {
			console.log('User registered:', user.uid);
			await updateProfile(user, { displayName });

			// Добавление пользователя в Firestore
			const userDocRef = doc(db, 'users', user.uid);
			await setDoc(userDocRef, {
				login: displayName, // Используем displayName в качестве значения login
				uid: user.uid,
				email: user.email,
			});

			auth.onAuthStateChanged((updatedUser) => {
				console.log('Updated user:', updatedUser.displayName);
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
			console.log('User signed in:', user.displayName);
			await AsyncStorage.setItem('userName', user.displayName);
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

export const ChangeUserName = async (currentUser, newUserName) => {
	try {
		const user = auth.currentUser;
		const credentials = await signInWithEmailAndPassword(
			auth,
			user.email,
			currentUser
		);
		await updatedUser(credentials.user, newPassword);
		console.log('Login changed successfully');
	} catch (error) {
		console.log('Failed to change login:', error.message);
		throw error;
	}
};
