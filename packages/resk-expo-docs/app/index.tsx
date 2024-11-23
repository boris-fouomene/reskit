import { FontIcon, Tab, Switch, Checkbox, Modal, Portal, Expandable, AppBar, TouchableRipple, Swiper, Icon, Theme, Label, Divider, HelperText, Menu, useMenu } from "@resk/expo";
import { View, TouchableOpacity, Pressable, ScrollView, Button } from 'react-native'
import React, { useRef, useState } from 'react'


const index = () => {
    return (
        <ScrollView>
            <AppBar
                title="My App is very a long appp heeein marno maaaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                subtitle="Screen Title aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa long scrreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                actions={[
                    {
                        label: "actin 1",
                        icon: "material-edit",
                        onPress: () => {
                            console.log("Back")
                        },
                    },
                    {
                        label: "actin 2",
                        icon: "check",
                        onPress: () => {
                            console.log("action2")
                        },
                    },
                    {
                        label: "actin 3",
                        icon: "camera",
                        onPress: () => {
                            console.log("action3")
                        },
                    },
                    {
                        label: "actin 4",
                        icon: "account-circle",
                        onPress: () => {
                            console.log("action4")
                        },
                    },
                ]}
            >
            </AppBar>
            <View style={[Theme.styles.p5]}>
                <Menu
                    anchor={<Label>Open Menu</Label>}
                    children={<MenuExample />}
                />

                <Label>index</Label>
                <Icon
                    iconName="foundation-alert"
                    source={{
                        uri: "https://picsum.photos/200",
                    }}
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
                        <Label>First tab item</Label>
                    </Tab.Item>
                    <Tab.Item label="Second tab" icon="material-edit">
                        <Label>Second tab</Label>
                    </Tab.Item>
                    <Tab.Item label="Third tab" icon="material-edit">
                        <Label>Third tab</Label>
                    </Tab.Item>
                </Tab>
                <Icon.Button
                    iconName="home"
                    title="Home"
                    size={30}
                />
                <Expandable label="My expanded">
                    <View>
                        <Label>An expanded content</Label>
                    </View>
                </Expandable>
                <ModalExample />
            </View>
        </ScrollView>
    )
}
const ModalExample = () => {
    const [visible, setVisible] = useState(false);
    const openModal = () => {
        setVisible(true);
    };
    const closeModal = () => {
        setVisible(false);
    };
    return (
        <View>
            <Button title="Open Modal" onPress={openModal} />
            <Modal visible={visible} onDismiss={closeModal} animationType="fade">
                <View>
                    <Label>Modal Content</Label>
                    <Label onPress={closeModal}>Close Modal</Label>
                </View>
            </Modal>
        </View>
    )
}
const MenuExample = () => {
    return (
        <View>
            <View style={{ padding: 16 }}>
                <Label>Menu Content</Label>
                <Label>Menu content 2</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content</Label>
                <Label>Menu content 2</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content</Label>
                <Label>Menu content 2</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content</Label>
                <Label>Menu content 2</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
            </View>
        </View>
    );
}

export default index