import { Text, Div, Heading, Table, H2, Details } from '@resk/nativewind/html';
import { DialogExample } from './DialogExample';
import { BottomSheetExample } from './BottomSheetExample';
import { AlertExamples } from './AlertExamples';
import { Icon, Menu, AppBar, TextInput, Dropdown, ActivityIndicator, ProgressBar, HelperText, Surface, Avatar, Divider, Badge, Button, HStack, Tooltip, Switch, Checkbox, VStack, CountrySelector, TelInput, Expandable, SSRScrollView } from "@resk/nativewind";
import { buttonVariant } from "@resk/nativewind/variants";
import { FormExamples } from './FormExamples';
import { AppBarExamples } from './AppBarExamples';

type ScreenContentProps = {
  title: string;
  children?: React.ReactNode;
};
export const ScreenContent = ({ title, children }: ScreenContentProps) => {
  return (
    <SSRScrollView>
      <Div className="p-5">
        <AppBarExamples />
        <DialogExample />
        <BottomSheetExample />
        <FormExamples />
        <Heading level={1}>Button examples</Heading>
        <HStack className="p-5 !gap-x-10 gap-y-5">
          <Button label="Button base example1 with left icon" icon={"camera"} variant={{ colorScheme: "primary", padding: "5px" }}
            left={<Icon.Font name="ph" size={30} className={buttonVariant({ colorScheme: "primary" }).icon()} />}
          />
          <Button enableRipple variant={{ colorScheme: "primary", rippleColor: "primary-foreground" }}> Ripple effect </Button>
          <Button label="Button example2" icon="radio" variant={{ colorScheme: "secondary", padding: "10px" }} />
          <Button loading label="Outline Button 1" variant={{ outline: "primary" }} className="p-[2px] rounded-lg" />
          <Button icon={"camera"} label="Outline Button 2" variant={{ outline: "secondary" }} />
          <Button icon="abacus" label="Outline Button 3" variant={{ outline: "info" }} />
          <Button icon="phone" label="Outline Button 4" variant={{ outline: "success", rounded: "sm" }} />
          <Button icon="telescope" label="Outline Button 5" variant={{ outline: "warning" }} />
          <Button label="Outline Button 6" variant={{ outline: "error" }} />
          <Button label="Button example3 - disabled" icon={"alpha-w-circle"} disabled variant={{ colorScheme: "error" }} />
          <Button label="Button example4 - loading" loading variant={{ colorScheme: "success" }} className="px-[10px] py-[5px] rounded-full" />
          <Button label="Neutral" variant={{ colorScheme: "neutral" }} />
          <Button label="Surface" variant={{ outline: "surface" }} />
          <Button label="Info Button" variant={{ outline: "info" }} icon="camera" />
        </HStack>
      </Div>
      <Div className="p-5">
        <H2>Expandable examples</H2>
        <Expandable label="My expandable">
          An expndable example
        </Expandable>
      </Div>
      <AlertExamples />
      <Div className="p-5">
        <H2>TextInput</H2>
        <Div className="p-5">
          <TextInput label="TextInput"
            variant={{ focusedBorderColor: "primary", shadow: "md", focusedShadowColor: "error", focusedBorderWidth: 2 }}
            left={<>
              <Icon fontIconName="phone" size={30} variant={{ color: "primary" }} />
              <Icon fontIconName="camera" size={30} variant={{ color: "secondary" }} />
            </>}
            right={<>
              <Icon fontIconName="material-language" size={30} variant={{ color: "success" }} />
              <Icon fontIconName="clock" size={30} variant={{ color: "warning" }} />
            </>}
          />
        </Div>
        <TelInput label="Tex input Tel example" labelEmbeded />
        <TextInput label="A Success Text Input" variant={{ colorScheme: "success" }} />
        <TextInput variant={{ iconColor: "secondary", labelAlign: "right", labelWeight: "semibold", iconSize: "25px", labelSize: "15px" }} type="password" label="Password" placeholder="Enter your password" error />
        <TextInput type="date" label="Date" placeholder="Enter your date" />
        <TextInput type="time" label="Time" placeholder="Enter your time" />
        <TextInput type="datetime" label="DateTime" placeholder="Enter your datetime" />
        <TextInput type="tel" label="Tel" phoneCountryCode='CM' placeholder="Enter your tel"
          labelEmbeded variant={{ marginY: "20px", rounded: "rounded" }}
          left={<>
            <Icon fontIconName="phone" size={30} variant={{ color: "primary" }} />
            <Icon fontIconName="camera" size={30} variant={{ color: "secondary" }} />
          </>}
          right={<>
            <Icon fontIconName="calendar" size={30} variant={{ color: "success" }} />
            <Icon fontIconName="clock" size={30} variant={{ color: "warning" }} />
          </>}
        />
        <TextInput variant={{ borderStyle: "solid", borderWidth: 1 }} type="number" label="Border" placeholder="Enter your border" />
      </Div>
      <VStack className="p-5">
        <H2>ProgressBar</H2>
        <Div className="m-5 w-full">
          <ProgressBar value={75} max={100} />
        </Div>
        <Div className="m-5 w-full">
          <ProgressBar value={45} max={100} />
        </Div>
        <Div className="m-5 w-full">
          <ProgressBar indeterminate />
        </Div>
      </VStack>
      <Div className="p-5">
        <H2>Dropdown</H2>
        <HStack className="gap-2">
          <Dropdown
            label="Select an option"
            items={Array.from({ length: 50 }).map((_, index) => ({ label: `Option ${index}`, value: index }))}
          />
          <Dropdown
            label="Multi Select"
            allowMultiple
            items={Array.from({ length: 10000 }).map((_, index) => ({ label: `Option ${index}`, value: index }))}
          />
          <CountrySelector
            label="CountrySelector"
          />
        </HStack>
      </Div>
      <HStack className="p-5">
        <H2>Menu Examples</H2>
        <Menu
          anchor={<Text>Open Menu</Text>}
          withScrollView
          items={Array.from({ length: 50 }).map((_, index) => ({ label: `Option ${index + 1}`, value: index }))}
        >
          <VStack>
            <Text>Menu Opened with</Text>
          </VStack>
        </Menu>
        <Menu
          anchor={<Text>Open Bottom Sheet</Text>}
          renderAsBottomSheetOnMobile

        >
          <Text>Bottom Sheet Menu Opened with</Text>
        </Menu>
      </HStack>
      <Div className="p-5">
        <H2>Menu with sub items</H2>
        <Menu
          anchor={<Text>Open Menu with sub items</Text>}
          sameWidth
          items={[
            { label: "Home", icon: "home", items: [{ label: "1" }, { label: "2" }, { label: "3", items: [{ label: " 3.1" }] }] },
            { label: "Settings", icon: "star-settings" },
            { label: "Profile", icon: "star-settings" },
            { label: "Profile", icon: "star-settings" },
          ]}
        />
      </Div>
      <Div className="p-5">
        <H2>A hight menu example</H2>
        <Menu
          anchor={<Text>Open Menu in a higgggggggggggggggggggggggggggggggggggggggggggggggggggggggg</Text>}
          items={[
            { label: "Home", icon: "home" },
            { label: "Settings", icon: "star-settings" },
            { label: "Profile", icon: "star-settings" },
            { label: "Profile", icon: "star-settings" },
          ]}
        />
      </Div>
      <Div className="p-5">
        <Heading level={2}>Colors Variants</Heading>
      </Div>
      <Div className="p-5">
        <Heading level={2}>ActivityIndicator, on surface with padding</Heading>
        <Surface variant={{ padding: "50px", borderStyle: "none", rounded: "rounded" }}>
          <HStack className="p-5 !gap-x-10">
            <ActivityIndicator variant={{ color: "primary" }} />
            <ActivityIndicator size={"small"} variant={{ color: "secondary" }} />
            <ActivityIndicator size={"large"} variant={{ color: "success" }} />
            <ActivityIndicator size={80} variant={{ color: "error" }} />
            <ActivityIndicator size={90} variant={{ color: "warning" }} />
            <ActivityIndicator variant={{ color: "info" }} />
            <ActivityIndicator variant={{ color: "neutral" }} />
            <ActivityIndicator
              variant={{ size: "80px", thickness: "20px" }}
            />
          </HStack>
        </Surface>
      </Div>
      <Div className={styles.container}>
        <Text className={styles.title}>{title}</Text>
        <Div asChild testID="example-of-slot" className={"text-red-500"}>
          <Text className={[styles.separator]} testID='example-of-children-slot'  >Example of slot</Text>
        </Div>
        <HelperText error>An example of helper text</HelperText>
        <HelperText error>Helper text with error</HelperText>
        <Div className="p-5">
          <Heading level={1} variant={{ color: "background" }}>Heading 1 - Background</Heading>
          <Heading level={2} variant={{ color: "neutral" }}>Heading 2 - neutral</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Heading level={4}>Heading 4</Heading>
          <Heading level={5}>Heading 5</Heading>
          <Heading level={6}>Heading 6</Heading>
        </Div>
        <Heading level={2}>Icons Buttons examples : </Heading>
        <HStack className="p-5 !gap-x-10">
          <Icon.Button variant={{ colorScheme: "secondary" }}
            fontIconName='camera'
            title="secondary color icon camera"
            size={30}
          />
          <Icon.Button
            title="primary color icon car"
            disabled
            variant={{ colorScheme: "primary", size: "5xl" }}
            fontIconName="car"
            size={40}
          />
          <Icon.Font title={"A phone icon"} variant={{ color: "secondary", size: "5xl" }} name={"phone"} />
          <Icon.Font id="phone" title="An idd" name="phone" size={50} variant={{ color: "primary" }} />
          <Icon.Font name="abacus" variant={{ color: "success" }} />
          {children}
          <Avatar text='A' variant={{ colorScheme: "error", size: "5xl" }} />
        </HStack>
        <Divider />
        <Heading level={1} className="text-red-500">Badges</Heading>
        <HStack className="p-5 !gap-x-10">
          <Badge variant={{ colorScheme: "primary" }}>Badge 1</Badge>
          <Badge variant={{ colorScheme: "secondary", size: "lg" }}>Badge 2 - size xl</Badge>
          <Badge variant={{ colorScheme: "success", size: "lg", rounded: "full" }}>Badge Succes - size - md</Badge>
        </HStack>
        <Tooltip title="A tooltip">
          <Text> Example of tooltip</Text>
        </Tooltip>
      </Div>
      <Div className="p-5">
        <Heading level={1}>Switch examples</Heading>
        <HStack className="p-5 !gap-x-10">
          <Switch label={"Example 1"} thumbColorClassName="red-500" title="Switch example" />
          <Switch label={"Example 2"} title="Switch example" />
          <Switch label={"Example 3"} title="Switch example" />
        </HStack>
      </Div>
      <Div className="p-5">
        <Heading level={1}>Checkbox examples</Heading>
        <HStack className="p-5 !gap-x-10">
          <Checkbox label={"Example 1"} title="Checkbox example1" checkedVariant={{ color: "primary", size: "4xl" }} />
          <Checkbox label={"Example 2"} title="Checkbox example2" checkedVariant={{ color: "secondary", size: "40px" }} />
          <Checkbox label={"Example 3"} title="Checkbox example3 - disabled" disabled />
        </HStack>
      </Div>
      <Div className="p-5">
        <Heading level={2}>Details</Heading>
        <Details summary={<Text>An example of details</Text>}>
          <Text>Details content</Text>
        </Details>
      </Div>
      <Div className="p-5">
        <H2>Table Example</H2>
        <Table>
          <Table.Caption>An example of Caption</Table.Caption>
          <Table.THead>
            <Table.TR>
              <Table.TH>Header1, Cell 1</Table.TH>
              <Table.TH>Header1, Cell 2</Table.TH>
            </Table.TR>
          </Table.THead>
          <Table.TBody>
            <Table.TR>
              <Table.TD>Row 1, Cell 1</Table.TD>
              <Table.TD>Row 1, Cell 2</Table.TD>
            </Table.TR>
          </Table.TBody>
          <Table.TFoot>
            <Table.TR>
              <Table.TD>Footer 1, Cell 1</Table.TD>
              <Table.TD>Footer 1, Cell 2</Table.TD>
            </Table.TR>
          </Table.TFoot>
        </Table>
      </Div>
    </SSRScrollView>
  );
};

const styles = {
  container: `items-center flex-1 justify-center `,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-green-500`,
};


declare module "@resk/nativewind" {
  interface IVariantsColorsMap {
    accent: string;
    neutral: string;
  }
}
