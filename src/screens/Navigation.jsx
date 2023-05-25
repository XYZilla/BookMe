import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

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

const TabBar = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarStyle: {
					backgroundColor: 'white',
					paddingTop: 8,
					display: 'none',
				},
			}}
		>
			<Tab.Screen
				name='HomeScreen'
				component={HomeStack}
				options={{
					headerShown: false,
					tabBarLabel: 'Домой',
					tabBarActiveTintColor: '#2E2F3C',
					tabBarInactiveTintColor: '#b9babb',

					tabBarIcon: ({ color, size }) => (
						<Octicons
							name='home'
							color={color}
							size={size}
						/>
					),
				}}
			/>

			<Tab.Screen
				name='Search'
				component={SearchScreen}
				options={{
					headerShown: false,
					tabBarLabel: 'Поиск',
					tabBarActiveTintColor: '#2E2F3C',
					tabBarInactiveTintColor: '#b9babb',
					tabBarIcon: ({ color, size }) => (
						<Octicons
							name='search'
							color={color}
							size={size}
						/>
					),
				}}
			/>

			<Tab.Screen
				name='Profile'
				component={Profile}
				options={{
					headerShown: false,
					tabBarLabel: 'Профиль',
					tabBarActiveTintColor: '#2E2F3C',
					tabBarInactiveTintColor: '#b9babb',
					tabBarIcon: ({ color, size }) => (
						<AntDesign
							name='user'
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tab.Navigator>
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
					name='Main'
					component={TabBar}
					options={{ gestureEnabled: false }}
				/>
				<Stack.Screen
					name='MyNotes'
					component={MyNotes}
				/>
				<Stack.Screen
					name='HistoryNotes'
					component={HistoryNotes}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
