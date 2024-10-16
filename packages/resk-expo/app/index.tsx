import { View, Text } from 'react-native'
import React from 'react';
import TextInputComponent from '@components/TextInput';

const index = () => {
    return (
        <View>
            <Text>index</Text>
            <TextInputComponent label='My Label' />
        </View>
    )
}

export default index