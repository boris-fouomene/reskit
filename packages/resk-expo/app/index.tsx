import { View, Text } from 'react-native'
import TextInputComponent from '@components/TextInput';
import FontIcon from '@components/Icon/Font';
import { HStack } from '@components/Stack';

const index = () => {
    return (
        <View style={{ padding: 20 }}>
            <Text>index</Text>
            <HStack style={{ columnGap: 10 }}>
                <TextInputComponent placeholder='Enter my label' label='Default variant' />
                <TextInputComponent placeholder='Variant flat' variant='flat' label='My Flat' />
                <TextInputComponent placeholder='Label embeded' variant="labelEmbeded" label='Embeded label' />
                <FontIcon name={"camera"} title="A font icon" />
            </HStack>
        </View>
    )
}

export default index