export const classes: IVariantsClasses = {
  disabled: "pointer-events-none opacity-70 web:cursor-not-allowed",
  readOnly: "pointer-events-none opacity-80 web:cursor-not-allowed",
  hidden: "hidden opacity-0",
  active2hoverState: "hover:opacity-80 active:opacity-90",
  cursorPointed: "cursor-pointer",
  positionFixed: "absolute web:fixed",
  absoluteFill: " absolute web:fixed flex-1 w-full h-full left-0 right-0 top-0 bottom-0",
  cursorDefault: "cursor-default",
  backdrop: "bg-backdrop dark:bg-dark-backdrop",
  absoluteFillHidden: "opacity-0 z-0 pointer-events-none",
};
export interface IVariantsClasses {
  disabled: string;
  readOnly: string;
  hidden: string;
  active2hoverState: string;
  cursorPointed: string;
  positionFixed: string;
  absoluteFill: string;
  absoluteFillHidden: string;
  cursorDefault: string;
  backdrop: string;
}
