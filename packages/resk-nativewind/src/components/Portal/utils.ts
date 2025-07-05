import { cn } from "@utils/cn";
import { IPortalProps } from "./types";
import { classes } from "@variants/classes";
import allVariants from "@variants/all";
import Platform from "@platform";
export const getClasses = ({ visible, absoluteFill, withBackdrop }: Partial<IPortalProps>) => {
    const handleBackdrop = withBackdrop || absoluteFill;
    const isNative = Platform.isNative();
    return {
        visibleClassName: cn(visible ? [absoluteFill && classes.absoluteFill, "pointer-events-auto opacity-100 ", isNative && "visible"] : ["pointer-events-none opacity-0", isNative && "invisible"]),
        backdropClassName: cn(allVariants({ backdrop: withBackdrop })),
        handleBackdrop,
    };
}