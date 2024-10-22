import { View, Text } from 'react-native'
import TextInputComponent from '@components/TextInput';
import FontIcon from '@components/Icon/Font';
import { HStack } from '@components/Stack';
import Label from '@components/Label';
import { Portal } from '@components/Portal';
import Switch from '@components/Switch';

const index = () => {
    return (
        <View style={{ padding: 20 }}>
            <Text>index</Text>
            <HStack style={{ columnGap: 10 }}>
                <TextInputComponent left={({ textColor, variant }) => <FontIcon size={18} color={textColor} name={"camera"} />} placeholder='Enter my label' label='Default variant' />
                <TextInputComponent left={<Label>A left</Label>} right={<>
                    <FontIcon size={20} name="antd-book" />
                    <FontIcon size={12} name="antd-API" />
                </>} placeholder='Label embeded' variant="labelEmbeded" label='Embeded label' />
                <Portal breakpointStyle={{
                    phone: {
                        backgroundColor: "red",
                    },
                    tablet: {
                        backgroundColor: "yellow"
                    },
                    lg: {
                        backgroundColor: "green"
                    }
                }}>
                    <Label>A portal rendered</Label>
                </Portal>
            </HStack>
            <Switch
                label="Test of label"
            />
        </View>
    )
}

export default index