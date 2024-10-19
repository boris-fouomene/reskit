import { View, Text } from 'react-native'
import TextInputComponent from '@components/TextInput';
import FontIcon from '@components/Icon/Font';

const index = () => {
    return (
        <View>
            <Text>index</Text>
            <TextInputComponent label='My Label11' />
            <FontIcon name={"camera"} title="A font icon" />
        </View>
    )
}

export default index