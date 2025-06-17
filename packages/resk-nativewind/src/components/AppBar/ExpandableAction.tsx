import { Menu } from "@components/Menu";
import { IAppBarActionProps } from './types';
import { AppBarAction } from "./Action";


function ExpandableAppBarAction<AppBarActionContext = unknown>({ items, children, ...rest }: IAppBarActionProps<AppBarActionContext>) {
    return <Menu<AppBarActionContext>
        anchor={({ menu }) => {
            return (
                <AppBarAction testID='resk-expandable-appbar-action-anchor'
                    {...rest}
                    onPress={(event, context) => {
                        menu?.open?.();
                        if (typeof rest.onPress == "function") {
                            rest.onPress(event, context);
                        }
                    }}
                />
            )
        }}
        items={items}
    />
};

export default ExpandableAppBarAction