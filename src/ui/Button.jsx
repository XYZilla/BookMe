import React from 'react';
import { styledComponent } from '../../styledComponents';

const StyledButton = styledComponent.StyledColorButton;
const Text = styledComponent.StyledText;

const Button = ({ onPress, title, colors = ['bg-primary', '#EBB209'] }) => {
	return (
		<StyledButton
			className={`${colors[0]} w-full p-3 rounded-xl`}
			underlayColor={colors[1]}
			onPress={onPress}
		>
			<Text className='text-text_dark text-center text-lg font-semibold'>
				{title}
			</Text>
		</StyledButton>
	);
};

export default Button;
