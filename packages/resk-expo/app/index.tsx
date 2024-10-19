import { View, Text } from 'react-native'
import TextInputComponent from '@components/TextInput';
import FontIcon from '@components/Icon/Font';

const index = () => {
    return (
        <View>
            <Text>index</Text>
            <TextInputComponent placeholder='Enter my label' label='My Label11' />
            <FontIcon name={"camera"} title="A font icon" />
        </View>
    )
}

export default index