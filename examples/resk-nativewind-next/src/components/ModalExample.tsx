"use client";

import { Button, HStack, Modal } from "@resk/nativewind";
import { H2 } from "@resk/nativewind/html";
import { useEffect, useState } from "react";

export function ModalExample() {
    const [visible, setVisible] = useState(false);
    return <>
        <HStack>
            <H2>Modal examples</H2>
        </HStack>
        <Modal visible={visible} onDismiss={() => setVisible(false)}>
            <H2>Modal example 1 for content</H2>
        </Modal>
        <Button onPress={() => setVisible(true)}>Open modal1</Button>
    </>
}