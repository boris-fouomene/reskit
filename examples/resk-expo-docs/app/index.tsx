import i18n from "@resk/core/i18n";
import { TextInput, withAppBar, Datagrid, Surface, Grid, BottomSheet, withAppMounted, Avatar, Badge, Drawer, Button, Form, Dialog, Icon, Theme, Label, ITheme, HStack } from "@resk/native";
import { View, ScrollView, StyleSheet } from 'react-native';
import { DatagridExample } from "./_datagrid";
import { Auth, InputFormatter, Session } from "@resk/core";

const index = withAppBar(() => {
    return (
        <ScrollView>

            <View style={{ margin: 10 }}>
                <Button mode="contained" onPress={() => console.log("Pressed")}
                    onLongPress={(e) => {
                        console.log(e, " is long pressed")
                    }}
                //rippleColor="red"

                >
                    Ripple Example
                </Button>
                <Label fontVariant={"titleLarge"}>Label Example</Label>
                <SheetExample />

                <HStack style={[Theme.styles.m2]}>
                    <HStack>
                        <Badge colorScheme="primary">Primary</Badge>
                        <Badge colorScheme="secondary">Secondary</Badge>
                        <Badge colorScheme="tertiary">Tertiary</Badge>
                        <Badge colorScheme="error">Error</Badge>
                    </HStack>
                    <DatagridExample
                        count={5}
                    />
                    <View>
                        <Badge colorScheme="success">Success</Badge>
                        <Badge colorScheme="warning">Warning</Badge>
                        <Badge colorScheme="info">Info</Badge>
                    </View>
                </HStack>
                <HStack style={[Theme.styles.m2]}>
                    <Avatar
                        text="AV"
                        size={"large"}
                        colorScheme="success"
                        onPress={(event) => {
                            console.log(event, " is pressed");
                        }}
                    />
                    <Avatar
                        icon="check"
                        size={"medium"}
                        colorScheme="secondary"
                    />
                    <Avatar
                        icon="file-document"
                        size={"large"}
                        colorScheme="tertiary"
                    />
                    <Avatar
                        size="xlarge"
                        source={{ uri: "https://picsum.photos/200" }}
                    />
                    <Avatar
                        size="small"
                        colorScheme="onPrimary"
                        elevation={5}
                        icon={({ color }) => {
                            return <Icon color={color} iconName="check" />
                        }}
                    />
                </HStack>
            </View>
            <HStack>
                <TextInput
                    left={({ textColor }) => {
                        return <>
                            <Icon color={textColor} iconName="camera" />
                            <Icon color={textColor} iconName="check" />
                        </>
                    }}
                    label="Text input Date" type="date"
                    onChange={(options) => {
                        console.log(options.value, " is options date changeddddd")
                    }}
                    right={({ textColor }) => {
                        return <>
                            <Icon color={textColor} iconName="ring" />
                            <Icon color={textColor} iconName="account-circle" />
                        </>
                    }}
                />
                <TextInput label="Text input Time" type="time"
                    onChange={(options) => {
                        console.log(options.value, " is options time changeddddd")
                    }}
                />
                <TextInput label="Text input DateTime" type="datetime"
                    onChange={(options) => {
                        console.log(options.value, " is options datetime changeddddd")
                    }}
                />
                <TextInput label="Text input FR Phone" type="tel"
                    defaultValue={"+33142685300"}
                    onChange={(options) => {
                        console.log(options, " is options fr phone changeddddd")
                    }}
                />
                <TextInput label="Text input Phone CM" type="tel" phoneCountryCode="CM"
                    onChange={(options) => {
                        console.log(options.value, " is options phone changeddddd")
                    }}
                />
                <TextInput left={({ textColor }) => <><Icon color={textColor} iconName="check" /><Icon color={textColor} iconName="youtube" /></>}
                    variant="labelEmbeded" label="Label Embeeded" type="datetime"
                />
                <TextInput label="Number example" type="number" />
            </HStack>

            <Form
                fields={{
                    name: {
                        type: "text",
                        label: "My Name",
                        defaultValue: "myName"
                    },
                    checkbox: {
                        type: "checkbox",
                        label: "My Checkbox",
                        defaultValue: true,
                    },
                    switch: {
                        label: "Example Switch",
                        type: "switch",
                        defaultValue: true
                    },
                    select: {
                        type: "select",
                        label: "Example Select",
                        defaultValue: "1",
                        items: [
                            {
                                label: "Item 1",
                                value: "1"
                            },
                            {
                                label: "Item 2",
                                value: "2"
                            },
                            {
                                label: "Item 3",
                                value: "3"
                            },
                        ]
                    },
                    selectCountry: {
                        type: "selectCountry",
                        label: "Example Select Country",
                        defaultValue: "CM",
                    },
                    tel: {
                        type: "tel",
                        label: "Example Tel",
                        onChange: (options) => {
                            console.log(options.value, " is options tel changeddddd")
                        }
                    },
                }}
            />
            <Button
                children="Open Bottom Sheet"
                onPress={() => {
                    BottomSheet.Provider.open({
                        appBarProps: {
                            title: "Bottom Sheet",
                            actions: [
                                {
                                    label: "Cancel",
                                    onPress: (event, { bottomSheet }) => {
                                        console.log("Cancel", bottomSheet.isOpened)
                                    },
                                },
                            ]
                        },
                        children: <Label>
                            What is Lorem Ipsum?
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                            Where does it come from?
                            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

                            The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.


                        </Label>,
                        items: [
                            {
                                label: "Item 1",
                                onPress: () => {
                                    console.log("Item 1 pressed")
                                },
                            },
                            {
                                label: "Item 2",
                                onPress: () => {
                                    console.log("Item 2 pressed")
                                },
                            },
                        ]
                    });
                }}
            />
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
                    const nTheme = Theme.getDefaultTheme({ dark: dark, colors: (dark ? {} : { background: "#fff", onBackground: "#000" }) } as ITheme);
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
                    return false;
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
            appBarProps: {
                subtitle: "Dialog subtitle",
            },
            children: <View>
                <View>
                    <Label>Dialog Content</Label>
                    <Label onPress={closeModal}>Close Modal</Label>
                    <TextInput label="Text input" type="text" />
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

const SheetExample = () => {
    return null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    bottomSheetContent: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    description: {
        marginBottom: 20,
    },
});


function ModalContentExample() {
    return <Button mode="contained"
        rippleColor="red"
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
}

const LoginExample = withAppMounted(function LoginExample() {
    const formName = "login-form";
    return <Surface testID={"login"} style={[Theme.styles.flex1, Theme.styles.w100]}>
        <Grid testID="login-content-container" style={[Theme.styles.w100]}>
            <Grid.Col testID="login-content" defaultSize={12} desktopSize={4} tabletSize={6}>
                <View testID="login-header" style={[Theme.styles.centered, Theme.styles.w100]}>
                    <Label fontVariant={"headlineLarge"} textBold >{i18n.t("screens.login.signIn")}</Label>
                    <Label style={Theme.styles.m1} color={Theme.colors.text} fontVariant="bodyMedium">{i18n.t("screens.login.signInDescription")}</Label>
                </View>
                <Form
                    name={formName}
                    responsive={false}
                    fields={{
                        email: {
                            type: "email",
                            label: i18n.t("screens.login.email"),
                            placeholder: i18n.t("screens.login.emailPlaceholder"),
                            required: true,
                        },
                        password: {
                            type: "password",
                            label: i18n.t("screens.login.password"),
                            placeholder: i18n.t("screens.login.passwordPlaceholder"),
                            required: true,
                        }
                    }}
                    onSubmit={({ data, form }) => {
                        console.log(data, " is data heeein ", form?.getFields());
                    }}
                />
                <View testID="forgot-password-container" style={[Theme.styles.flexRow, Theme.styles.pb05, Theme.styles.justifyContentEnd, Theme.styles.w100]}>
                    <>
                        <Label colorScheme="primary" underlined textBold>{i18n.t("screens.login.forgotPassword")}</Label>
                    </>
                </View>
                <Button
                    fullWidth
                    centered
                    left={({ textColor }) => <Icon iconName={"login"} size={24} color={textColor} />}
                    formName={formName}
                    mode="contained"
                >{i18n.t("screens.login.signIn")}</Button>
                <View style={Theme.styles.w100}>
                    <View style={[Theme.styles.alignItemsCenter, Theme.styles.p1, Theme.styles.alignSelfCenter]}>
                        <Label textBold>{i18n.t("screens.login.orContinueWith")}</Label>
                        <View style={[Theme.styles.flexRow, Theme.styles.p1, Theme.styles.alignItemsCenter]}>
                            <Icon.Button color={Theme.colors.primary} title="Google" iconName="google" size={30} />
                        </View>
                    </View>
                </View>
            </Grid.Col>
            <Grid.Col defaultSize={0} tabletSize={6} desktopSize={8} testID={"login-content-right"} >
                <Label>Right Content</Label>
            </Grid.Col>
        </Grid>
    </Surface>

});
export default index;// withAuth(index);
