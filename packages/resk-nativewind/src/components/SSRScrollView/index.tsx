import React from 'react';
import { Div } from '@html/Div';
import { cn } from '@utils';
import { IClassName } from '@src/types';
import { defaultStr } from '@resk/core/utils';

/**
 * Props interface for the SSRScrollView component optimized for server-side rendering.
 * 
 * This interface defines all available configuration options for creating scrollable containers
 * that work seamlessly with SSR while providing a rich set of customization options.
 * 
 * @public
 * @interface ISSRScrollViewProps
 * @since 1.0.0
 * 
 * @example Basic Props Usage
 * ```tsx
 * const basicProps: ISSRScrollViewProps = {
 *   children: <div>Content here</div>,
 *   className: "h-96 w-full border",
 *   horizontal: false,
 *   scrollEnabled: true
 * };
 * ```
 * 
 * @example Advanced Configuration
 * ```tsx
 * const advancedProps: ISSRScrollViewProps = {
 *   horizontal: true,
 *   snapScrolling: true,
 *   smoothScrolling: true,
 *   bounces: false,
 *   showsHorizontalScrollIndicator: false,
 *   className: "w-full h-64",
 *   containerClassName: "flex flex-row gap-4 p-4",
 *   'aria-label': "Product gallery",
 *   id: "product-gallery"
 * };
 * ```
 */
export interface ISSRScrollViewProps {
    /**
     * Content to be rendered inside the scrollable container.
     * 
     * @remarks
     * This can be any valid React content including JSX elements, components, 
     * text, or arrays of elements. The content will be wrapped in a scrollable container.
     * 
     * @defaultValue undefined
     * 
     * @example
     * ```tsx
     * // Simple text content
     * <SSRScrollView>
     *   <p>Simple text content that can be scrolled</p>
     * </SSRScrollView>
     * 
     * // Complex nested content
     * <SSRScrollView>
     *   <div className="space-y-4">
     *     {items.map(item => (
     *       <Card key={item.id} data={item} />
     *     ))}
     *   </div>
     * </SSRScrollView>
     * ```
     */
    children?: React.ReactNode;

    /**
     * Enables horizontal scrolling instead of the default vertical scrolling.
     * 
     * @remarks
     * When enabled, the scroll container will scroll horizontally and the content
     * container will automatically use flexbox row layout. Vertical scrolling is
     * disabled when this option is true.
     * 
     * @defaultValue false
     * 
     * @example
     * ```tsx
     * // Horizontal image gallery
     * <SSRScrollView horizontal className="w-full h-64">
     *   <div className="flex flex-row gap-4">
     *     <img src="image1.jpg" className="flex-shrink-0 w-64 h-full object-cover" />
     *     <img src="image2.jpg" className="flex-shrink-0 w-64 h-full object-cover" />
     *     <img src="image3.jpg" className="flex-shrink-0 w-64 h-full object-cover" />
     *   </div>
     * </SSRScrollView>
     * ```
     */
    horizontal?: boolean;

    /**
     * Controls whether scrolling is enabled or disabled.
     * 
     * @remarks
     * When set to false, the overflow is hidden and no scrolling is possible.
     * This is useful for temporarily disabling scroll while maintaining layout.
     * 
     * @defaultValue true
     * 
     * @example
     * ```tsx
     * const [canScroll, setCanScroll] = useState(true);
     * 
     * <SSRScrollView 
     *   scrollEnabled={canScroll}
     *   className="h-96"
     * >
     *   <div className="h-[1000px]">
     *     Long content that may or may not be scrollable
     *   </div>
     * </SSRScrollView>
     * ```
     */
    scrollEnabled?: boolean;

