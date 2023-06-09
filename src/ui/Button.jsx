import React from 'react';
import { styledComponent } from '../../styledComponents';

const StyledButton = styledComponent.StyledColorButton;
const Text = styledComponent.StyledText;

const Button = ({
	onPress,
	disabled = false,
	title,
	colors = ['bg-primary', '#EBB209', 'text-text_dark'],
}) => {
	return (
		<StyledButton
			className={`${colors[0]} w-full p-3 rounded-xl`}
			underlayColor={colors[1]}
			onPress={onPress}
			disabled={disabled}
		>
			<Text className={`${colors[2]} text-center text-lg font-semibold`}>
				{title}
			</Text>
		</StyledButton>
	);
};

export default Button;
