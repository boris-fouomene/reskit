
const codegenNativeComponent = (componentName, options) => {
    // For web, we'll use react-native-web's requireNativeComponent
    const { requireNativeComponent } = require('react-native-web/dist/exports/requireNativeComponent');
    return requireNativeComponent(componentName, options);
};

module.exports = codegenNativeComponent;