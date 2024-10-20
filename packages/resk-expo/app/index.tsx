import { View, Text } from 'react-native'
import TextInputComponent from '@components/TextInput';
import FontIcon from '@components/Icon/Font';
import { HStack } from '@components/Stack';

const index = () => {
    return (
        <View style={{ padding: 20 }}>
            <Text>index</Text>
            <HStack style={{ columnGap: 10 }}>
                <TextInputComponent left={({ textColor, variant }) => <FontIcon color={textColor} name={"camera"} title="A font icon" />} placeholder='Enter my label' label='Default variant' />
                <TextInputComponent left={({ textColor }) => <FontIcon name="menu" color={textColor} />} placeholder='Label embeded' variant="labelEmbeded" label='Embeded label' />
                <FontIcon name={"camera"} title="A font icon" />
            </HStack>
        </View>
    )
}

export default index