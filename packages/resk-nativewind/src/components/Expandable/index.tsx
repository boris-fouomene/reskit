import { Div } from "@html/Div";
import { defaultStr } from "@resk/core/utils";
import { cn } from "@utils/cn";
import { commonVariant } from "@variants/common";
import { expandableVariant } from "@variants/expandable";
import { iconVariant } from "@variants/icon";
import { useExpandable } from "./hooks";
import { ExpandableIcon } from "./Icon";
import { IExpandableProps } from "./types";

export function Expandable({
  expanded: controlledExpanded,
  onExpandChange,
  children,
  className = "",
  headerClassName = "",
  id: customId,
  contentClassName = "",
  label,
  variant,
  expandedIcon = "chevron-up" as never,
  collapsedIcon = "chevron-down" as never,
  iconPosition,
  iconSize,
  iconClassName,
  iconVariant: expandIconVariant,
  testID,
  ...props
}: IExpandableProps) {
  const computedVariant = expandableVariant(variant);
  const { expanded, toggleExpand, isControlled } = useExpandable({
    expanded: controlledExpanded,
    onExpandChange,
  });
  const id = defaultStr(customId);
  const displayIconAtRight = iconPosition !== "left";
  testID = defaultStr(testID, "resk-expandable");
  const icon = (
    <ExpandableIcon
      expanded={expanded}
      toggleExpand={toggleExpand}
      expandedIcon={expandedIcon}
      collapsedIcon={collapsedIcon}
      parentId={id ?? undefined}
      size={iconSize}
      isControlled={isControlled}
      className={cn(
        "resk-expandable-icon",
        computedVariant.icon(),
        iconVariant(expandIconVariant),
        iconClassName
      )}
    />
  );
  // Handle expandable button press
  /* const handlePress = ; */

  return (
    <Div
      {...props}
      testID={testID}
      className={cn(`resk-expandable`, computedVariant.base(), className)}
      id={id}
    >
      <Div
        asHtmlTag="span"
        testID={testID + "-header-container"}
        className={cn(
          `resk-expandable-header-container w-full transition-all duration-200`,
          computedVariant.headerContainer(),
          headerClassName
        )}
      >
        <Div
          asHtmlTag="span"
          testID={testID + "-header"}
          className={cn(
            "flex flex-row justify-start items-center",
            computedVariant.header()
          )}
        >
          {!displayIconAtRight ? icon : null}
          {label}
          {displayIconAtRight ? icon : null}
        </Div>
      </Div>
      <Div
        testID={testID + "-content"}
        className={cn(
          "w-full resk-expandable-content overflow-hidden transition-all duration-500 ease-in-out ",
          computedVariant.content(),
          contentClassName,
          commonVariant({ hidden: !expanded })
        )}
      >
        {children}
      </Div>
    </Div>
  );
}
