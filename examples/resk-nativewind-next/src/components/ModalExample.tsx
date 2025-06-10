"use client";

import { Button, HStack, Modal } from "@resk/nativewind";
import { Div, H2 } from "@resk/nativewind/html";
import { useEffect, useState } from "react";

export function ModalExample() {
    const [visible, setVisible] = useState(false);
    return <>
        <HStack>
            <H2>Modal examples</H2>
        </HStack>
        <Modal variant={{ padding: "100px", responsive: true, background: "surface" }} visible={visible} onDismiss={() => setVisible(false)}>
            <Div className="w-full">
                <H2>Modal example 1 for contentdddddddddddaaaaaaaa</H2>
            </Div>
        </Modal>
        <Button onPress={() => setVisible(true)}>Open modal1</Button>
    </>
}