"use client";

import { Button, HStack, BottomSheet } from "@resk/nativewind";
import { Div, H2, Text } from "@resk/nativewind/html";
import { useState } from "react";
import { ScrollView } from "react-native";

export function BottomSheetExample() {
    const [visible, setVisible] = useState(false);
    return <Div className="w-full">
        <HStack>
            <H2>BottomSheet examples</H2>
        </HStack>
        <BottomSheet variant={{ colorScheme: "error", paddingY: "20px", paddingLeft: '10px', paddingRight: "none" }} appBarProps={{ title: "Bottom Sheet Example" }} visible={visible} onRequestClose={() => setVisible(false)}>
            <Div className="w-full">
                <H2>BottomSheet example 1 for content and not children my dear</H2>
            </Div>
            <ScrollView>
                <Text variant={{ color: "error-foreground" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis viverra, tortor sit amet imperdiet tristique, justo mi egestas felis, non tristique turpis est non nisl. Nam placerat arcu non libero sagittis finibus. Pellentesque sed dui tincidunt, tincidunt turpis sit amet, malesuada ipsum. Quisque commodo, ligula vel ultrices ultrices, massa erat porta dui, sit amet viverra ante ipsum id velit. Fusce vehicula, lectus at auctor facilisis, nulla lacus lobortis quam, eget ullamcorper enim mauris nec mauris. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam nibh quam, viverra sed massa eget, ullamcorper facilisis odio. Nullam a blandit mauris. Quisque lectus nisl, consectetur a laoreet nec, efficitur ut nibh. Pellentesque dictum elit feugiat pulvinar suscipit. Quisque interdum massa eget condimentum convallis. Nunc vehicula nisi in velit tempor, at ultrices dui finibus. Suspendisse et nibh ultricies est dictum rutrum nec eget massa.

                    Suspendisse potenti. In aliquam, nibh in scelerisque fermentum, diam metus interdum tortor, id interdum turpis est at lacus. Mauris vel lacus lacinia, molestie ex id, porttitor est. Proin feugiat eros in mauris facilisis consequat. Praesent commodo felis id sapien faucibus eleifend. Praesent vitae arcu vitae arcu hendrerit feugiat. Aliquam quis placerat nisl. Curabitur ac molestie tortor. Pellentesque euismod nisi at erat auctor, luctus rhoncus lorem vestibulum. Nunc varius ut purus at accumsan. Nulla molestie felis tincidunt tortor maximus accumsan. Ut a blandit magna. Nam quis aliquet tellus, eget hendrerit quam. Duis eu risus diam. Fusce quis urna odio. Vivamus tempor iaculis dictum.

                    Duis non dolor vestibulum, consectetur ligula eu, ultrices mi. Ut blandit porttitor purus, in suscipit diam. Duis lacinia ipsum et purus vehicula facilisis. Donec augue urna, tincidunt id convallis eget, scelerisque a quam. Mauris mattis elit et nulla placerat, sed volutpat leo vulputate. Phasellus dictum volutpat risus, eu dignissim risus. Fusce rhoncus fermentum metus et pretium. Aliquam pretium dui vulputate molestie viverra.

                    Integer eu nibh vehicula, viverra metus ac, suscipit metus. Aenean faucibus vulputate semper. Nam et magna nibh. Pellentesque pharetra tellus nec turpis sollicitudin eleifend. Etiam sed dictum dolor. Sed imperdiet sed ipsum sed porta. Etiam convallis vulputate feugiat. Maecenas finibus, magna a ultricies fermentum, ipsum lorem cursus est, sed tincidunt lorem dui at nunc.

                    Donec placerat tellus in nisi imperdiet, aliquam hendrerit ante pharetra. Curabitur tempor interdum mollis. Nunc ac iaculis ipsum. Nullam sed ullamcorper mauris. Aliquam eu massa orci. Pellentesque quis tincidunt justo, sit amet accumsan diam. Maecenas venenatis, elit aliquam lacinia porta, diam orci commodo lectus, eu suscipit orci tellus quis mauris. Donec quis tellus vel leo ultricies tristique. Suspendisse varius arcu ut libero sollicitudin aliquam. Ut semper lacinia tortor, vel maximus risus rutrum eget. Mauris efficitur pellentesque blandit. Ut consequat quam ac lectus imperdiet congue. Maecenas efficitur a odio non vehicula. Nullam odio sem, volutpat eu turpis ac, consectetur suscipit velit. In scelerisque, urna non ultricies tristique, urna augue sagittis tellus, ut aliquam nisl sapien quis magna. Ut vitae commodo nisl.
                </Text>
            </ScrollView>
        </BottomSheet>
        <Button variant={{ colorScheme: "primary", padding: "10px", rounded: "rounded" }} onPress={() => setVisible(true)}>Open Bototm Sheet</Button>
    </Div>
}