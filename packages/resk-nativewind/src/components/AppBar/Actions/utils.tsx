import { IAppBarActionProps, IAppBarActionsProps, IAppBarProps } from "../types";
import { IReactNullableElement } from "@src/types";
import { renderNavItems } from "@components/Nav/utils";
import { cn } from "@utils/cn";
import { AppBarAction } from "../Action";
import ExpandableAppBarAction from "../ExpandableAction";


export function renderActions<Context = unknown>({ context,actionMutator, testID, renderAction, renderExpandableAction, actions: items, viewportWidth, maxVisibleActions, ...props }: IAppBarActionsProps<Context> & {
    actionMutator?: (renderer: IAppBarActionsProps<Context>["renderAction"],_props: IAppBarActionProps<Context>, index: number,isExpandable:boolean) => IReactNullableElement;
}) {
    renderAction = typeof renderAction === 'function' ? renderAction : renderAppBarAction;
    renderExpandableAction = typeof renderExpandableAction === 'function' ? renderExpandableAction : renderExpandableAppBarAction;
    const mutatedActionMutator = typeof actionMutator === 'function' ? actionMutator : (renderer: IAppBarActionsProps<Context>["renderAction"],props: IAppBarActionProps<Context>, index: number,isExpandable:boolean) => (renderer as any)(props, index);
    return renderNavItems<Context>({
        ...props,
        context: Object.assign({}, { isAppBar: true }, context),
        items,
        renderItem: function (props, index) {
            return mutatedActionMutator(renderAction, props, index,false);
        },
        renderExpandableItem: function (props, index) {
            return mutatedActionMutator(renderExpandableAction, props, index,true);
        },
    });
}

function renderAppBarAction<Context = unknown>(props: IAppBarActionProps<Context>, index: number) {
  return <AppBarAction {...props} key={index} />;
}
function renderExpandableAppBarAction<Context = unknown>(props: IAppBarActionProps<Context>, index: number) {
  return <ExpandableAppBarAction
    {...props}
    key={index}
  />;
}
