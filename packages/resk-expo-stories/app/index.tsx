import { FontIcon, Tab, Switch, Checkbox, Modal, Portal, Expandable, Appbar, TouchableRipple, IconButton, Swiper, Icon, Theme, Label, Divider, HelperText, Menu, useMenu } from "@resk/expo";
import { View, Text, TouchableOpacity, Pressable, ScrollView, Button } from 'react-native'
import React, { useRef, useState } from 'react'


const index = () => {
    return (
        <ScrollView>
            <Appbar backgroundColor="#6200ee">
                <Appbar.BackAction
                    onPress={() => console.log('Back')}
                    color="#ffffff"
                />
                <Appbar.Content
                    title="My App is very a long appp heeein marno maaaeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                    subtitle="Screen Title aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa long scrreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
                    color="#ffffff"
                />
                <>
                    <Appbar.Action
                        icon={<Icon name="menu" />}
                        onPress={() => console.log('Action')}
                        color="red"
                    />
                    <Appbar.Action
                        icon={<Icon name="material-edit" />}
                        onPress={() => console.log('Action')}
                        color="white"
                    />
                </>
            </Appbar>
            <View style={[Theme.styles.p5]}>
                <Menu
                    anchor={<Text>Open Menu</Text>}
                    children={<MenuExample />}
                />

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
                <Tab tabItemsProps={{ colorScheme: "secondary" }}>
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
                <IconButton
                    name="home"
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
                    <Text>Modal Content</Text>
                    <Text onPress={closeModal}>Close Modal</Text>
                </View>
            </Modal>
        </View>
    )
}
const MenuExample = () => {
    return (
        <View>
            <View style={{ padding: 16 }}>
                <Text>Menu Content</Text>
                <Text>Menu content 2</Text>
                <Text>Menu content 3</Text>
                <Text>Menu content 4</Text>
                <Text>Menu Content</Text>
                <Text>Menu content 2</Text>
                <Text>Menu content 3</Text>
                <Text>Menu content 4</Text>
                <Text>Menu Content</Text>
                <Text>Menu content 2</Text>
                <Text>Menu content 3</Text>
                <Text>Menu content 4</Text>
                <Text>Menu Content</Text>
                <Text>Menu content 2</Text>
                <Text>Menu content 3</Text>
                <Text>Menu content 4</Text>
            </View>
        </View>
    );
}

export default index