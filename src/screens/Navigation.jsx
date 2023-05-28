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

const HomeStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='Home'
				component={HomeScreen}
				options={{ headerShown: false }}
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
		</Stack.Navigator>
	);
};

const Navigation = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name='Auth'
					component={AuthStack}
				/>
				<Stack.Screen
					name='HomeScreen'
					component={HomeStack}
				/>
				<Stack.Screen
					name='Search'
					component={SearchScreen}
				/>
				<Stack.Screen
					name='Profile'
					component={Profile}
					options={{
						headerShown: true,
						headerBackTitleVisible: false,
						title: 'Профиль',
						headerTintColor: 'black',
						headerStyle: { backgroundColor: '#F2F2F2' },
					}}
				/>
				<Stack.Screen
					name='MyNotes'
					component={MyNotes}
					options={{
						headerShown: true,
						headerBackTitleVisible: false,
						title: 'Мои записи',
						headerTintColor: 'black',
						headerStyle: { backgroundColor: '#F2F2F2' },
					}}
				/>
				<Stack.Screen
					name='HistoryNotes'
					component={HistoryNotes}
					options={{
						headerShown: true,
						headerBackTitleVisible: false,
						title: 'История записей',
						headerTintColor: 'black',
						headerStyle: { backgroundColor: '#F2F2F2' },
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
						headerStyle: { backgroundColor: '#F2F2F2' },
					}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
