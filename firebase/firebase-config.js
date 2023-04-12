import { initializeApp } from 'firebase/app';
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyCYNmHo4Br5PT_LzjBbD74582z_O1HH7h4',
	authDomain: 'bookme-bdef8.firebaseapp.com',
	projectId: 'bookme-bdef8',
	storageBucket: 'bookme-bdef8.appspot.com',
	messagingSenderId: '809619917577',
	appId: '1:809619917577:web:2f46183a0470feef79e1d8',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const signUp = async (email, password, displayName) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		if (
			userCredential.additionalUserInfo &&
			userCredential.additionalUserInfo.isNewUser
		) {
			const user = userCredential.user;
			console.log('User registered:', user);
			await updateProfile(user, { displayName });
		} else {
			console.log('Registration failed');
		}
	} catch (error) {
		console.log('Registration failed:', error.message);
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
		console.log('User signed in:', user.uid);
	} catch (error) {
		console.log('Sign in failed:', error.message);
		throw error;
	}
};
