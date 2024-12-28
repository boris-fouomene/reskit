import { Tab, TextInput, Switch, Checkbox, Button, Form, Dialog, Expandable, TouchableRipple, Icon, Theme, Label, Divider, HelperText, Menu, ITheme, IThemeColorsTokens, getDefaultTheme, withAuth } from "@resk/expo";
import { View, ScrollView } from 'react-native'
import { useEffect } from 'react'
import { withAppBar } from "@resk/expo/build/hooks";
import { IField } from "@resk/core";


const index = withAppBar(() => {
    useEffect(() => {
        //Preloader.open();
    }, [])
    return (
        <ScrollView>
            <Form
                name="my-form"
                onSubmit={({ data }) => {
                    console.log(data, " is datata")
                }}
                fields={{
                    name: {
                        label: "Name",
                        type: "text",
                        required: true,
                    },
                    switch: {
                        label: "Switch",
                        type: "switch",
                        required: true,
                        checkedLabel: "Checked",
                        uncheckedLabel: "Unchecked",
                        checkedValue: true,
                        uncheckedValue: false,
                    } as IField<"switch">,
                    "email": {
                        label: "Email",
                        type: "email",
                        required: true,
                        minLength: 3,
                        maxLength: 10,
                    },
                    "password": {
                        label: "Password",
                        type: "password",
                        required: true,
                        minLength: 3,
                        maxLength: 10,
                    },
                }}
            >
                <Button formName="my-form">Submit</Button>
            </Form>
            <View style={[Theme.styles.p5]}>
                <Menu
                    anchor={<Label>Open Menu</Label>}
                    children={<MenuExample />}
                    items={[
                        {
                            label: "Item 1",
                            onPress: () => {
                                console.log("Item 1")
                            },
                        },
                        {
                            label: "Item 2",
                            onPress: () => {
                                console.log("Item 2")
                            },
                            items: [
                                {
                                    label: "Sub item 2",
                                    items: [
                                        {
                                            label: "Sub item 21"
                                        },
                                        {
                                            label: "Sub item 22"
                                        },
                                        {
                                            label: "Sub item 23"
                                        },
                                    ]
                                },
                                {
                                    label: "Sub item 22"
                                },
                                {
                                    label: "Sub item 23"
                                },
                            ]
                        },
                        {
                            label: "Item 3",
                            onPress: () => {
                                console.log("Item 3")
                            },
                        },
                        {
                            label: "Item 4",
                            onPress: () => {
                                console.log("Item 4")
                            },
                        },
                    ]}
                />

                <Label>index</Label>
                <Icon
                    iconName="foundation-alert"
                    source={{
                        uri: "https://picsum.photos/200",
                    }}
                    size={40}
                    title="An image with icon source"
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
                    disabled
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
}, ({ i18n, updateTheme, theme }) => {
    return ({
        title: i18n.t("appBar.title"),
        subtitle: i18n.t("appBar.subtitle"),
        actions: [
            {
                label: "Language [" + i18n.getLocale() + "]",
                onPress: () => {
                    i18n.setLocale(i18n.getLocale() == "en" ? "fr" : "en");
                }
            },
            {
                label: theme.dark ? "Light Mode" : "Dark Mode",
                icon: theme.dark ? "lightbulb-outline" : "lightbulb",
                onPress: () => {
                    const dark = theme.dark ? false : true;
                    const nTheme = getDefaultTheme({ dark: dark, colors: (dark ? {} : { background: "#fff", onBackground: "#000" }) } as ITheme);
                    updateTheme(nTheme);
                }
            },
            {
                label: "actin 1",
                icon: "material-edit",
                onPress: () => {
                    console.log("Back")
                },
            },
            {
                label: "An expandable",
                icon: "check",
                onPress: () => {
                    console.log("action2")
                },
                items: [
                    {
                        label: "Sub action2",
                        icon: "check",
                    },
                    {
                        label: "Sub action22",
                        icon: "radio-off",
                    },
                    {
                        label: "Sub action23",
                        icon: "radioactive"
                    },

                ]
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
        ],
    });
});
const ModalExample = () => {
    const openModal = () => {
        Dialog.Provider.open({
            title: "Dialog Title",
            fullScreenAppBarProps: {
                subtitle: "Dialog subtitle",
            },
            children: <View>
                <View>
                    <Label>Dialog Content</Label>
                    <Label onPress={closeModal}>Close Modal</Label>
                </View>
            </View>,
            actions: [
                {
                    label: "Cancel",
                    colorScheme: "error",
                    onPress: () => {
                        console.log("Cancel")
                    },
                },
                {
                    label: "Ok",
                    colorScheme: "primary",
                    closeOnPress: false,
                    onPress: () => {
                        console.log("Ok")
                    },
                },
            ]
        })
    };
    const closeModal = () => {
        Dialog.Provider.close();
    };
    return (
        <View>
            <Button label="Open Modal" onPress={openModal} />
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
                <Label>Menu Content 5</Label>
                <Label>Menu content 6</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content</Label>
                <Label>Menu content</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content</Label>
                <Label>Menu content 2</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content</Label>
                <Label>Menu content 2</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content 5</Label>
                <Label>Menu content 6</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content</Label>
                <Label>Menu content</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content</Label>
                <Label>Menu content 2</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content</Label>
                <Label>Menu content 2</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content 5</Label>
                <Label>Menu content 6</Label>
                <Label>Menu content 3</Label>
                <Label>Menu content 4</Label>
                <Label>Menu Content</Label>
                <Label>Menu content</Label>
            </View>
        </View>
    );
}

export default index;// withAuth(index);
