import { FontIcon, Switch, Checkbox, Theme } from "@resk/expo";

import { View, Text } from 'react-native'
import React from 'react'

const index = () => {
    return (
        <View style={[Theme.styles.p5]}>
            <Text>index</Text>
            <FontIcon
                name="material-camera"
                size={12}
            />
            <Checkbox
                label="My label"
                defaultValue={0}
            />
            <Switch
                label="A Switch"
            />
        </View>
    )
}

export default index