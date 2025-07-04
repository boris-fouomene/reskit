"use client";

import { Button, HStack, BottomSheet } from "@resk/nativewind";
import { Div, H2 } from "@resk/nativewind/html";
import { useState } from "react";

export function BottomSheetExample() {
    const [visible, setVisible] = useState(false);
    return <>
        <HStack>
            <H2>BottomSheet examples</H2>
        </HStack>
        <BottomSheet variant={{ padding: "100px", colorScheme: "error" }} visible={visible} onRequestClose={() => setVisible(false)}>
            <Div className="w-full">
                <H2>BottomSheet example 1 for content and not children my dear</H2>
            </Div>
        </BottomSheet>
        <Button onPress={() => setVisible(true)}>Open Bototm Sheet</Button>
    </>
}