import { styledComponent } from '../../styledComponents';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const SearchScreen = () => {
	return (
		<View className='flex-1 justify-center items-center '>
			<Text>Поиск</Text>
		</View>
	);
};

export default SearchScreen;
