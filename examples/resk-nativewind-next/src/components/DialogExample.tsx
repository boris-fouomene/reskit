"use client";

import { Button, HStack, Dialog, Alert, Preloader, Drawer, useDrawer } from "@resk/nativewind";
import { B, Div, H2, Text } from "@resk/nativewind/html";
import { useState } from "react";


export function DialogExample() {
    const [visible, setVisible] = useState(false);
    return <>
        <HStack>
            <H2>Dialog examples</H2>
        </HStack>
        <Dialog
            visible={visible} onRequestClose={() => setVisible(false)}
            title={"A dialog example"}
            fullScreenOnMobile
            actions={[
                {
                    label: "Close me",
                    variant: { colorScheme: "primary" },
                    closeOnPress: false,
                    onPress: ((event) => {
                        console.log(event, " is pressed")
                    })
                },
                {
                    label: "Close",
                    icon: "close",
                    variant: { colorScheme: "secondary" },
                    showInFullScreen: false,
                    onPress: (() => {
                        setVisible(false)
                    })
                }
            ]}
        >
            <Div className="p-5">
                <H2>Animated Visible example content</H2>
                <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim
                    sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius
                    a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non
                    fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium
                    at, ligula. Suspendisse aliquet, sem ut cursus luctus, ipsum leo elementum sem, vitae aliquet massa
                </Text>
                <Button variant={{ colorScheme: "primary" }} onPress={() => setVisible(false)}>Close</Button>
            </Div>
        </Dialog>
        <Button variant={{ colorScheme: "info", rounded: "rounded", padding: "10px", alignSelf: "start", margin: 6 }} icon="lock" onPress={() => setVisible(true)}>Open Dialog 1</Button>
        <Button variant={{ colorScheme: "secondary" }} onPress={((e) => {
            Dialog.Provider.open({
                title: "DialogProvider",
                children: <Text>DialogProvider</Text>,
                actions: [{
                    label: "Close", onPress: (event, { dialog }) => {
                        console.log("want to close dialog heein");
                    }
                }]
            })
        })}>
            open Dialog Provider
        </Button>
        <Button className="m-5" onPress={(e) => {
            Dialog.Alert.open({
                title: "Close an example",
                message: "Are you sure you want to delete this item?",
                onCancel: () => {
                    console.log("Cancel button pressed");
                }
            })
        }}>Simple Alert</Button>

        <Button className="m-5" onPress={(e) => {
            Dialog.Alert.open({
                title: "Close an example",
                message: "Are you sure you want to delete this item?",
                onCancel: () => {
                    console.log("Cancel button pressed");
                }
            })
        }}>Simple Alert</Button>

        <Button variant={{ outline: "primary" }} onPress={(e) => {
            Preloader.open({
                title: "Loading example",
                content: <Text>Loading example</Text>
            })
        }}>Simple Preloader</Button>

        <Button onPress={() => {
            Drawer.Provider.open({
                children: <Text>Tallll</Text>,
                position: "left"
            })
        }} variant={{ colorScheme: "primary" }}>
            Open Drawer
        </Button>
    </>
}

export function DrawerChildren() {
    const drawerContext = useDrawer();
    if (!drawerContext) return null;
    const { drawer } = drawerContext;
    return <>
        <Div className="p-5">
            <Div className="flex flex-row justify-between items-center">
                <Button variant={{ colorScheme: "primary" }} onPress={() => drawer.close()}>Close</Button>
                <Text>Drawer Children</Text>
            </Div>
        </Div>
    </>
}