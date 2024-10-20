import { View, Text } from 'react-native'
import TextInputComponent from '@components/TextInput';
import FontIcon from '@components/Icon/Font';

const index = () => {
    return (
        <View style={{ padding: 20 }}>
            <Text>index</Text>
            <TextInputComponent variant='outlined' placeholder='Enter my label' label='My Label11' />
            <FontIcon name={"camera"} title="A font icon" />
        </View>
    )
}

export default index