import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
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
const db = getFirestore();

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

			// Save user data to Firestore
			const userCollectionRef = collection(db, 'users');
			const newUserDoc = await addDoc(userCollectionRef, {
				uid: user.uid,
				displayName: displayName,
				email: email,
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

export const signIn = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		const user = userCredential.user;
		if (!user.uid) {
			throw new Error('Failed to sign in');
		}
		console.log('User signed in:', user.displayName);
		await AsyncStorage.setItem('userName', user.displayName);
	} catch (error) {
		console.log('Sign in failed:', error.message);
		throw error;
	}
};
