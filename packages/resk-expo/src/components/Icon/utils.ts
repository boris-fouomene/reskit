
import { IFontMaterialCommunityIconsName } from "@components/Icon";
import Platform from "@platform";
import { isObj, isValidImageSrc } from "@resk/core";

/**
 * Determines if the provided source is a valid image source.
 *
 * This function checks if the `source` parameter conforms to the expected formats
 * for image sources used in React Native. It returns `true` if the source is a valid
 * image source and `false` otherwise.
 *
 * The function checks for the following conditions:
 *
 * 1. **Object with URI**: The source is an object that contains a `uri` property, which
 *    is a string. This is commonly used for remote images.
 *    - Example: `{ uri: 'https://example.com/image.png' }`
 *
 * 2. **Module Reference**: The source is a number, which indicates that it is a reference
 *    to a local image asset (e.g., `require('./path/to/image.png')`).
 *
 * 3. **Web Platform**: If the platform is web, the source can also be a string that:
 *    - Starts with `'data:image'`, indicating a base64 encoded image.
 *    - Matches common image file extensions (e.g., `.bmp`, `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`).
 *
 * @param {any} source - The source to check, which can be of any type.
 * @returns {boolean} - Returns `true` if the source is a valid image source, `false` otherwise.
 *
 * @example
 * // Valid image sources
 * const validUriSource = { uri: 'https://example.com/image.png' };
 * const validModuleSource = require('./path/to/image.png');
 * const validDataUriSource = 'data:image/png;base64,...';
 * const validWebSource = 'https://example.com/image.jpg';
 *
 * console.log(isImageSource(validUriSource)); // true
 * console.log(isImageSource(validModuleSource)); // true
 * console.log(isImageSource(validDataUriSource)); // true
 * console.log(isImageSource(validWebSource)); // true
 *
 * // Invalid image source
 * const invalidSource = 'notAnImage';
 * console.log(isImageSource(invalidSource)); // false
 */
export const isImageSource = (source: any) =>
  // source is an object with uri
  (source && isObj(source) && source !== null && Object.prototype.hasOwnProperty.call(source, 'uri') && typeof source.uri === 'string') ||
  // source is a module, e.g. - require('image')
  typeof source === 'number' || Platform.isWeb() && isValidImageSrc(source);
