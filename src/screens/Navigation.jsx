import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Octicons, AntDesign } from '@expo/vector-icons';
import SignIn from './SignIn';
import HomeScreen from './Home';
import SignUp from './SignUp';
import SearchScreen from './SearchScreen';
import Profile from './Profile';
import DetailScreen from './DetailScreen';
import Booking from './Booking';
import MyNotes from './MyNotes';
import HistoryNotes from './HistoryNotes';
import Favorites from './Favorites';

const Stack = createStackNavigator();

const AuthStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name='SignIn'
				component={SignIn}
			/>
			<Stack.Screen
				name='SignUp'
				component={SignUp}
			/>
		</Stack.Navigator>
	);
};

const Navigation = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{ headerShown: false, headerBackTitleVisible: false }}
			>
				<Stack.Screen
					name='Auth'
					component={AuthStack}
				/>
				<Stack.Screen
					name='Home'
					component={HomeScreen}
					options={{ headerShown: false, gestureEnabled: false }}
				/>
				<Stack.Screen
					name='Detail'
					component={DetailScreen}
					options={{
						headerLeftLabelVisible: false,
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name='Booking'
					component={Booking}
					options={{
						headerLeftLabelVisible: false,
						headerShown: false,
						presentation: 'modal',
					}}
				/>
				<Stack.Screen
					name='Search'
					component={SearchScreen}
					options={{
						headerShown: true,
						title: 'Поиск',
						headerTintColor: 'black',
						headerTransparent: true,
					}}
				/>
				<Stack.Screen
					name='Profile'
					component={Profile}
					options={{
						headerShown: true,
						title: 'Профиль',
						headerTintColor: 'black',
						headerTransparent: true,
					}}
				/>
				<Stack.Screen
					name='MyNotes'
					component={MyNotes}
					options={{
						headerShown: true,
						title: 'Мои записи',
						headerTintColor: 'black',
						headerTransparent: true,
					}}
				/>
				<Stack.Screen
					name='HistoryNotes'
					component={HistoryNotes}
					options={{
						headerShown: true,
						title: 'История записей',
						headerTintColor: 'black',
						headerTransparent: true,
					}}
				/>
				<Stack.Screen
					name='Favorites'
					component={Favorites}
					options={{
						headerShown: true,
						headerBackTitleVisible: false,
						title: 'Избранное',
						headerTintColor: 'black',
						headerTransparent: true,
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