    /**
     * Controls visibility of the horizontal scrollbar indicator.
     * 
     * @remarks
     * When set to false, hides the horizontal scrollbar using CSS. This provides
     * a cleaner look while maintaining scroll functionality. Works across all browsers.
     * 
     * @defaultValue true
     * 
     * @example
     * ```tsx
     * // Clean horizontal scroll without visible scrollbar
     * <SSRScrollView 
     *   horizontal
     *   showsHorizontalScrollIndicator={false}
     *   className="w-full h-32"
     * >
     *   <div className="flex flex-row gap-4 px-4">
     *     <div className="flex-shrink-0 w-32 h-full bg-blue-500 rounded" />
     *     <div className="flex-shrink-0 w-32 h-full bg-green-500 rounded" />
     *   </div>
     * </SSRScrollView>
     * ```
     */
    showsHorizontalScrollIndicator?: boolean;

    /**
     * Controls visibility of the vertical scrollbar indicator.
     * 
     * @remarks
     * When set to false, hides the vertical scrollbar using CSS. Useful for
     * creating custom scroll experiences or cleaner mobile interfaces.
     * 
     * @defaultValue true
     * 
     * @example
     * ```tsx
     * // Custom styled vertical scroll without scrollbar
     * <SSRScrollView 
     *   showsVerticalScrollIndicator={false}
     *   className="h-96 border-2 border-gray-200 rounded-lg"
     * >
     *   <div className="p-6 space-y-4">
     *     {articles.map(article => (
     *       <Article key={article.id} {...article} />
     *     ))}
     *   </div>
     * </SSRScrollView>
     * ```
     */
    showsVerticalScrollIndicator?: boolean;

    /**
     * Custom CSS styles applied to the scroll container element.
     * 
     * @remarks
     * These styles are applied directly to the outer scrollable div element.
     * Can be used for custom positioning, sizing, or visual effects that aren't
     * achievable through className alone.
     * 
     * @example
     * ```tsx
     * <SSRScrollView 
     *   style={{
     *     height: '50vh',
     *     maxHeight: '400px',
     *     background: 'linear-gradient(to bottom, #f0f0f0, #ffffff)',
     *     border: '2px solid #e0e0e0',
     *     borderRadius: '12px'
     *   }}
     * >
     *   <div>Custom styled content</div>
     * </SSRScrollView>
     * ```
     */
    style?: React.CSSProperties;

    /**
     * Custom CSS styles applied to the inner content container element.
     * 
     * @remarks
     * These styles affect the direct wrapper of the children content. Useful for
     * content-specific styling like padding, spacing, or layout modifications.
     * 
     * @example
     * ```tsx
     * <SSRScrollView 
     *   contentContainerStyle={{
     *     padding: '24px',
     *     display: 'flex',
     *     flexDirection: 'column',
     *     gap: '16px',
     *     minHeight: '100%'
     *   }}
     * >
     *   <div>Content with custom container styling</div>
     * </SSRScrollView>
     * ```
     */
    contentContainerStyle?: React.CSSProperties;

    /**
     * CSS class names applied to the scroll container using NativeWind utilities.
     * 
     * @remarks
     * Accepts NativeWind/Tailwind CSS classes for styling the scrollable container.
     * This is the primary way to style the component's appearance and behavior.
     * 
     * @example
     * ```tsx
     * // Responsive scroll container with custom styling
     * <SSRScrollView className="
     *   h-64 md:h-96 lg:h-[500px]
     *   w-full max-w-4xl mx-auto
     *   bg-gradient-to-b from-white to-gray-50
     *   border border-gray-200 rounded-xl
     *   shadow-lg hover:shadow-xl transition-shadow
     * ">
     *   <div>Beautifully styled content</div>
     * </SSRScrollView>
     * ```
     */
    className?: IClassName;

    /**
     * CSS class names applied to the inner content container.
     * 
     * @remarks
     * Use this to style the direct wrapper of your content. Particularly useful
     * for layout classes like flexbox, grid, or spacing utilities.
     * 
     * @example
     * ```tsx
     * // Grid layout inside scroll container
     * <SSRScrollView 
     *   className="h-96 border rounded-lg"
     *   containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
     * >
     *   {products.map(product => (
     *     <ProductCard key={product.id} {...product} />
     *   ))}
     * </SSRScrollView>
     * 
     * // Horizontal flex layout
     * <SSRScrollView 
     *   horizontal
     *   containerClassName="flex flex-row items-center space-x-4 px-4 py-2"
     * >
     *   {tags.map(tag => <Tag key={tag} name={tag} />)}
     * </SSRScrollView>
     * ```
     */
    containerClassName?: IClassName;

