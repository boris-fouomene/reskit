export interface IBreakpoints {
    mobileMaxWidth: number;
    tabletMaxWidth: number;
}

export interface IUseDimensionsOptons {
    /***
     * Breakpoints for different screen sizes.
     * 
     * @default {
     *   mobileMaxWidth: 768,
     *   tabletMaxWidth: 1024,
     * }    
     */
    breakpoints?: IBreakpoints;

    /**
   * Whether to ignore dimension changes when the soft keyboard is visible.
   * When true, window dimensions won't update when keyboard shows/hides.
   * Keyboard state tracking will still work normally.
   * 
   * @default false
   */
    ignoreKeyboard?: boolean;

    /**
     * Minimum width change threshold to trigger dimension updates.
     * Changes smaller than this value will be ignored.
     * Useful for filtering out minor dimension fluctuations.
     * 
     * @default 0
     */
    widthThreshold?: number;

    /**
     * Minimum height change threshold to trigger dimension updates.
     * Changes smaller than this value will be ignored.
     * Useful for filtering out minor dimension fluctuations.
     * 
     * @default 0
     */
    heightThreshold?: number;

    /**
     * Debounce delay in milliseconds for dimension change events.
     * Helps prevent excessive re-renders during rapid dimension changes.
     * Set to 0 to disable debouncing.
     * 
     * @default 0
     */
    debounceTimeout?: number;
}