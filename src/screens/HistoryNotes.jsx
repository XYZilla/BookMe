import { styledComponent } from '../../styledComponents';
import { Octicons } from '@expo/vector-icons';

const View = styledComponent.StyledView;
const Text = styledComponent.StyledText;

const HistoryNotes = ({ navigation }) => {

const BackToProfile = () => {
    navigation.navigate('Profile');
};

    return(
      <View className='flex-row'>
        <View className='mx-5 mt-16'>
          <Octicons name="chevron-left" size={32} color="black" onPress={BackToProfile}/>
        </View>
        <View className='mx-1 mt-auto'>
          <Text className='font-bold text-2xl'>История записей</Text> 
        </View>
      </View>
    );
};

export default HistoryNotes;