    /**
     * Enables CSS-based smooth scrolling behavior.
     * 
     * @remarks
     * When enabled, adds the `scroll-smooth` CSS class which provides smooth
     * scrolling animations when programmatically scrolling to elements.
     * 
     * @defaultValue true
     * 
     * @example
     * ```tsx
     * // Smooth scrolling for navigation
     * <SSRScrollView 
     *   smoothScrolling={true}
     *   className="h-screen"
     *   id="main-content"
     * >
     *   <section id="section1" className="h-screen">Section 1</section>
     *   <section id="section2" className="h-screen">Section 2</section>
     *   <section id="section3" className="h-screen">Section 3</section>
     * </SSRScrollView>
     * 
     * // Navigation button (external to component)
     * <button onClick={() => document.getElementById('section2')?.scrollIntoView()}>
     *   Go to Section 2
     * </button>
     * ```
     */
    smoothScrolling?: boolean;

    /**
     * Enables iOS-style bounce effect when scrolling reaches the boundaries.
     * 
     * @remarks
     * Controls the overscroll behavior. When true, allows content to bounce
     * past the scroll boundaries. When false, stops scrolling at boundaries.
     * 
     * @defaultValue true
     * 
     * @example
     * ```tsx
     * // Strict scrolling without bounce (good for data tables)
     * <SSRScrollView 
     *   bounces={false}
     *   className="h-96 border"
     * >
     *   <table className="w-full">
     *     <tbody>
     *       {data.map(row => (
     *         <tr key={row.id}>
     *           <td>{row.name}</td>
     *           <td>{row.value}</td>
     *         </tr>
     *       ))}
     *     </tbody>
     *   </table>
     * </SSRScrollView>
     * ```
     */
    bounces?: boolean;

    /**
     * Controls overscroll behavior at scroll boundaries.
     * 
     * @remarks
     * - `'auto'`: Default browser behavior
     * - `'always'`: Always allow overscroll
     * - `'never'`: Never allow overscroll
     * 
     * @defaultValue 'auto'
     * 
     * @example
     * ```tsx
     * // Prevent overscroll for modal content
     * <SSRScrollView 
     *   overScrollMode="never"
     *   className="h-96 bg-white rounded-lg shadow-xl"
     * >
     *   <div className="p-6">
     *     <h2>Modal Content</h2>
     *     <p>This content won't overscroll</p>
     *   </div>
     * </SSRScrollView>
     * ```
     */
    overScrollMode?: 'auto' | 'always' | 'never';

    /**
     * Enables CSS scroll snap for pagination-like scrolling experience.
     * 
     * @remarks
     * When enabled, scrolling will snap to defined points, creating a
     * carousel or pagination effect. Works with both horizontal and vertical scrolling.
     * 
     * @defaultValue false
     * 
     * @example
     * ```tsx
     * // Horizontal carousel with snap scrolling
     * <SSRScrollView 
     *   horizontal
     *   snapScrolling={true}
     *   className="w-full h-64"
     *   containerClassName="flex flex-row"
     * >
     *   <div className="min-w-full h-full bg-red-500 snap-start flex items-center justify-center">
     *     <h2>Slide 1</h2>
     *   </div>
     *   <div className="min-w-full h-full bg-blue-500 snap-start flex items-center justify-center">
     *     <h2>Slide 2</h2>
     *   </div>
     *   <div className="min-w-full h-full bg-green-500 snap-start flex items-center justify-center">
     *     <h2>Slide 3</h2>
     *   </div>
     * </SSRScrollView>
     * 
     * // Vertical page snap scrolling
     * <SSRScrollView 
     *   snapScrolling={true}
     *   className="h-screen"
     * >
     *   <section className="h-screen snap-start">Page 1</section>
     *   <section className="h-screen snap-start">Page 2</section>
     *   <section className="h-screen snap-start">Page 3</section>
     * </SSRScrollView>
     * ```
     */
    snapScrolling?: boolean;

