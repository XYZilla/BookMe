import { TouchableOpacity } from 'react-native-gesture-handler';
import { styledComponent } from '../../styledComponents';
import { Octicons } from '@expo/vector-icons';
import Profile from './Profile';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const MyNotes = ({ navigation }) => {

const BackToProfile = () => {
    navigation.navigate('Profile');
};

    return(
      <View className='flex-row'>
        <View className='mx-5 mt-16'>
          <Octicons name="chevron-left" size={32} color="black" onPress={BackToProfile}/>
        </View>
        <View className='mx-1 mt-auto'>
          <Text className='font-bold text-2xl'>Мои записи</Text> 
        </View>
      </View>
    );
};

export default MyNotes;