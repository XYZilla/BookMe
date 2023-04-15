import { styledComponent } from '../../styledComponents';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const Profile = () => {
	return (
		<View className='flex-1 justify-center items-center '>
			<Text>Профиль</Text>
		</View>
	);
};

export default Profile;
