# 🏗️ HTML Elements - @resk/nativewind

> **SSR-optimized HTML elements with React Native compatibility**

## 📖 Overview

The @resk/nativewind HTML elements module provides a comprehensive set of web-standard HTML components that work seamlessly across React Native and web platforms. These components are specially optimized for Server-Side Rendering (SSR) while maintaining full compatibility with React Native styling and behavior.

---

## 🎯 Core Features

### **🌐 Universal HTML Elements**
- Complete set of semantic HTML elements
- React Native compatibility layer
- Automatic platform detection and adaptation
- Type-safe props with full TypeScript support

### **🚀 SSR Optimization**
- Server-side rendering support
- Hydration-safe components
- SEO-friendly markup generation
- Progressive enhancement capabilities

### **🎨 Styling Integration**
- Tailwind CSS class support
- NativeWind styling compatibility
- Responsive design utilities
- Cross-platform style normalization

### **♿ Accessibility First**
- ARIA attributes support
- Screen reader optimization
- Keyboard navigation
- Focus management

---

## 🏗️ Core Elements

### **Div - Container Element**

The fundamental building block for layouts and containers.

```tsx
import { Div } from '@resk/nativewind/html';

// Basic container
<Div className="p-4 bg-white rounded-lg">
  <Text>Container content</Text>
</Div>

// Flexbox layout
<Div className="flex flex-row items-center justify-between p-4">
  <Text>Left content</Text>
  <Text>Right content</Text>
</Div>

// Grid layout
<Div className="grid grid-cols-2 gap-4 p-4">
  <Div className="bg-gray-100 p-2">Item 1</Div>
  <Div className="bg-gray-100 p-2">Item 2</Div>
  <Div className="bg-gray-100 p-2">Item 3</Div>
  <Div className="bg-gray-100 p-2">Item 4</Div>
</Div>

// Interactive container
<Div 
  className="p-4 bg-blue-100 hover:bg-blue-200 cursor-pointer rounded-lg"
  onClick={() => console.log('Container clicked')}
  role="button"
  tabIndex={0}
>
  <Text>Clickable container</Text>
</Div>

// Custom HTML tag
<Div asHtmlTag="section" className="py-8">
  <Text>This renders as a section element</Text>
</Div>
```

**Props:**
```tsx
interface IHtmlDivProps {
  children?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  asHtmlTag?: string;              // Custom HTML tag name
  onClick?: (event: any) => void;
  onPress?: () => void;            // React Native compatibility
  role?: string;                   // ARIA role
  tabIndex?: number;               // Tab navigation
  testID?: string;                 // Testing identifier
  // Standard HTML div attributes
  id?: string;
  title?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  // ... other HTML attributes
}
```

### **Text - Typography Element**

Enhanced text component with typography variants and cross-platform optimizations.

```tsx
import { Text } from '@resk/nativewind/html';

// Basic text
<Text>Simple text content</Text>

// Typography variants
<Text variant="heading1" className="mb-4">Main Heading</Text>
<Text variant="heading2" className="mb-3">Sub Heading</Text>
<Text variant="body" className="mb-2">Body text content</Text>
<Text variant="caption" className="text-gray-500">Caption text</Text>

// Text truncation
<Text numberOfLines={1} className="w-48">
  This is a very long text that will be truncated with ellipsis
</Text>

<Text numberOfLines={3} className="w-64">
  This is a longer text that will be truncated after three lines
  with proper line clamping and ellipsis at the end.
</Text>

// Selectable text
<Text selectable className="bg-gray-50 p-2 rounded">
  This text can be selected and copied
</Text>

// Non-selectable text (default on native)
<Text selectable={false}>
  This text cannot be selected
</Text>

// Font scaling control
<Text allowFontScaling={false}>
  This text won't scale with system font size
</Text>

// Custom ellipsis mode
<Text 
  numberOfLines={1} 
  ellipsizeMode="middle"
  className="w-32"
>
  very-long-filename.extension
</Text>

// Custom HTML tag
<Text asHtmlTag="span" className="font-semibold">
  This renders as a span element
</Text>
```

