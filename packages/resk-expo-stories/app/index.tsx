import { FontIcon, Switch, Checkbox, TouchableRipple, Icon, Theme, Label, Divider, HelperText } from "@resk/expo";

import { View, Text } from 'react-native'
import React from 'react'

const index = () => {
    return (
        <View style={[Theme.styles.p5]}>
            <Text>index</Text>
            <Icon
                name="foundation-alert"
                color={"red"}
                size={40}
                title="Display title for me"
                onPress={(ev) => {
                    console.log(ev, " is pressed")
                }}
            />
            <Checkbox
                label="My label"
                defaultValue={0}
            />
            <Switch
                label="A Switch"
            />
            <Divider
                breakpointStyle={{
                    desktop: Theme.styles.hidden,
                }}
            />
            <TouchableRipple
                onPress={() => console.log("Pressed")}
            >
                <Label>A ripple button</Label>
            </TouchableRipple>
            <HelperText
                visible
                error
                children={"A children helper"}
            />
        </View>
    )
}

export default index