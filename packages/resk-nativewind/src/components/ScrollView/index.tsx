import React from 'react';
import { Div } from '@html/Div';
import { cn } from '@resk/nativewind/utils';
import type { IClassName } from '@resk/nativewind/types';

/**
 * ScrollView component props optimized for SSR
 * Provides a simple, clean API focused on essential scrolling functionality
 */
export interface IScrollViewProps {
    /** Content to be scrolled */
    children?: React.ReactNode;

    /** Whether horizontal scrolling is enabled */
    horizontal?: boolean;

    /** Whether scrolling is enabled */
    scrollEnabled?: boolean;

    /** Whether to show horizontal scroll indicator */
    showsHorizontalScrollIndicator?: boolean;

    /** Whether to show vertical scroll indicator */
    showsVerticalScrollIndicator?: boolean;

    /** Style for the scroll container */
    style?: React.CSSProperties;

    /** Style for the content container */
    contentContainerStyle?: React.CSSProperties;

    /** CSS class name for the scroll container */
    className?: IClassName;

    /** CSS class name for the content container */
    containerClassName?: IClassName;

    /** Whether to enable smooth scrolling */
    smoothScrolling?: boolean;

    /** Whether to bounce at the end of content (iOS style) */
    bounces?: boolean;

    /** Whether to allow overscroll */
    overScrollMode?: 'auto' | 'always' | 'never';

    /** Enable snap scrolling for pagination */
    snapScrolling?: boolean;

    /** ID for the scroll container */
    id?: string;

    /** ARIA label for accessibility */
    'aria-label'?: string;

    /** Additional HTML attributes */
    [key: string]: any;
}

/**
 * SSR-optimized ScrollView component
 * 
 * This component renders pure HTML/CSS with no client-side JavaScript dependencies,
 * making it perfect for server-side rendering. It provides smooth scrolling using
 * CSS-only techniques and works across all devices and browsers.
 * 
 * @example
 * ```tsx
 * // Basic vertical scrolling
 * <ScrollView className="h-96 border rounded-lg">
 *   <Div className="h-[1000px] p-6 bg-gradient-to-b from-blue-50 to-blue-100">
 *     <h2>Long scrollable content</h2>
 *     <p>This content will scroll vertically...</p>
 *   </Div>
 * </ScrollView>
 * 
 * // Horizontal scrolling gallery
 * <ScrollView 
 *   horizontal 
 *   className="w-full border rounded-lg" 
 *   containerClassName="flex flex-row gap-4 p-4"
 *   showsVerticalScrollIndicator={false}
 * >
 *   <Div className="min-w-72 h-48 bg-red-500 rounded-lg flex-shrink-0" />
 *   <Div className="min-w-72 h-48 bg-green-500 rounded-lg flex-shrink-0" />
 *   <Div className="min-w-72 h-48 bg-blue-500 rounded-lg flex-shrink-0" />
 * </ScrollView>
 * 
 * // Smooth scrolling with custom styling
 * <ScrollView 
 *   smoothScrolling={true}
 *   bounces={false}
 *   className="h-64 bg-gray-50 rounded-xl shadow-inner"
 *   containerClassName="p-6 space-y-4"
 * >
 *   {items.map(item => <ItemComponent key={item.id} {...item} />)}
 * </ScrollView>
 * ```
 * 
 * @param props - ScrollView component props
 * @returns JSX element representing the scrollable container
 */
export const ScrollView: React.FC<IScrollViewProps> = ({
    children,
    horizontal = false,
    scrollEnabled = true,
    showsHorizontalScrollIndicator = true,
    showsVerticalScrollIndicator = true,
    style,
    contentContainerStyle,
    className,
    containerClassName,
    smoothScrolling = true,
    bounces = true,
    overScrollMode = 'auto',
    snapScrolling = false,
    id,
    'aria-label': ariaLabel,
    ...htmlProps
}) => {
    // Generate CSS classes for scroll behavior
    const scrollClasses = cn(
        // Base scroll styles
        'relative',

        // Scroll direction
        horizontal
            ? 'overflow-x-auto overflow-y-hidden'
            : 'overflow-y-auto overflow-x-hidden',

        // Scroll enabled/disabled
        !scrollEnabled && 'overflow-hidden',

        // Scroll indicators (scrollbars)
        !showsHorizontalScrollIndicator && 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent',
        !showsVerticalScrollIndicator && 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent',
        (!showsHorizontalScrollIndicator && !showsVerticalScrollIndicator) && 'scrollbar-hide',

        // Smooth scrolling
        smoothScrolling && 'scroll-smooth',

        // Bounce effect and overscroll behavior
        bounces && 'overscroll-contain',
        !bounces && 'overscroll-none',
        overScrollMode === 'never' && 'overscroll-none',
        overScrollMode === 'always' && 'overscroll-auto',

        // Snap scrolling
        snapScrolling && (horizontal ? 'snap-x snap-mandatory' : 'snap-y snap-mandatory'),

        className
    );

    const contentClasses = cn(
        // Flex direction for horizontal scrolling
        horizontal && 'flex flex-row',
        !horizontal && 'block',

        // Snap children if snap scrolling is enabled
        snapScrolling && 'snap-start',

        containerClassName
    );

    const containerStyle = {
        // Enable momentum scrolling on iOS
        WebkitOverflowScrolling: 'touch' as const,

        // Custom scrollbar styling
        scrollbarWidth: (!showsHorizontalScrollIndicator && !showsVerticalScrollIndicator) ? 'none' as const : 'thin' as const,

        // Snap type for CSS scroll snap
        ...(snapScrolling && {
            scrollSnapType: horizontal ? 'x mandatory' as const : 'y mandatory' as const,
        }),

        // Merge with custom styles
        ...(style || {}),
    };

    const contentStyle = {
        // Ensure content takes minimum required width for horizontal scrolling
        ...(horizontal && {
            minWidth: 'max-content' as const,
        }),

        // Merge with custom content styles
        ...(contentContainerStyle || {}),
    };

    return (
        <Div
            id={id}
            className={scrollClasses}
            style={containerStyle as any}
            aria-label={ariaLabel || (horizontal ? 'Horizontal scroll area' : 'Vertical scroll area')}
            role="region"
            tabIndex={scrollEnabled ? 0 : -1}
            {...htmlProps}
        >
            <Div
                className={contentClasses}
                style={contentStyle as any}
            >
                {children}
            </Div>
        </Div>
    );
};

ScrollView.displayName = 'ScrollView';

export default ScrollView;
