import { Text, Div } from '@resk/nativewind/html';
import { Icon, ActivityIndicator, variants, Surface } from "@resk/nativewind";

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
      <Div className={[styles.separator]} />
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
  container: `items-center flex-1 justify-center hover:bg-red-500 `,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-green-500`,
};
