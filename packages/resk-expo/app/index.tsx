import { View, Text } from 'react-native'
import TextInputComponent from '@components/TextInput';
import { InputOutline } from '@components/TextInput/Outilne';
import { InputStandard } from '@components/TextInput/StandardInput';
import FontIcon from '@components/Icon/Font';
import { HStack } from '@components/Stack';

const index = () => {
    return (
        <View style={{ padding: 20 }}>
            <Text>index</Text>
            <HStack style={{ columnGap: 10 }}>
                <TextInputComponent left={({ textColor, variant }) => <FontIcon color={textColor} name={"camera"} title="A font icon" />} placeholder='Enter my label' label='Default variant' />
                <TextInputComponent placeholder='Label embeded' variant="labelEmbeded" label='Embeded label' />
                <FontIcon name={"camera"} title="A font icon" />
                <InputOutline
                    placeholder='Input ouline'

                />
                <InputStandard
                    placeholder='My input standard'

                />
            </HStack>
        </View>
    )
}

export default index