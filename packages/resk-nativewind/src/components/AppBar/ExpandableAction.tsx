import { Menu } from "@components/Menu";
import { IAppBarActionProps, IAppBarContext } from './types';
import { AppBarAction } from "./Action";


function ExpandableAppBarAction<Context = unknown>({ items, children, ...rest }: IAppBarActionProps<Context>) {
    return <Menu<IAppBarContext<Context>>
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