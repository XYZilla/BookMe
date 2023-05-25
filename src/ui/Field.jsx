import React from 'react';
import { styledComponent } from '../../styledComponents';
import { Text } from 'react-native';

const StyledField = styledComponent.StyledField;
const StyledView = styledComponent.StyledView;

const Field = ({
	placeholder,
	value,
	onChange,
	isSecure = false,
	color = 'bg-secondary',
	icon,
	editable = true,
	autoFocus,
}) => {
	return (
		<StyledView className='relative'>
			<Text className='absolute left-0 pl-3 z-10 top-7 text-text_dark'>
				{icon}
			</Text>

			<StyledField
				className={`${color} h-14 mt-3 pl-10 pr-3 rounded-xl text-[18px]`}
				value={value}
				secureTextEntry={isSecure}
				placeholder={placeholder}
				onChangeText={onChange}
				autoCorrect={false}
				autoCapitalize='none'
				editable={editable}
				autoFocus={autoFocus}
			/>
		</StyledView>
	);
};

export default Field;
