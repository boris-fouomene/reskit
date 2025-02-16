import { Tab, TextInput, withAppBar, Calendar, Drawer, Button, Dropdown, Form, Dialog, Expandable, Icon, Theme, Label, HelperText, Menu, ITheme, getDefaultTheme } from "@resk/expo";
import { View, ScrollView } from 'react-native'
import { IField } from "@resk/core";

const index = withAppBar(() => {
    return (
        <ScrollView>
            <View style={{ margin: 10 }}>
                <Button mode="contained" rippleLocation="center"
                    left={({ textColor, context }) => {
                        return <Icon color={textColor} iconName="account-circle" />
                    }}
                    onPress={(event, { dialogContext }) => {
                        Dialog.Alert.open({
                            title: "Alert",
                            message: "Yes i'm alerting you",
                            onOk: () => {
                                Dialog.Alert.open({ title: "Etes vous sure de confirmer", message: "Voulez vous" });
                                return false;
                            }
                        })
                    }}
                >
                    Hello Button
                </Button>
            </View>

            <TextInput label="Text input"
            />
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
                        multiline: true,
                        left: <Icon iconName="account-circle" />,
                        right: <Icon iconName="chevron-right" />,
                    } as IField<"text">,
                    switch: {
                        label: "Switch",
                        type: "switch",
                        required: true,
                        checkedLabel: "Checked",
                        uncheckedLabel: "Unchecked",
                        checkedValue: true,
                        uncheckedValue: false,
                        onChange: (options) => {
                            console.log("switch", options);
                        },
                    } as IField<"switch">,
                    checkbox: {
                        type: "checkbox",
                        label: "Checkbox",
                        checkedLabel: "Checked",
                        uncheckedLabel: "Unchecked",
                    } as IField<"checkbox">,
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
                    select: {
                        label: "Select",
                        type: "select",
                        required: true,
                        multiple: true,
                        onChange: (options) => {
                            console.log(options.context, " is options", options)
                        },
                        items: [
                            { label: "Item 1", value: "1" },
                            { label: "Item 2", value: "2" },
                            { label: "Item 3", value: "3" },
                            { label: "Item 4", value: "4" },
                            { label: "Item 5", value: "5" },
                            { label: "Item 6", value: "6" },
                            { label: "Item 7", value: "7" },
                            { label: "Item 8", value: "8" },
                            { label: "Item 9", value: "9" },
                            { label: "Item 10", value: "10" },
                        ]
                    } as IField<"select">,
                }}
            >
                <Button formName="my-form">Submit</Button>
            </Form>
            <Dropdown
                label="My Dropdown"
                getItemValue={({ item }) => item.value}
                items={Array.from({ length: 100000 }, (_, i) => ({ label: `Item and ${i + 1}`, value: `${i + 1}` }))}
            />
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
                <TextInput label="My text input"
                    variant="labelEmbeded"

                />
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

                <Calendar.Day
                    defaultValue={"2022-01-01"}
                />
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
                label: "Open Drawer provider",
                onPress: () => {
                    Drawer.Provider.open({
                        appBarProps: {
                            title: "Drawer Title",
                            subtitle: "Drawer subtitle",
                            actions: [
                                {
                                    label: "Settings",
                                    onPress: () => {
                                        console.log("Settings pressed")
                                    },
                                },
                                {
                                    label: "Profile",
                                    onPress: () => {
                                        console.log("Profile pressed")
                                    },
                                },
                            ],
                        }
                    });
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
