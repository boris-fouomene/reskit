export const useDetailsState = (open?: boolean): {
    isOpen: boolean;
    toggleOpen?: () => void;
} => {
    return { isOpen: !!open };
}