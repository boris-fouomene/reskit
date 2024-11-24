import { useModal } from "@components/Modal";
import { useDimensions } from "@dimensions/index";

export const useCanRender = (canRender: (() => boolean) | boolean) => {
    const modalContext = useModal();
    const rendabled = modalContext && modalContext?.isModal && !!(typeof canRender == "function" ? canRender() : canRender);
    useDimensions(!!rendabled);
    return {
        context: modalContext,
        canRender: rendabled
    }
}