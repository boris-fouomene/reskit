import { Text, Div } from '@resk/nativewind/html';
import { Icon, ActivityIndicator, variants, Surface, HelperText } from "@resk/nativewind";

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <Surface className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <ActivityIndicator size={80} color={"yellow"} />
      <Div asChild testID="example-of-slot" className={"text-red-500"}>
        <Text className={[styles.separator]} testID='example-of-children-slot' children="Example of slot" />
      </Div>
      <HelperText error>An example of helper text</HelperText>
      <Icon.Font
        disabled
        onPress={(event) => {
          console.log("pressed icon");
        }}
        className={[variants.icon({ color: "primary" })]} name="material-home"
        size={40}
      />
      {children}
    </Surface>
  );
};
const styles = {
  container: `items-center flex-1 justify-center `,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-green-500`,
};
