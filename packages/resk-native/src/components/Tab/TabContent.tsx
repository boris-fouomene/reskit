import { defaultStr } from "@resk/core";
import { Swiper } from "@components/Swiper";
import platform from '@platform/index';
import { ITabContentProps } from "./types";
import { userTabs } from "./context";

/**
 * TabContent component that renders the content of a tab using a Swiper component.
 * 
 * The `TabContent` component is designed to display the content associated with
 * the currently active tab. It utilizes the `Swiper` component to provide a
 * swipeable interface, allowing users to navigate between different content sections
 * smoothly. The component is optimized for both touch and non-touch devices.
 * 
 * @param {ITabContentProps} props - The properties for the TabContent component.
 * @param {React.ReactNode} props.children - The content to display within the tab.
 * @param {number} [props.activeIndex=0] - The index of the currently active tab. 
 * Defaults to 0 if not provided.
 * @param {string} [props.testID] - An optional test ID for testing purposes.
 * @param {object} [props.rest] - Additional properties to pass to the Swiper component.
 * 
 * @returns {JSX.Element} Returns a JSX element representing the TabContent component,
 * which wraps the Swiper component.
 * 
 * @example
 * // Example usage of the TabContent component
 * const MyTabContent = () => (
 *   <TabContent activeIndex={1} testID="myTabContentTestID">
 *     <View>Content for Tab 1</View>
 *     <View>Content for Tab 2</View>
 *     <View>Content for Tab 3</View>
 *   </TabContent>
 * );
 */
const TabContent = ({
  children,
  testID,
  ...rest
}: ITabContentProps) => {
  const { activeIndex, setActiveIndex } = userTabs();
  return (
    <Swiper
      gesturesEnabled={() => !platform.isTouchDevice()}
      autoplay={false}
      {...rest}
      children={children}
      testID={defaultStr(testID, 'resk-tab-content')}
      activeIndex={activeIndex}
      onChange={setActiveIndex}
    />
  );
};

TabContent.displayName = 'TabContent';


export default TabContent;