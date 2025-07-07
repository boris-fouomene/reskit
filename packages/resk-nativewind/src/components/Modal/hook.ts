import { cn } from "@utils/cn";
import { IModalProps } from "./types";
import modalVariants from "@variants/modal";
export const usePrepareModal = ({ backdropClassName, contentClassName, variant }: IModalProps) => {
  const computedVariant = modalVariants(variant);
  return {
    contentClassName: cn("resk-modal-content flex-col flex-1 w-full h-full items-start justify-start self-start", computedVariant.content(), contentClassName),
    backdropClassName: cn("resk-modal-backdrop", backdropClassName, computedVariant.backdrop()),
  };
};
