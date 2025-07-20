# 📖 **Comprehensive User Guide Creation Prompt**

> **Professional Framework Module Documentation Generator**

Please create a comprehensive, professional user guide for the specified module/component that covers every aspect of its functionality. The guide should be suitable for developers of all skill levels, from beginners getting started to advanced users implementing complex scenarios.

---

## 🎯 **Guide Requirements**

### **📋 Structure & Organization**
- Create a well-organized table of contents with clear navigation
- Use hierarchical headings (H1-H6) for logical content structure
- Include cross-references and internal links between related sections
- Provide a logical flow from basic concepts to advanced implementations

### **🎨 Visual & Formatting Standards**
- Use emojis for visual appeal and easy section identification
- Apply consistent formatting with code blocks, tables, and lists
- Include syntax highlighting for all code examples
- Use callout boxes for important notes, warnings, and tips
- Maintain professional appearance with clean, readable layout

### **📚 Content Depth & Coverage**
Cover ALL of the following aspects for the specified module:

#### **🎯 Core Documentation**
- **Overview**: Purpose, benefits, and use cases
- **Architecture**: Technical design and component relationships
- **Installation**: Setup instructions and dependencies
- **Quick Start**: Minimal working example to get started immediately
- **API Reference**: Complete interface documentation with all props, methods, and types

#### **🔧 Technical Implementation**
- **Basic Usage**: Simple, common use cases with clear examples
- **Advanced Features**: Complex scenarios and power-user functionality
- **Configuration**: All available options, settings, and customization
- **Integration**: How to work with other modules and external libraries
- **State Management**: Data flow, state handling, and lifecycle management

#### **🎨 Customization & Styling**
- **Theming**: Available themes, variants, and styling options
- **Custom Components**: How to extend and create custom implementations
- **Responsive Design**: Mobile, tablet, and desktop considerations
- **Accessibility**: WCAG compliance, screen readers, keyboard navigation

#### **🛡️ Quality & Performance**
- **Validation**: Built-in and custom validation strategies
- **Error Handling**: Error states, debugging, and troubleshooting
- **Performance**: Optimization techniques, best practices, and benchmarks
- **Testing**: Unit tests, integration tests, and testing strategies
- **Security**: Security considerations and best practices

#### **💡 Practical Examples**
- **Real-World Scenarios**: Industry-standard implementations
- **Common Patterns**: Frequently used design patterns and solutions
- **Edge Cases**: Handling unusual or complex requirements
- **Migration**: Upgrading from previous versions or other solutions
- **Troubleshooting**: Common issues and their solutions

### **🎯 Target Audience Considerations**
Address multiple skill levels:

#### **🌱 Beginners**
- Clear explanations of concepts and terminology
- Step-by-step tutorials with expected outcomes
- Prerequisites and background knowledge needed
- Common beginner mistakes and how to avoid them

#### **🔥 Intermediate Users**
- Advanced configuration options and customization
- Integration with complex workflows and systems
- Performance optimization techniques
- Best practices and recommended patterns

#### **🚀 Advanced Users**
- Extension points and customization APIs
- Architecture considerations for large-scale applications
- Advanced patterns and complex implementations
- Contributing guidelines and development setup

### **📖 Content Quality Standards**

#### **🎯 Technical Accuracy**
- Provide working, tested code examples
- Include complete, runnable implementations
- Verify all API references and method signatures
- Test all examples in both development and production scenarios

#### **📝 Writing Quality**
- Use clear, professional language appropriate for technical documentation
- Maintain consistency in terminology and naming conventions
- Provide comprehensive explanations without being verbose
- Include context and rationale for design decisions

#### **💻 Code Examples**
- Provide complete, self-contained examples that work out of the box
- Include both TypeScript and JavaScript versions where applicable
- Show multiple implementation approaches for different use cases
- Include error handling and edge case management
- Comment code thoroughly to explain non-obvious logic

#### **🔗 Interconnectedness**
- Reference related modules, components, and concepts
- Provide links to external resources and documentation
- Include "See Also" sections for related functionality
- Cross-reference between different sections of the guide

---

## 📋 **Required Sections Template**

Please include ALL of these sections in the user guide:

### **1. 🎯 Overview & Introduction**
- Module purpose and core value proposition
- Key features and capabilities overview
- When to use this module vs alternatives
- Brief architecture overview

### **2. 🚀 Quick Start**
- Installation and setup instructions
- Minimal working example
- Expected output and verification steps
- Next steps for further learning

### **3. 📚 Core Concepts**
- Fundamental concepts and terminology
- Component architecture and relationships
- Data flow and lifecycle management
- Core interfaces and types

### **4. 🎨 Basic Usage**
- Common use cases with complete examples
- Step-by-step implementation guides
- Configuration options and defaults
- Basic customization and styling

### **5. 🔧 Advanced Features**
- Complex scenarios and implementations
- Advanced configuration and customization
- Integration with other systems
- Performance optimization techniques