    /**
     * HTML ID attribute for the scroll container element.
     * 
     * @remarks
     * Useful for programmatic scrolling, CSS targeting, or accessibility references.
     * 
     * @example
     * ```tsx
     * <SSRScrollView 
     *   id="chat-messages"
     *   className="h-96 border rounded-lg"
     * >
     *   {messages.map(message => (
     *     <Message key={message.id} {...message} />
     *   ))}
     * </SSRScrollView>
     * 
     * // Scroll to bottom programmatically
     * <button onClick={() => {
     *   const element = document.getElementById('chat-messages');
     *   element?.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
     * }}>
     *   Scroll to bottom
     * </button>
     * ```
     */
    id?: string;

    /**
     * ARIA label for accessibility and screen reader support.
     * 
     * @remarks
     * Provides a description of the scroll area for assistive technologies.
     * If not provided, a default label based on scroll direction is used.
     * 
     * @defaultValue 'Vertical scroll area' or 'Horizontal scroll area'
     * 
     * @example
     * ```tsx
     * // Accessible product gallery
     * <SSRScrollView 
     *   horizontal
     *   aria-label="Product images gallery, use arrow keys to navigate"
     *   className="w-full h-64"
     * >
     *   {productImages.map((image, index) => (
     *     <img 
     *       key={image.id}
     *       src={image.url} 
     *       alt={`Product image ${index + 1}`}
     *       className="flex-shrink-0 w-64 h-full object-cover"
     *     />
     *   ))}
     * </SSRScrollView>
     * 
     * // Accessible news feed
     * <SSRScrollView 
     *   aria-label="Latest news articles, scroll to read more"
     *   className="h-96"
     * >
     *   {articles.map(article => (
     *     <article key={article.id} className="p-4 border-b">
     *       <h3>{article.title}</h3>
     *       <p>{article.excerpt}</p>
     *     </article>
     *   ))}
     * </SSRScrollView>
     * ```
     */
    'aria-label'?: string;

    /**
     * Additional HTML attributes that will be passed through to the scroll container.
     * 
     * @remarks
     * This index signature allows passing any additional HTML div attributes
     * like event handlers, data attributes, or other standard HTML properties.
     * 
     * @example
     * ```tsx
     * <SSRScrollView 
     *   className="h-96"
     *   onMouseEnter={() => console.log('Mouse entered scroll area')}
     *   onMouseLeave={() => console.log('Mouse left scroll area')}
     *   data-testid="scroll-container"
     *   role="region"
     *   tabIndex={0}
     * >
     *   <div>Content with additional attributes</div>
     * </SSRScrollView>
     * ```
     */
    [key: string]: any;
}

