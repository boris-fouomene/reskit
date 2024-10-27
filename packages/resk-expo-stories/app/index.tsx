import { FontIcon, Tab, Switch, Checkbox, Surface, TouchableRipple, Swiper, Icon, Theme, Label, Divider, HelperText } from "@resk/expo";

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
            <Tab>
                <Tab.Item label="Tab 1" icon="account-circle">
                    <Label style={{ height: 300 }}>First tab item</Label>
                </Tab.Item>
                <Tab.Item label="Second tab" icon="material-edit">
                    <Label>Second tab</Label>
                </Tab.Item>
                <Tab.Item label="Third tab" icon="material-edit">
                    <Label>Third tab</Label>
                </Tab.Item>
            </Tab>
            <Surface elevation={10} style={Theme.styles.ph5}>
                <Swiper activeIndex={0} timeout={5} loop={true} contentProps={{ style: { backgroundColor: 'green', flex: 1, minHeight: 200 } }}>
                    <View><Text>Slide 1</Text></View>
                    <View><Text>Slide 2</Text></View>
                    <View><Text>Slide 3</Text></View>
                </Swiper>
            </Surface>
        </View>
    )
}

export default index