### **6. 🎭 Customization & Theming**
- Available themes and variants
- Custom styling approaches
- Creating custom components
- Responsive design implementation

### **7. 🛡️ Validation & Error Handling**
- Built-in validation features
- Custom validation implementation
- Error states and error handling
- Debugging and troubleshooting

### **8. ⚡ Performance & Optimization**
- Performance best practices
- Bundle size optimization
- Runtime performance tips
- Monitoring and profiling

### **9. ♿ Accessibility & UX**
- Accessibility features and compliance
- Keyboard navigation support
- Screen reader compatibility
- User experience best practices

### **10. 🧪 Testing**
- Unit testing strategies and examples
- Integration testing approaches
- End-to-end testing considerations
- Testing utilities and helpers

### **11. 🔄 Integration & Ecosystem**
- Integration with other framework modules
- Third-party library compatibility
- State management integration
- Server-side rendering considerations

### **12. 📊 Real-World Examples**
- Complete application examples
- Industry-specific implementations
- Common design patterns
- Production-ready code samples

### **13. 🛠️ Migration & Upgrading**
- Migration from other solutions
- Version upgrade guides
- Breaking changes and deprecations
- Backward compatibility considerations

### **14. ❓ FAQ & Troubleshooting**
- Frequently asked questions
- Common issues and solutions
- Debugging tips and techniques
- Community resources and support

### **15. 📖 API Reference**
- Complete interface documentation
- All props, methods, and types
- Parameter descriptions and examples
- Return value documentation

### **16. 🎉 Conclusion & Next Steps**
- Summary of key concepts
- Recommended learning path
- Additional resources
- Community and contribution information

---

## 🎨 **Formatting Guidelines**

### **📝 Writing Style**
- Use active voice and clear, concise language
- Write in present tense for current functionality
- Use second person ("you") to address the reader directly
- Maintain professional but approachable tone

### **💻 Code Examples**
```tsx
// ✅ Good: Complete, working example with context
const ExampleComponent = () => {
  const [state, setState] = useState(initialValue);
  
  return (
    <ModuleComponent
      prop1="value"
      prop2={state}
      onEvent={(data) => {
        // Handle event with proper error handling
        setState(data);
      }}
    >
      <ChildComponent />
    </ModuleComponent>
  );
};

// ❌ Avoid: Incomplete or context-less snippets
<ModuleComponent prop="value" />
```

### **📋 Lists and Tables**
- Use tables for structured data comparison
- Use numbered lists for sequential steps
- Use bullet points for feature lists
- Include visual separators for readability

### **🎯 Callouts and Highlights**
```markdown
> **💡 Pro Tip**: Use this approach for better performance

> **⚠️ Warning**: This feature requires additional configuration

> **📝 Note**: This behavior changed in version 2.0

> **🔥 Best Practice**: Always handle error states in production
```

---

## 🚀 **Execution Instructions**

When creating the user guide:

1. **📋 Start with Analysis**: Analyze the module's source code, interfaces, and existing documentation
2. **🎯 Identify Scope**: Determine all features, APIs, and use cases to cover
3. **📚 Structure Content**: Organize information using the required sections template
4. **💻 Create Examples**: Develop comprehensive, working code examples
5. **🔍 Review Completeness**: Ensure all aspects are covered thoroughly
6. **✨ Polish Presentation**: Apply formatting guidelines and visual enhancements
7. **🔗 Add Cross-References**: Include internal links and related module references
8. **📖 Finalize**: Create table of contents and ensure logical flow

### **📁 File Structure**
- Create the main guide as `README.md` in the module directory
- Include additional example files if needed
- Reference external resources and documentation appropriately
- Ensure all code examples are testable and functional

### **🎯 Quality Checklist**
Before considering the guide complete, verify:
- [ ] All major features and APIs are documented
- [ ] Code examples are complete and functional
- [ ] Multiple skill levels are addressed
- [ ] Accessibility and performance are covered
- [ ] Troubleshooting and FAQ sections are comprehensive
- [ ] Visual formatting is consistent and professional
- [ ] Cross-references and links are accurate
- [ ] Table of contents is complete and navigable

---

## 📞 **Usage Instructions**

To use this prompt, simply specify:

```
Using the comprehensive user guide prompt, please create a complete user guide for [MODULE_NAME] that covers [SPECIFIC_FOCUS_AREAS if any].

Focus on the module located at: [FILE_PATH]
Target audience: [BEGINNER/INTERMEDIATE/ADVANCED/ALL]
Special requirements: [ANY_SPECIFIC_REQUIREMENTS]
```

**Example:**
```
Using the comprehensive user guide prompt, please create a complete user guide for the Button component that covers all interaction patterns and accessibility features.

Focus on the module located at: packages/resk-nativewind/src/components/Button/
Target audience: ALL
Special requirements: Include React Native and Web platform differences
```

---

This prompt ensures comprehensive, professional documentation that serves as both a learning resource and a complete reference guide for any framework module.