/**
 * Server-Side Rendering optimized ScrollView component for modern web applications.
 * 
 * @remarks
 * The SSRScrollView component is a high-performance, SSR-compatible scrolling container
 * that renders pure HTML/CSS without any client-side JavaScript dependencies. It provides
 * a native scrolling experience using CSS-only techniques while maintaining full compatibility
 * with server-side rendering frameworks like Next.js, Nuxt.js, and others.
 * 
 * This component is designed to replace heavy JavaScript-based scrolling solutions
 * with lightweight, accessible, and performant CSS-based scrolling that works
 * immediately upon page load without hydration delays.
 * 
 * @public
 * @component
 * @since 1.0.0
 * @author Resk Framework Team
 * 
 * @param props - Configuration object of type {@link ISSRScrollViewProps}
 * @returns A JSX element representing the scrollable container with optimized SSR support
 * 
 * @example Basic Vertical Scrolling
 * ```tsx
 * import { SSRScrollView } from '@resk/nativewind/components';
 * 
 * function NewsPage() {
 *   return (
 *     <SSRScrollView className="h-screen bg-gray-50">
 *       <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
 *         <h1 className="text-3xl font-bold">Latest News</h1>
 *         {articles.map(article => (
 *           <article key={article.id} className="bg-white p-6 rounded-lg shadow">
 *             <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
 *             <p className="text-gray-600 mb-4">{article.excerpt}</p>
 *             <time className="text-sm text-gray-500">{article.publishedAt}</time>
 *           </article>
 *         ))}
 *       </div>
 *     </SSRScrollView>
 *   );
 * }
 * ```
 * 
 * @example Horizontal Product Gallery
 * ```tsx
 * import { SSRScrollView } from '@resk/nativewind/components';
 * 
 * function ProductGallery({ products }: { products: Product[] }) {
 *   return (
 *     <div className="py-8">
 *       <h2 className="text-2xl font-bold mb-6 px-4">Featured Products</h2>
 *       <SSRScrollView 
 *         horizontal
 *         showsVerticalScrollIndicator={false}
 *         className="w-full"
 *         containerClassName="flex flex-row gap-6 px-4 pb-4"
 *         aria-label="Featured products gallery"
 *       >
 *         {products.map(product => (
 *           <div key={product.id} className="flex-shrink-0 w-72">
 *             <div className="bg-white rounded-xl shadow-lg overflow-hidden">
 *               <img 
 *                 src={product.image} 
 *                 alt={product.name}
 *                 className="w-full h-48 object-cover"
 *               />
 *               <div className="p-4">
 *                 <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
 *                 <p className="text-gray-600 text-sm mb-3">{product.description}</p>
 *                 <div className="flex justify-between items-center">
 *                   <span className="text-xl font-bold text-blue-600">
 *                     ${product.price}
 *                   </span>
 *                   <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
 *                     Add to Cart
 *                   </button>
 *                 </div>
 *               </div>
 *             </div>
 *           </div>
 *         ))}
 *       </SSRScrollView>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example Full-Screen Snap Scrolling Experience
 * ```tsx
 * import { SSRScrollView } from '@resk/nativewind/components';
 * 
 * function LandingPage() {
 *   const sections = [
 *     { id: 'hero', title: 'Welcome', bg: 'bg-gradient-to-r from-blue-500 to-purple-600' },
 *     { id: 'features', title: 'Features', bg: 'bg-gradient-to-r from-green-500 to-blue-500' },
 *     { id: 'testimonials', title: 'Testimonials', bg: 'bg-gradient-to-r from-purple-500 to-pink-500' },
 *     { id: 'contact', title: 'Contact', bg: 'bg-gradient-to-r from-orange-500 to-red-500' }
 *   ];
 * 
 *   return (
 *     <SSRScrollView 
 *       snapScrolling={true}
 *       smoothScrolling={true}
 *       className="h-screen w-full"
 *       aria-label="Landing page sections"
 *       id="main-scroll-container"
 *     >
 *       {sections.map(section => (
 *         <section 
 *           key={section.id}
 *           id={section.id}
 *           className={`h-screen w-full snap-start ${section.bg} flex items-center justify-center`}
 *         >
 *           <div className="text-center text-white">
 *             <h1 className="text-6xl font-bold mb-4">{section.title}</h1>
 *             <p className="text-xl opacity-90">Scroll to explore more sections</p>
 *           </div>
 *         </section>
 *       ))}
 *     </SSRScrollView>
 *   );
 * }
 * ```
 * 
 * @example Custom Styled Chat Interface
 * ```tsx
 * import { SSRScrollView } from '@resk/nativewind/components';
 * 
 * function ChatWindow({ messages }: { messages: Message[] }) {
 *   return (
 *     <div className="flex flex-col h-96 bg-white border border-gray-200 rounded-lg shadow-lg">
 *       <div className="bg-gray-50 px-4 py-3 border-b">
 *         <h3 className="font-semibold text-gray-800">Customer Support</h3>
 *         <p className="text-sm text-gray-600">Online now</p>
 *       </div>
 *       
 *       <SSRScrollView 
 *         className="flex-1"
 *         containerClassName="p-4 space-y-3"
 *         showsHorizontalScrollIndicator={false}
 *         id="chat-messages"
 *         aria-label="Chat conversation history"
 *         style={{ scrollBehavior: 'smooth' }}
 *       >
 *         {messages.map(message => (
 *           <div 
 *             key={message.id}
 *             className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
 *           >
 *             <div className={`
 *               max-w-xs lg:max-w-md px-4 py-2 rounded-lg
 *               ${message.isUser 
 *                 ? 'bg-blue-600 text-white' 
 *                 : 'bg-gray-100 text-gray-800'
 *               }
 *             `}>
 *               <p className="text-sm">{message.text}</p>
 *               <time className={`text-xs ${
 *                 message.isUser ? 'text-blue-100' : 'text-gray-500'
 *               }`}>
 *                 {new Date(message.timestamp).toLocaleTimeString()}
 *               </time>
 *             </div>
 *           </div>
 *         ))}
 *       </SSRScrollView>
 *       
 *       <div className="border-t p-4">
 *         <div className="flex gap-2">
 *           <input 
 *             type="text" 
 *             placeholder="Type your message..."
 *             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
 *           />
 *           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
 *             Send
 *           </button>
 *         </div>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example Responsive Grid Layout with Scroll
 * ```tsx
 * import { SSRScrollView } from '@resk/nativewind/components';
 * 
 * function PhotoGallery({ photos }: { photos: Photo[] }) {
 *   return (
 *     <div className="max-w-6xl mx-auto py-8">
 *       <h1 className="text-3xl font-bold text-center mb-8">Photo Gallery</h1>
 *       
 *       <SSRScrollView 
 *         className="h-[600px] border border-gray-200 rounded-xl bg-gray-50"
 *         containerClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6"
 *         smoothScrolling={true}
 *         bounces={false}
 *         aria-label="Photo gallery grid"
 *       >
 *         {photos.map(photo => (
 *           <div key={photo.id} className="group cursor-pointer">
 *             <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden transition-transform group-hover:scale-105">
 *               <img 
 *                 src={photo.thumbnail} 
 *                 alt={photo.alt}
 *                 className="w-full h-full object-cover"
 *                 loading="lazy"
 *               />
 *             </div>
 *             <p className="mt-2 text-sm text-gray-600 truncate">{photo.title}</p>
 *           </div>
 *         ))}
 *       </SSRScrollView>
 *     </div>
 *   );
 * }
 * ```
 * 
 * @see {@link ISSRScrollViewProps} for detailed props documentation
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap | CSS Scroll Snap} for snap scrolling details
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior | CSS scroll-behavior} for smooth scrolling info
 */
export const SSRScrollView: React.FC<ISSRScrollViewProps> = ({
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
    testID,
    ...htmlProps
}) => {
    testID = defaultStr(testID, "resk-ssr-scroll-view");
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
            testID={testID}
            className={cn(scrollClasses, "resk-ssr-scrollview")}
            style={containerStyle as any}
            aria-label={ariaLabel || (horizontal ? 'Horizontal scroll area' : 'Vertical scroll area')}
            role="region"
            tabIndex={scrollEnabled ? 0 : -1}
            data-component="SSRScrollView"
            {...htmlProps}
        >
            <Div
                className={cn(contentClasses, "resk-ssr-scrollview-content")}
                style={contentStyle as any}
                testID={`${testID}-content`}
            >
                {children}
            </Div>
        </Div>
    );
};

SSRScrollView.displayName = 'SSRScrollView';

export default SSRScrollView;

// Export the WindowScrollBridge component
export { WindowScrollBridge } from './WindowScrollBridge';