**Props:**
```tsx
interface IHtmlTextProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption';
  numberOfLines?: number;          // Line clamping
  selectable?: boolean;            // Text selection
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  allowFontScaling?: boolean;      // System font scaling
  maxFontSizeMultiplier?: number;  // Max font scale factor
  minimumFontScale?: number;       // Min font scale factor
  asHtmlTag?: string;              // Custom HTML tag
  // Standard HTML text attributes
  title?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
}
```

---

## 📝 Text Elements

### **Paragraph and Inline Elements**

```tsx
import { P, B, I, S, Q, BlockQuote, BR } from '@resk/nativewind/html/text-elements';

// Paragraph with automatic margins
<P>This is a paragraph with automatic top and bottom margins.</P>
<P>This is another paragraph that will have proper spacing.</P>

// Bold text
<P>
  This paragraph contains <B>bold text</B> for emphasis.
</P>

// Italic text
<P>
  This paragraph contains <I>italic text</I> for style.
</P>

// Strikethrough text
<P>
  This paragraph contains <S>strikethrough text</S> for deletions.
</P>

// Inline quotation
<P>
  As Einstein said, <Q cite="https://example.com">
    Imagination is more important than knowledge
  </Q>.
</P>

// Block quotation
<BlockQuote cite="https://example.com" className="border-l-4 border-gray-300 pl-4 italic">
  The only way to do great work is to love what you do.
</BlockQuote>

// Line breaks
<P>
  This is the first line.
  <BR />
  This is the second line after a break.
  <BR />
  This is the third line.
</P>

// Combined formatting
<P>
  This paragraph demonstrates <B>bold</B>, <I>italic</I>, 
  and <S>strikethrough</S> text all together.
</P>
```

### **Heading Elements**

```tsx
import { Heading } from '@resk/nativewind/html';

// Semantic heading levels
<Heading level={1} className="text-4xl font-bold mb-6">
  Main Page Title
</Heading>

<Heading level={2} className="text-3xl font-semibold mb-4">
  Section Heading
</Heading>

<Heading level={3} className="text-2xl font-medium mb-3">
  Subsection Heading
</Heading>

<Heading level={4} className="text-xl font-medium mb-2">
  Minor Heading
</Heading>

// With custom styling
<Heading 
  level={1} 
  className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
>
  Gradient Heading
</Heading>

// Responsive heading
<Heading 
  level={2} 
  className="text-xl md:text-2xl lg:text-3xl font-bold"
>
  Responsive Heading
</Heading>
```

**Props:**
```tsx
interface IHtmlHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;    // Heading level (h1-h6)
  children: React.ReactNode;
  className?: string;
  id?: string;                      // For anchor links
  'aria-label'?: string;
}
```

---

## 🖼️ Media Elements

### **Image Element**

```tsx
import { Image } from '@resk/nativewind/html';

// Basic image
<Image 
  src="https://example.com/image.jpg" 
  alt="Description of image"
  className="w-full h-48 object-cover rounded-lg"
/>

// Responsive image
<Image 
  src="https://example.com/image.jpg"
  alt="Responsive image"
  className="w-full h-auto max-w-md mx-auto"
/>

// Image with fallback
<Image 
  src="https://example.com/image.jpg"
  defaultSource={{ uri: 'https://example.com/fallback.jpg' }}
  alt="Image with fallback"
  className="w-32 h-32 rounded-full"
/>

// Loading states
<Image 
  src="https://example.com/large-image.jpg"
  alt="Large image"
  className="w-full h-64 bg-gray-200"
  loading="lazy"
/>

// Image gallery
<Div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {images.map((image, index) => (
    <Image 
      key={index}
      src={image.url}
      alt={image.alt}
      className="aspect-square object-cover rounded-lg hover:scale-105 transition-transform"
    />
  ))}
</Div>
```

