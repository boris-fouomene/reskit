import { View, Text } from 'react-native'
import React from 'react';
import TextInputComponent from '@components/TextInput';
import FontIcon from '@components/Icon/Font';
import { currencies } from '@resk/core';

const index = () => {
    return (
        <View>
            <Text>index</Text>
            <TextInputComponent label='My Label' />
            <FontIcon name={"camera"} title="A font icon" />
        </View>
    )
}

export default index