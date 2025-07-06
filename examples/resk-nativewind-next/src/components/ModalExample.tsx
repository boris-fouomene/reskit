"use client";

import { Button, HStack, Modal } from "@resk/nativewind";
import { Div, H2, Text } from "@resk/nativewind/html";
import { useState } from "react";

export function ModalExample() {
    const [visible, setVisible] = useState(false);
    return <>
        <HStack>
            <H2>Modal examples</H2>
        </HStack>
        <Modal visible={visible} variant={{ colorScheme: "error" }} onRequestClose={() => setVisible(false)}>
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
        </Modal>
        <Button onPress={() => setVisible(true)}>Open modal1</Button>
    </>
}