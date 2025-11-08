import { i18n } from "../../i18n";
import { IValidatorResult, IValidatorValidateOptions } from "../types";
import { Validator } from "../validator";

// Type definitions for file objects
interface FileLike {
  size?: number;
  type?: string;
  name?: string;
  mimetype?: string; // Alternative property name
  originalname?: string; // Multer property
}

function isFileLike(value: any): value is FileLike {
  return (
    value &&
    typeof value === "object" &&
    (typeof value.size === "number" ||
      typeof value.type === "string" ||
      typeof value.name === "string" ||
      typeof value.mimetype === "string" ||
      typeof value.originalname === "string")
  );
}

function _File({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (isFileLike(value)) {
      resolve(true);
    } else {
      const message = i18n.t("validator.file", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("File", _File);

/**
 * ### File Rule
 *
 * Validates that the field under validation is a file object.
 *
 * @example
 * ```typescript
 * // Class validation
 * class UploadForm {
 *   @IsRequired
 *   @IsFile
 *   document: File;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const IsFile = Validator.createPropertyDecorator(["File"]);

function _FileSize({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<number[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!isFileLike(value)) {
      const message = i18n.t("validator.fileSize", {
        field: translatedPropertyName || fieldName,
        value,
        maxSize: ruleParams?.[0] || 0,
        ...rest,
      });
      return reject(message);
    }

    const maxSize = ruleParams?.[0];
    if (typeof maxSize !== "number" || maxSize < 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "FileSize",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const fileSize = value.size || 0;
    if (fileSize <= maxSize) {
      resolve(true);
    } else {
      const message = i18n.t("validator.fileSize", {
        field: translatedPropertyName || fieldName,
        value,
        maxSize,
        actualSize: fileSize,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("FileSize", _FileSize);

/**
 * ### FileSize Rule
 *
 * Validates that the file size does not exceed the specified maximum size in bytes.
 *
 * #### Parameters
 * - Maximum file size in bytes (number)
 *
 * @example
 * ```typescript
 * // Class validation - 5MB max
 * class UploadForm {
 *   @FileSize(5242880) // 5MB in bytes
 *   document: File;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing maximum file size in bytes
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const FileSize = Validator.createRuleDecorator<number[]>(_FileSize);

function _FileType({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!isFileLike(value)) {
      const message = i18n.t("validator.fileType", {
        field: translatedPropertyName || fieldName,
        value,
        allowedTypes: ruleParams?.join(", ") || "",
        ...rest,
      });
      return reject(message);
    }

    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "FileType",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const fileType = value.type || value.mimetype || "";
    const allowedTypes = ruleParams.map((type) => type.toLowerCase());
    const actualType = fileType.toLowerCase();

    if (
      allowedTypes.some(
        (type) => actualType === type || actualType.startsWith(type + "/")
      )
    ) {
      resolve(true);
    } else {
      const message = i18n.t("validator.fileType", {
        field: translatedPropertyName || fieldName,
        value,
        allowedTypes: ruleParams.join(", "),
        actualType: fileType,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("FileType", _FileType);

/**
 * ### FileType Rule
 *
 * Validates that the file has one of the specified MIME types.
 *
 * #### Parameters
 * - Allowed MIME types (array of strings)
 *
 * @example
 * ```typescript
 * // Class validation
 * class ImageUpload {
 *   @FileType(['image/jpeg', 'image/png', 'image/gif'])
 *   image: File;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array of allowed MIME types
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const FileType = Validator.createRuleDecorator<string[]>(_FileType);

function _Image({
  value,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!isFileLike(value)) {
      const message = i18n.t("validator.image", {
        field: translatedPropertyName || fieldName,
        value,
        ...rest,
      });
      return reject(message);
    }

    const fileType = value.type || value.mimetype || "";
    const imageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
    ];

    if (imageTypes.some((type) => fileType.toLowerCase() === type)) {
      resolve(true);
    } else {
      const message = i18n.t("validator.image", {
        field: translatedPropertyName || fieldName,
        value,
        actualType: fileType,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("Image", _Image);

/**
 * ### Image Rule
 *
 * Validates that the file is an image (checks MIME type).
 *
 * @example
 * ```typescript
 * // Class validation
 * class ProfilePicture {
 *   @Image
 *   avatar: File;
 * }
 * ```
 *
 * @param options - Validation options containing value and context
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const Image = Validator.createPropertyDecorator(["Image"]);

function _FileExtension({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<string[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!isFileLike(value)) {
      const message = i18n.t("validator.fileExtension", {
        field: translatedPropertyName || fieldName,
        value,
        allowedExtensions: ruleParams?.join(", ") || "",
        ...rest,
      });
      return reject(message);
    }

    if (!ruleParams || ruleParams.length === 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "FileExtension",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const fileName = value.name || value.originalname || "";
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    const allowedExtensions = ruleParams.map((ext) =>
      ext.toLowerCase().replace(/^\./, "")
    );

    if (allowedExtensions.includes(extension)) {
      resolve(true);
    } else {
      const message = i18n.t("validator.fileExtension", {
        field: translatedPropertyName || fieldName,
        value,
        allowedExtensions: ruleParams.join(", "),
        actualExtension: extension,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("FileExtension", _FileExtension);

/**
 * ### FileExtension Rule
 *
 * Validates that the file has one of the specified extensions.
 *
 * #### Parameters
 * - Allowed file extensions (array of strings, without dots)
 *
 * @example
 * ```typescript
 * // Class validation
 * class DocumentUpload {
 *   @FileExtension(['pdf', 'doc', 'docx'])
 *   document: File;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array of allowed file extensions
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const FileExtension =
  Validator.createRuleDecorator<string[]>(_FileExtension);

function _MinFileSize({
  value,
  ruleParams,
  fieldName,
  translatedPropertyName,
  ...rest
}: IValidatorValidateOptions<number[]>): IValidatorResult {
  return new Promise((resolve, reject) => {
    if (!isFileLike(value)) {
      const message = i18n.t("validator.minFileSize", {
        field: translatedPropertyName || fieldName,
        value,
        minSize: ruleParams?.[0] || 0,
        ...rest,
      });
      return reject(message);
    }

    const minSize = ruleParams?.[0];
    if (typeof minSize !== "number" || minSize < 0) {
      const message = i18n.t("validator.invalidRuleParams", {
        rule: "MinFileSize",
        field: translatedPropertyName || fieldName,
        ruleParams,
        ...rest,
      });
      return reject(message);
    }

    const fileSize = value.size || 0;
    if (fileSize >= minSize) {
      resolve(true);
    } else {
      const message = i18n.t("validator.minFileSize", {
        field: translatedPropertyName || fieldName,
        value,
        minSize,
        actualSize: fileSize,
        ...rest,
      });
      reject(message);
    }
  });
}
Validator.registerRule("MinFileSize", _MinFileSize);

/**
 * ### MinFileSize Rule
 *
 * Validates that the file size is at least the specified minimum size in bytes.
 *
 * #### Parameters
 * - Minimum file size in bytes (number)
 *
 * @example
 * ```typescript
 * // Class validation - minimum 1KB
 * class UploadForm {
 *   @MinFileSize(1024) // 1KB in bytes
 *   document: File;
 * }
 * ```
 *
 * @param options - Validation options with rule parameters
 * @param options.ruleParams - Array containing minimum file size in bytes
 * @returns Promise resolving to true if valid, rejecting with error message if invalid
 *
 * @since 1.22.0
 * @public
 */
export const MinFileSize =
  Validator.createRuleDecorator<number[]>(_MinFileSize);

declare module "../types" {
  export interface IValidatorRules<
    ParamType extends Array<any> = Array<any>,
    Context = unknown,
  > {
    /**
     * ### File Rule
     *
     * Validates that the field under validation is a file object.
     *
     * @example
     * ```typescript
     * // Valid file objects
     * await Validator.validate({
     *   value: { name: 'test.txt', size: 1024, type: 'text/plain' },
     *   rules: ['File']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: 'not a file',
     *   rules: ['File']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: null,
     *   rules: ['File']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class UploadForm {
     *   @Required
     *   @File
     *   document: File;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    File: IValidatorRuleFunction<ParamType, Context>;

    /**
     * ### FileSize Rule
     *
     * Validates that the file size does not exceed the specified maximum size in bytes.
     *
     * #### Parameters
     * - Maximum file size in bytes (number)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: { name: 'small.txt', size: 1024, type: 'text/plain' },
     *   rules: ['FileSize[2048]']
     * }); // ✓ Valid (file <= 2KB)
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: { name: 'large.txt', size: 5242880, type: 'text/plain' },
     *   rules: ['FileSize[2048]']
     * }); // ✗ Invalid (file > 2KB)
     *
     * await Validator.validate({
     *   value: 'not a file',
     *   rules: ['FileSize[2048]']
     * }); // ✗ Invalid
     *
     * // Class validation - 5MB max
     * class UploadForm {
     *   @FileSize(5242880) // 5MB in bytes
     *   document: File;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing maximum file size in bytes
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    FileSize: IValidatorRuleFunction<number[], Context>;

    /**
     * ### FileType Rule
     *
     * Validates that the file has one of the specified MIME types.
     *
     * #### Parameters
     * - Allowed MIME types (array of strings)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: { name: 'photo.jpg', size: 1024, type: 'image/jpeg' },
     *   rules: ['FileType[image/jpeg,image/png]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: { name: 'doc.pdf', size: 1024, type: 'application/pdf' },
     *   rules: ['FileType[application/pdf]']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: { name: 'script.js', size: 1024, type: 'application/javascript' },
     *   rules: ['FileType[image/jpeg,image/png]']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class ImageUpload {
     *   @FileType(['image/jpeg', 'image/png', 'image/gif'])
     *   image: File;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array of allowed MIME types
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    FileType: IValidatorRuleFunction<string[], Context>;

    /**
     * ### Image Rule
     *
     * Validates that the file is an image (checks MIME type).
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: { name: 'photo.jpg', size: 1024, type: 'image/jpeg' },
     *   rules: ['Image']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: { name: 'pic.png', size: 1024, type: 'image/png' },
     *   rules: ['Image']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: { name: 'doc.pdf', size: 1024, type: 'application/pdf' },
     *   rules: ['Image']
     * }); // ✗ Invalid
     *
     * await Validator.validate({
     *   value: 'not a file',
     *   rules: ['Image']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class ProfilePicture {
     *   @Image
     *   avatar: File;
     * }
     * ```
     *
     * @param options - Validation options containing value and context
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    Image: IValidatorRuleFunction<ParamType, Context>;

    /**
     * ### FileExtension Rule
     *
     * Validates that the file has one of the specified extensions.
     *
     * #### Parameters
     * - Allowed file extensions (array of strings, without dots)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: { name: 'document.pdf', size: 1024, type: 'application/pdf' },
     *   rules: ['FileExtension[pdf,doc,docx]']
     * }); // ✓ Valid
     *
     * await Validator.validate({
     *   value: { name: 'script.js', size: 1024, type: 'application/javascript' },
     *   rules: ['FileExtension[js,ts]']
     * }); // ✓ Valid
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: { name: 'image.exe', size: 1024, type: 'application/octet-stream' },
     *   rules: ['FileExtension[pdf,doc,docx]']
     * }); // ✗ Invalid
     *
     * // Class validation
     * class DocumentUpload {
     *   @FileExtension(['pdf', 'doc', 'docx'])
     *   document: File;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array of allowed file extensions
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    FileExtension: IValidatorRuleFunction<string[], Context>;

    /**
     * ### MinFileSize Rule
     *
     * Validates that the file size is at least the specified minimum size in bytes.
     *
     * #### Parameters
     * - Minimum file size in bytes (number)
     *
     * @example
     * ```typescript
     * // Valid examples
     * await Validator.validate({
     *   value: { name: 'file.txt', size: 2048, type: 'text/plain' },
     *   rules: ['MinFileSize[1024]']
     * }); // ✓ Valid (file >= 1KB)
     *
     * // Invalid examples
     * await Validator.validate({
     *   value: { name: 'small.txt', size: 512, type: 'text/plain' },
     *   rules: ['MinFileSize[1024]']
     * }); // ✗ Invalid (file < 1KB)
     *
     * await Validator.validate({
     *   value: 'not a file',
     *   rules: ['MinFileSize[1024]']
     * }); // ✗ Invalid
     *
     * // Class validation - minimum 1KB
     * class UploadForm {
     *   @MinFileSize(1024) // 1KB in bytes
     *   document: File;
     * }
     * ```
     *
     * @param options - Validation options with rule parameters
     * @param options.ruleParams - Array containing minimum file size in bytes
     * @returns Promise resolving to true if valid, rejecting with error message if invalid
     *
     * @since 1.22.0
     * @public
     */
    MinFileSize: IValidatorRuleFunction<number[], Context>;
  }
}
