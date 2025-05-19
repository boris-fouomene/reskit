import { Text, Div, Heading } from '@resk/nativewind/html';
import { ScrollView } from 'react-native';
import { Icon, ActivityIndicator, HelperText, Avatar, Divider, Badge, Button, HStack, Tooltip, Switch, Checkbox } from "@resk/nativewind";
type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <Div className={styles.container}>
        <Text className={styles.title}>{title}</Text>
        <ActivityIndicator size={80} color={"yellow"} />
        <Div asChild testID="example-of-slot" className={"text-red-500"}>
          <Text className={[styles.separator]} testID='example-of-children-slot' children="Example of slot" />
        </Div>
        <HelperText error>An example of helper text</HelperText>
        <Div className="p-5">
          <Heading level={1}>Heading 1</Heading>
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Heading level={4}>Heading 4</Heading>
          <Heading level={5}>Heading 5</Heading>
          <Heading level={6}>Heading 6</Heading>
        </Div>
        <Heading level={2}>Icons examples : </Heading>
        <HStack className="p-5 !gap-x-10">
          <Icon.Button variant={{ color: "secondary" }}
            iconName='camera'
            title="secondary color icon camera"
            size={30}
            onPress={(event) => {
              console.log("pressed icon");
            }}
          />
          <Icon.Button
            title="primary color icon car"
            disabled
            variant={{ color: "primary", size: "5xl" }}
            iconName="fa6-car"
            size={40}
          />
          <Icon.Font title={"A phone icon"} variant={{ color: "primary", size: "5xl" }} name={"phone"} />
          {children}
          <Avatar text='A' variant={{ color: "error", size: "5xl" }} />
        </HStack>
        <Divider />
        <Heading level={1}>Badges</Heading>
        <HStack className="p-5 !gap-x-10">
          <Badge variant={{ color: "primary" }}>Badge 1</Badge>
          <Badge variant={{ color: "secondary", size: "xl" }}>Badge 2 - size xl</Badge>
          <Badge variant={{ color: "success", size: "md", rounded: "full" }}>Badge Succes - size - md</Badge>
        </HStack>
        <Tooltip title="A tooltip">
          <Text> Example of tooltip</Text>
        </Tooltip>
      </Div>
      <Div className="p-5">
        <Heading level={1}>Switch examples</Heading>
        <HStack className="p-5 !gap-x-10">
          <Switch label={"Example 1"} title="Switch example" />
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
        <Heading level={1}>Button examples</Heading>
        <HStack className="p-5 !gap-x-10">
          <Button label="Button example1" variant={{ color: "primary" }} />
          <Button label="Button example2" variant={{ color: "secondary" }} />
          <Button label="Button example3 - disabled" disabled />
          <Button label="Button example4 - loading" isLoading />
        </HStack>
      </Div>
    </ScrollView>
  );
};
const styles = {
  container: `items-center flex-1 justify-center `,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-green-500`,
};
