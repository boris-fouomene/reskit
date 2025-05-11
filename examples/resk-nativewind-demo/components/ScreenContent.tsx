import { Text, Div } from '@resk/nativewind/html';
import { Icon } from "@resk/nativewind";

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  return (
    <Div className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <Div className={styles.separator} />
      <Icon.Font name="material-home" size={20} />
      {children}
    </Div>
  );
};
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-green-500`,
};
