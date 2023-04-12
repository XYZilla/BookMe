import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SignIn from './SignIn';
import HomeScreen from './Home';
import SignUp from './SignUp';

const Stack = createStackNavigator();

const Navigation = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
					cardOverlayEnabled: true,
				}}
			>
				<Stack.Screen
					name='SignIn'
					component={SignIn}
				/>
				<Stack.Screen
					name='SignUp'
					component={SignUp}
					options={{ gestureEnabled: false }}
				/>
				<Stack.Screen
					name='Home'
					component={HomeScreen}
					options={{ gestureEnabled: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
