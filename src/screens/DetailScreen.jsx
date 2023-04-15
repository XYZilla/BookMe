import { styledComponent } from '../../styledComponents';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const DetailScreen = ({ route }) => {
	const { title } = route.params;
	return (
		<View className='flex-1 justify-center items-center '>
			<Text>{title}</Text>
		</View>
	);
};

export default DetailScreen;
