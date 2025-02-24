import { Tab, TextInput, withAppBar, Calendar, Drawer, Button, Dropdown, Form, Dialog, Expandable, Icon, Theme, Label, HelperText, Menu, ITheme, getDefaultTheme, Preloader, HStack } from "@resk/native";
import { View, ScrollView } from 'react-native'
import { IField, InputFormatter } from "@resk/core";
import { useEffect } from "react";
import { CountriesManager } from "@resk/core";

const index = withAppBar(() => {
    useEffect(() => {
        return () => { }
        Preloader.open({
            title: "Loading...",
            children: "Please wait...",
            actions: [{
                label: "Cancel",
                colorScheme: "error",
                onPress: () => {
                    Preloader.close();
                },
            }]
        })
    }, [])
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
                            cancelButtonBefore: true,
                            message: `What is Lorem Ipsum?
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

Where does it come from?
Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.

                            `,
                            onOk: () => {
                                Dialog.Alert.open({ title: "Etes vous sure de confirmer", message: "Voulez vous" });
                                return false;
                            }
                        })
                    }}
                >
                    Open an Alert
                </Button>
            </View>

            <HStack>
                <TextInput label="Text input Date" type="date"
                    onChange={(options) => {
                        console.log(options, " is options date changeddddd")
                    }}
                />
                <TextInput label="Text input Time" type="time"
                    onChange={(options) => {
                        console.log(options, " is options time changeddddd")
                    }}
                />
                <TextInput label="Text input DateTime" type="datetime"
                    onChange={(options) => {
                        console.log(options, " is options datetime changeddddd")
                    }}
                />
                <TextInput label="Text input Phone CM" type="tel" phoneCountryCode="CM"
                    onChange={(options) => {
                        console.log(options, " is options phone changeddddd")
                    }}
                />
            </HStack>
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
                    selectCountry: {
                        type: "selectCountry",
                        label: "Select Country",
                        multiple: true,
                        required: true,
                    } as IField<"selectCountry">,
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

                <Calendar.DayView
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
            animationType: "slide",
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