**Props:**
```tsx
interface IHtmlImageProps {
  src: string;                      // Image source URL
  alt: string;                      // Alternative text (required)
  className?: string;
  defaultSource?: { uri: string };  // Fallback image
  loading?: 'lazy' | 'eager';      // Loading strategy
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;             // Load event handler
  onError?: () => void;            // Error event handler
  // Standard HTML img attributes
  title?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  decoding?: 'sync' | 'async' | 'auto';
}
```

---

## 📊 Table Elements

### **Table Structure**

```tsx
import { Table } from '@resk/nativewind/html';

// Basic table
<Table className="w-full border-collapse">
  <Table.Head className="bg-gray-50">
    <Table.Row>
      <Table.HeaderCell className="px-4 py-2 text-left font-semibold">
        Name
      </Table.HeaderCell>
      <Table.HeaderCell className="px-4 py-2 text-left font-semibold">
        Email
      </Table.HeaderCell>
      <Table.HeaderCell className="px-4 py-2 text-left font-semibold">
        Role
      </Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row className="border-b hover:bg-gray-50">
      <Table.Cell className="px-4 py-2">John Doe</Table.Cell>
      <Table.Cell className="px-4 py-2">john@example.com</Table.Cell>
      <Table.Cell className="px-4 py-2">Admin</Table.Cell>
    </Table.Row>
    <Table.Row className="border-b hover:bg-gray-50">
      <Table.Cell className="px-4 py-2">Jane Smith</Table.Cell>
      <Table.Cell className="px-4 py-2">jane@example.com</Table.Cell>
      <Table.Cell className="px-4 py-2">User</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>

// Responsive table with scroll
<Div className="overflow-x-auto">
  <Table className="min-w-full divide-y divide-gray-200">
    <Table.Head className="bg-gray-50">
      <Table.Row>
        <Table.HeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Product
        </Table.HeaderCell>
        <Table.HeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Category
        </Table.HeaderCell>
        <Table.HeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Price
        </Table.HeaderCell>
        <Table.HeaderCell className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Stock
        </Table.HeaderCell>
      </Table.Row>
    </Table.Head>
    <Table.Body className="bg-white divide-y divide-gray-200">
      {products.map((product) => (
        <Table.Row key={product.id} className="hover:bg-gray-50">
          <Table.Cell className="px-6 py-4 whitespace-nowrap">
            <Div className="flex items-center">
              <Image 
                src={product.image} 
                alt={product.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <Text className="font-medium">{product.name}</Text>
            </Div>
          </Table.Cell>
          <Table.Cell className="px-6 py-4 whitespace-nowrap text-gray-500">
            {product.category}
          </Table.Cell>
          <Table.Cell className="px-6 py-4 whitespace-nowrap font-semibold">
            ${product.price}
          </Table.Cell>
          <Table.Cell className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 py-1 text-xs rounded-full ${
              product.stock > 10 ? 'bg-green-100 text-green-800' : 
              product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
</Div>
```

### **Table Components**

```tsx
// Table components
<Table>           {/* table element */}
<Table.Head>      {/* thead element */}
<Table.Body>      {/* tbody element */}
<Table.Foot>      {/* tfoot element */}
<Table.Row>       {/* tr element */}
<Table.HeaderCell> {/* th element */}
<Table.Cell>      {/* td element */}
<Table.Caption>   {/* caption element */}
```

---

## 🔧 Interactive Elements

### **Details and Summary**

