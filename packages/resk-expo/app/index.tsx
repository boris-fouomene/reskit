import { View, Text } from 'react-native'
import TextInputComponent from '@components/TextInput';
import FontIcon from '@components/Icon/Font';
import { HStack } from '@components/Stack';
import Label from '@components/Label';

const index = () => {
    return (
        <View style={{ padding: 20 }}>
            <Text>index</Text>
            <HStack style={{ columnGap: 10 }}>
                <TextInputComponent left={({ textColor, variant }) => <FontIcon color={textColor} name={"camera"} />} placeholder='Enter my label' label='Default variant' />
                <TextInputComponent left={<Label>A left</Label>} right={<>
                    <FontIcon name="asssss" />
                </>} placeholder='Label embeded' variant="labelEmbeded" label='Embeded label' />
                <FontIcon name="menu" />
            </HStack>
        </View>
    )
}

export default index