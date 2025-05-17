import { Text, Div, Heading } from '@resk/nativewind/html';
import { ScrollView } from 'react-native';
import { Icon, ActivityIndicator, HelperText, Avatar, Divider, Badge, HStack } from "@resk/nativewind";
type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <ScrollView>
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
            size={30}
            onPress={(event) => {
              console.log("pressed icon");
            }}
          />
          <Icon.Button
            disabled
            variant={{ color: "primary", size: "5xl" }}
            iconName="fa6-car"
            size={40}
          />
          <Icon.Font variant={{ color: "primary", size: "5xl" }} name={"phone"} />
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
      </Div>
    </ScrollView>
  );
};
const styles = {
  container: `items-center flex-1 justify-center `,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-green-500`,
};