```tsx
import { Details } from '@resk/nativewind/html';

// Collapsible content
<Details className="border rounded-lg p-4 mb-4">
  <Details.Summary className="font-semibold cursor-pointer hover:text-blue-600">
    Click to expand FAQ
  </Details.Summary>
  <Div className="mt-2 text-gray-600">
    <P>This is the answer to the frequently asked question.</P>
    <P>You can include multiple paragraphs and complex content here.</P>
  </Div>
</Details>

// Multiple collapsible sections
<Div className="space-y-2">
  <Details className="border rounded-lg">
    <Details.Summary className="p-4 font-medium bg-gray-50 hover:bg-gray-100">
      Section 1: Getting Started
    </Details.Summary>
    <Div className="p-4">
      <P>Content for getting started section...</P>
    </Div>
  </Details>
  
  <Details className="border rounded-lg">
    <Details.Summary className="p-4 font-medium bg-gray-50 hover:bg-gray-100">
      Section 2: Advanced Features
    </Details.Summary>
    <Div className="p-4">
      <P>Content for advanced features section...</P>
    </Div>
  </Details>
</Div>

// Programmatically controlled
const [isOpen, setIsOpen] = useState(false);

<Details open={isOpen} className="border rounded-lg p-4">
  <Details.Summary 
    onClick={() => setIsOpen(!isOpen)}
    className="font-semibold cursor-pointer"
  >
    Controlled Details
  </Details.Summary>
  <Div className="mt-2">
    <P>This details element is controlled by state.</P>
  </Div>
</Details>
```

---

## 🎨 Advanced Usage Patterns

### **Custom Component Creation**

```tsx
// Create custom semantic components
const Card = ({ children, ...props }) => (
  <Div 
    className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
    {...props}
  >
    {children}
  </Div>
);

const CardHeader = ({ children, ...props }) => (
  <Div className="mb-4 pb-4 border-b border-gray-200" {...props}>
    {children}
  </Div>
);

const CardContent = ({ children, ...props }) => (
  <Div className="text-gray-600" {...props}>
    {children}
  </Div>
);

// Usage
<Card>
  <CardHeader>
    <Heading level={3}>Card Title</Heading>
  </CardHeader>
  <CardContent>
    <P>This is the card content with proper semantic structure.</P>
  </CardContent>
</Card>
```

### **SEO-Optimized Content**

```tsx
const SEOOptimizedPage = () => (
  <Div>
    {/* Semantic HTML structure for SEO */}
    <Div asHtmlTag="header" className="py-8">
      <Heading level={1} className="text-4xl font-bold">
        Page Title for SEO
      </Heading>
    </Div>
    
    <Div asHtmlTag="nav" className="mb-8">
      <Div asHtmlTag="ul" className="flex space-x-4">
        <Div asHtmlTag="li">
          <Text asHtmlTag="a" href="/home">Home</Text>
        </Div>
        <Div asHtmlTag="li">
          <Text asHtmlTag="a" href="/about">About</Text>
        </Div>
      </Div>
    </Div>
    
    <Div asHtmlTag="main">
      <Div asHtmlTag="article" className="prose max-w-none">
        <Heading level={2}>Article Title</Heading>
        <P>Article content with proper semantic markup...</P>
      </Div>
    </Div>
    
    <Div asHtmlTag="footer" className="mt-12 py-8 border-t">
      <P className="text-gray-500">© 2024 Company Name</P>
    </Div>
  </Div>
);
```

### **Accessibility-First Components**

```tsx
const AccessibleForm = () => (
  <Div asHtmlTag="form" role="form" aria-labelledby="form-title">
    <Heading level={2} id="form-title">
      Contact Form
    </Heading>
    
    <Div className="space-y-4">
      <Div>
        <Text asHtmlTag="label" htmlFor="name" className="block font-medium mb-1">
          Full Name
        </Text>
        <input 
          id="name"
          type="text"
          className="w-full p-2 border rounded-lg"
          aria-required="true"
          aria-describedby="name-help"
        />
        <Text id="name-help" className="text-sm text-gray-500 mt-1">
          Enter your full name as it appears on your ID
        </Text>
      </Div>
      
      <Div>
        <Text asHtmlTag="label" htmlFor="email" className="block font-medium mb-1">
          Email Address
        </Text>
        <input 
          id="email"
          type="email"
          className="w-full p-2 border rounded-lg"
          aria-required="true"
          aria-invalid="false"
        />
      </Div>
    </Div>
  </Div>
);
```

---

The HTML elements module in @resk/nativewind provides a comprehensive foundation for building semantic, accessible, and SEO-optimized applications that work seamlessly across React Native and web platforms. The components maintain web standards while providing React Native compatibility and enhanced functionality.

Next, I'll continue with the theme system documentation. Would you like me to proceed?
