import { IDict, IResourceName, IField, IResourceInstance, IResourceDefaultEvent, IResource, IResourceActionMap, IResourceActionName, IResourceAction, IResourceDataProvider, IResourceOperationResult, IResourcePrimaryKey, IResourceQueryOptions, IResourcePaginatedResult, II18nTranslation, IResourceTranslateActionKey } from '../types';
import { getFields } from '../fields';
import { isEmpty, defaultStr, isObj, isNonNullString, stringify, ObservableClass, observableFactory } from '../utils/index';
import { IConstructor, IProtectedResource } from '../types/index';
import { IAuthPerm, IAuthUser } from '@/auth/types';
import { isAllowed } from '../auth/perms';
import { i18n, I18n } from '@/i18n';
import { Scope, TranslateOptions } from 'i18n-js';

/***
    @interface The reflect metat key used to store resources metatdata
*/
const resourceMetaData = Symbol("resource");
const resourcesMetaDataKey = Symbol('resources');
const resourcesClassNameMetaData = Symbol('resourceByClassName');

/**
 * Represents the base class for any resource.
 * 
 * The `ResourceBase` class provides a flexible structure for defining resource instances with optional metadata such as 
 * `name`, `label`, `title`, and `tooltip`. Additionally, it manages dynamic fields associated with the resource.
 * 
 * This class can be extended to implement specific resources, and it automatically handles merging options passed into
 * the constructor with the instance properties. It also retrieves and manages resource fields using the `getFields` method.
 * 
 * @template DataType - The type of data the resource is expected to handle. By default, it accepts any type (`DataType=any`).
 * @template PrimaryKeyType - The type of the primary key for the resource. Defaults to `IResourcePrimaryKey`.
 * @template EventType - The type of event that the resource can emit. Defaults to `IResourceActionName`.
 * 
 * @extends ObservableClass<EventType> - Extends the `ObservableClass` to enable event-based communication.
 * 
 * @implements IResourceInstance<DataType> - Ensures that the class follows the `IResourceInstance` interface for consistency.
 * 
 * @example
 * // Create a new resource with basic properties
 * const resource = new ResourceBase({
 *    name: 'user',
 *    label: 'User',
 *    title: 'User Information',
 *    tooltip: 'Contains user-related data'
 * });
 * 
 * console.log(resource.getLabel()); // Output: 'User'
 * console.log(resource.getTitle()); // Output: 'User Information'
 * console.log(resource.getTooltip()); // Output: 'Contains user-related data'
 * 
 * @example
 * // Create a resource with dynamic fields
 * const dynamicResource = new ResourceBase({
 *    name: 'product',
 *    fields: {
 *      name: { type: 'string', label: 'Product Name' },
 *      price: { type: 'number', label: 'Product Price' }
 *    }
 * });
 * 
 * console.log(dynamicResource.getFields()); 
 * // Output: { name: { type: 'string', label: 'Product Name' }, price: { type: 'number', label: 'Product Price' } }
 */
export class ResourceBase<DataType = any, PrimaryKeyType extends IResourcePrimaryKey = IResourcePrimaryKey, EventType extends Partial<IResourceDefaultEvent> = IResourceDefaultEvent> extends ObservableClass<EventType> implements IResourceInstance<DataType, PrimaryKeyType, EventType> {
  actions?: IResourceActionMap;
  options?: IResource<DataType, PrimaryKeyType>;
  getOptions(): IResource<DataType, PrimaryKeyType> {
    return Object.assign({}, this.options);
  }
  static events = observableFactory<IResourceDefaultEvent | "string">();
  /**
   * The internal name of the resource.
   *
   * This name is used within the system for referencing the resource programmatically.
   * It is often a short, unique identifier for the resource.
   * 
   * @example
   * ```typescript
   * const userResource: IResource = { name: "user" };
   * ```
  */
  name?: IResourceName;

  /**
   * A user-friendly label for the resource.
   *
   * This is typically a shorter name intended for display in UI elements, such as dropdowns or buttons.
   * It helps users identify the resource within the user interface.
   *
   * @example
   * ```typescript
   * const productResource: IResource = { label: "Product" };
   * ```
   */
  label?: string;

  /**
   * A descriptive title for the resource.
   *
   * The title provides a more detailed or contextual label for the resource, which is often displayed
   * in prominent places like headings or page titles. It helps users understand the purpose of the resource.
   *
   * @example
   * ```typescript
   * const orderResource: IResource = { title: "Order Management" };
   * ```
   */
  title?: string;

  /**
   * A short text that appears when the user hovers over the resource.
   * The tooltip provides additional context or information about the resource.
   * 
   * Typically used in user interfaces to clarify what a particular resource represents or to give instructions.
   *
   * @example
   * ```typescript
   * const userResource: IResource = { tooltip: "This resource manages user information." };
   * ```
   */
  tooltip?: string;


  /**
  * A type that represents a map of field names to their corresponding IField instances.
   @description this is the list of fields that are part of the resource.It's a map where each key represents a field name, and the value contains field metadata.
   Fields are created using the @Field decorator when resources are defined.
  */
  fields?: Record<string, IField>;
  private _onDictionaryChangedListener?: { remove: () => any };
  private _onLocaleChangeListener?: { remove: () => any };
  /**
   * Constructs a new `ResourceBase` instance.
   * 
   * The constructor accepts an `options` object, which is used to populate the instance properties.
   * It automatically copies all the non-function properties from the `options` into the current instance.
   * 
   * @param {...any[]} args - Additional arguments that can be passed for further customization.
   */
  constructor(...args: any[]) {
    super();
    this._onDictionaryChangedListener = i18n.on("translations-changed", this.onI18nChange.bind(this));
    this._onLocaleChangeListener = i18n.on("locale-changed", this.onI18nChange.bind(this));
  }
  onI18nChange() {
    this.resolveTranslations();
  }
  resolveTranslations(options?: TranslateOptions) {
    return i18n.resolveTranslations(this);
  }
  /**
   * returns the i18n params for the resource. this is used to translate the error messages.
   * @param params - The options object containing the properties to initialize the resource with.
   * @returns 
   */
  getTranslateParams(params?: Record<string, any>): Record<string, any> {
    return {
      resourceLabel: this.getLabel(),
      resourceName: this.getName(),
      ...Object.assign({}, params)
    };
  }
  /**
   * 
   * @returns {string} the message to display when the DataProvider for the resource is invalid
   */
  get INVALID_DATA_PROVIDER_ERROR(): string {
    return i18n.t("resources.invalidDataProvider", this.getTranslateParams());
  }
  hasDataProvider(): boolean {
    return this.dataProvider != null && typeof this.dataProvider?.update === "function" && typeof this.dataProvider?.create === "function" && typeof this.dataProvider?.find === "function" && typeof this.dataProvider?.update === "function" && typeof this.dataProvider?.delete === "function";
  }
  /**
   * The data provider for the resource.
   */
  dataProvider: IResourceDataProvider<DataType, PrimaryKeyType> = null as unknown as IResourceDataProvider<DataType, PrimaryKeyType>;
  /**
   * get the data provider for the resource.
   * @returns {IResourceDataProvider<DataType, PrimaryKeyType>} The data provider for the resource.
   */
  getDataProvider(): IResourceDataProvider<DataType, PrimaryKeyType> {
    return this.dataProvider;
  };
  /***
   * trigger the event
   * @param event - The event to trigger.
   * When the event is triggered, the events observable is also triggered.
   * @param args - The arguments to pass to the event.
   */
  _trigger(event: EventType, ...args: any[]) {
    ResourceBase.events.trigger(event, Object.assign({}, this.getTranslateParams()), ...args);
    return this.trigger(event, ...args);
  }
  /***
   * creates a new record in the resource.
   * @param {DataType} record - The data for the new record.
   * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the result of the create operation.
   */
  create(record: DataType): Promise<IResourceOperationResult<DataType>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserCreate()) {
      return Promise.reject(new Error(i18n.t("resources.createForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider()?.create(record).then((result) => {
      this._trigger("create" as EventType, result);
      return result;
    });
  }
  /***
   * Fetches all records from the resource.
   * @param {IResourceQueryOptions<DataType, PrimaryKeyType>} options - Optional options for fetching resources.
   * @returns {Promise<IResourcePaginatedResult<DataType>>} A promise that resolves to the result of the list operation.
   */
  find(options?: IResourceQueryOptions<DataType, PrimaryKeyType>): Promise<IResourcePaginatedResult<DataType>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserList()) {
      return Promise.reject(new Error(i18n.t("resources.listForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider()?.find(options).then((result) => {
      this._trigger("find" as EventType, result);
      return result;
    });
  }
  /***
   * fetches a single record from the resource.
   * @param {PrimaryKeyType} key - The primary key of the resource.
   * @returns {Promise<IResourceOperationResult<DataType>>} A promise that resolves to the result of the list operation.
   */
  findOne(key: PrimaryKeyType): Promise<IResourceOperationResult<DataType | null>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserRead()) {
      return Promise.reject(new Error(i18n.t("resources.readForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider().findOne(key).then((result) => {
      this._trigger("findOne" as EventType, result);
      return result;
    });
  }
  /**
   * updates a record in the resource.
   * @param key {PrimaryKeyType} The primary key of the resource to update.
   * @param updatedData
   * @returns 
   */
  update(key: PrimaryKeyType, updatedData: Partial<DataType>): Promise<IResourceOperationResult<DataType>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserUpdate()) {
      return Promise.reject(new Error(i18n.t("resources.updateForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider()?.update(key, updatedData).then((result) => {
      this._trigger("update" as EventType, result);
      return result;
    });
  }
  /***
   * deletes a record from the resource.
   * @param key {PrimaryKeyType} The primary key of the resource to delete.
   * @returns Promise<IResourceOperationResult<any>> A promise that resolves to the result of the delete operation.
   */
  delete(key: PrimaryKeyType): Promise<IResourceOperationResult<any>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserDelete()) {
      return Promise.reject(new Error(i18n.t("resources.deleteForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider()?.delete(key).then((result) => {
      this._trigger("delete" as EventType, result);
      return result;
    });
  }

  findAndCount(options?: IResourceQueryOptions<DataType, PrimaryKeyType>): Promise<IResourcePaginatedResult<DataType>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserRead()) {
      return Promise.reject(new Error(i18n.t("resources.readForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider().findAndCount(options).then((result) => {
      this._trigger("findAndCount" as EventType, result);
      return result;
    });
  }
  createMany(data: Partial<DataType>[]): Promise<IResourceOperationResult<DataType[]>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserCreate()) {
      return Promise.reject(new Error(i18n.t("resources.createForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider()?.createMany(data).then((result) => {
      this._trigger("createMany" as EventType, result);
      return result;
    });
  }
  updateMany(data: Partial<DataType>): Promise<IResourceOperationResult<DataType[]>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserUpdate()) {
      return Promise.reject(new Error(i18n.t("resources.updateForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider()?.updateMany(data).then((result) => {
      this._trigger("updateMany" as EventType, result);
      return result;
    });
  }
  deleteMany(criteria: IResourceQueryOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<any[]>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserDelete()) {
      return Promise.reject(new Error(i18n.t("resources.deleteForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider()?.deleteMany(criteria).then((result) => {
      this._trigger("deleteMany" as EventType, result);
      return result;
    });
  }
  count(options?: IResourceQueryOptions<DataType, PrimaryKeyType>): Promise<IResourceOperationResult<number>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserRead()) {
      return Promise.reject(new Error(i18n.t("resources.readForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider().count(options).then((result) => {
      this._trigger("read" as EventType, result);
      return result;
    });
  }
  exists(primaryKey: PrimaryKeyType): Promise<IResourceOperationResult<boolean>> {
    if (!this.hasDataProvider()) {
      return Promise.reject(new Error(this.INVALID_DATA_PROVIDER_ERROR));
    }
    if (!this.canUserRead()) {
      return Promise.reject(new Error(i18n.t("resources.readForbiddenError", this.getTranslateParams())));
    }
    return this.getDataProvider().exists(primaryKey).then((result) => {
      this._trigger("exits" as EventType, result);
      return result;
    });
  }

  /**
   * Initializes the resource with the provided options.
   * 
   * @param options - An object implementing the IResource interface, containing the data to initialize the resource with.
   * 
   * This method assigns the provided options to the resource, ensuring that any empty properties
   * on the resource are filled with the corresponding values from the options object. It skips
   * properties that are functions. After assigning the options, it calls the `getFields` method
   * to further process the resource.
   */
  init(options: IResource<DataType>) {
    options = Object.assign({}, options);
    this.options = options;
    this.resolveTranslations();
    for (let i in options) {
      if (isEmpty((this as IDict)[i]) && typeof (this as IDict)[i] !== "function") {
        try {
          (this as IDict)[i] = options[i as keyof typeof options];
        } catch { }
      }
    }
    this.getFields();
  }
  /**
   * Retrieves the i18n translations for the resource.
   * 
   * @param {string} [locale] - The locale to use for the translations. If not provided, the default locale from the i18n instance will be used.
   * @returns {IDict} - An object containing the translations for the resource, keyed by the property names.
   * @example
   * // Register translations for the "en" locale.
   * i18n.registerTranslations({
   *   en: {
   *     resources: {
   *       user: {  // The resource name
   *         label: "User",  // The label property
   *         title: "User Information",  // The title property
   *         tooltip: "Manage user data"  // The tooltip setI18nPropertyPrefix  property
   *       }
   *     }
   *   }
   * });
   * 
   * // Retrieve the translations for the "user" resource.  
   * import {ResourceManager} from "@resk/core";
   * const userResource = ResourceManager.getResource("user");
   * const userTranslations = userResource.getTranslations();
   * console.log(userTranslations);
   * // Output:
   * // {
   * //   label: "User",
   * //   title: "User Information",
   * //   tooltip: "Manage user data"   
   * // }
   */
  getTranslations(locale?: string): IDict {
    locale = defaultStr(locale, i18n.getLocale());
    const nameStr = String(this.getName()).trim();
    if (!isNonNullString(nameStr)) return {};
    const t = i18n.getNestedTranslation(["resources", nameStr], locale) as IDict;
    return isObj(t) && t ? t : {};
  }

  /**
   *Translates the given scope using the i18n default instance, ensuring that the resource name is prefixed correctly.
   *
   * @param {Scope} scope - The scope to use for the translation. This can be a string or an array of strings.
   * @param {TranslateOptions} [options] - Optional options to pass to the translation function.
   * @returns {string | T} - The translated string, or the translated value of type T if the scope returns a non-string value.
   * @example
   * // Register translations for the "en" locale.
   * i18n.registerTranslations({
   *   en: {
   *     resources: {
   *       user: {  // The resource name
   *         label: "User",  // The label property
   *         title: "User Information",  // The title property
   *         tooltip: "Manage user data"  // The tooltip setI18nPropertyPrefix  property,
   *         create: {
   *            label: "Create User",
   *            title: "Create a new user", 
   *            tooltip: "Click to add a new user."
   *         },
   *         read: {
   *            label: "View User",
   *            title: "View a specific user",
   *            tooltip: "Click to view a specific user.",  
   *         },
   *       }   
   *     }
   *   }
   * });
   * // Translate the "label" property of the "user" resource.
   * const userResource = ResourcesManager.getResource("user");
   * const label = userResource.translate("label"); // "User"
   * 
   * // Translate the "tooltip" property of the "user" resource.
   * const tooltip = userResource.translate("tooltip"); // "Manage user data"
   */
  translate<T = string>(scope: Scope, options?: TranslateOptions): string | T {
    const scopeArray = isNonNullString(scope) ? scope.trim().split(".") : Array.isArray(scope) ? scope : [];
    if (scopeArray[0] !== "resources" && !ResourcesManager.hasResource(scopeArray[1] as IResourceName)) {
      scopeArray.unshift(this.getName(), "resources");
    }
    return i18n.translate<T>(scopeArray, options);
  }

  /**
   * Retrieves the name of the resource.
   *
   * @returns {IResourceName} The name of the resource, cast to the IResourceName type.
   */
  getName(): IResourceName {
    return defaultStr(this.name) as IResourceName;
  }

  /**
   * Retrieves the actions associated with the resource.
   * If the actions are not already defined or not an object, 
   * it initializes them as an empty object of type `IResourceActionMap`.
   *
   * @returns {IResourceActionMap} The map of resource actions.
   */
  getActions(): IResourceActionMap {
    if (!isObj(this.actions) || !this.actions) {
      this.actions = {} as IResourceActionMap;
    }
    return this.actions;
  }
  /**
   * checks if the resource has the action
   * @param action - The action to check
   * @returns true if the action exists, false otherwise
   */
  hasAction(action: IResourceActionName): boolean {
    if (!isNonNullString(action)) return false;
    const actions = this.getActions();
    return isObj(actions[action]);
  }

  /**
   * Determines if the given permission is allowed for the specified user.
   *
   * @param perm - The permission to check. It can be a string or an object implementing the IAuthPerm interface.

   * @param user - The user for whom the permission is being checked. It can be an object implementing the IAuthUser interface.The user object for whom the permission.If not provided, the function will attempt 
   *   to retrieve the signed user from the session.
   * @returns A boolean indicating whether the permission is allowed for the user.
   *
   * The method performs the following steps:
   * 1. Constructs a prefix using the resource name.
   * 2. If the permission is a string, it trims and processes it to ensure it has the correct prefix.
   * 3. Checks if the permission string has the correct prefix.
   * 4. Extracts the action part of the permission and checks if it is a valid action.
   * 5. If the action is "all" or matches any of the resource's actions, it returns true.
   * 6. Otherwise, it delegates the permission check to the Auth.isAllowed method.
   */
  isAllowed(perm?: IAuthPerm, user?: IAuthUser): boolean {
    if (!this.getName()) return false;
    let prefix = `${String(this.getName()).trim().rtrim(":")}:`;
    let permStr: any = perm;
    if (typeof perm === "string") {
      permStr = perm.trim();
      let hasPrefix = true;
      if (!permStr.includes(":")) {
        permStr = `${prefix}${permStr}`;
      } else {
        const permStplit = permStr.toLowerCase().trim().split(":");
        hasPrefix = String(this.getName()).toLowerCase().trim() === permStplit[0]?.trim();
      }
      if (hasPrefix) {
        const action = permStr.trim().split(":")[1];
        if (isNonNullString(action)) {
          const actionSplit = action.toLowerCase().trim().split("|");
          let hasAction = actionSplit.includes("all");
          const actions = this.getActions();
          if (!hasAction) {
            for (let actionName in actions) {
              actionName = String(actionName).toLowerCase().trim();
              if (actionSplit.includes(actionName)) {
                hasAction = true;
                break;
              }
            }
          }
          if (!hasAction) {
            return false;
          }
        }
      }
    }
    return isAllowed(permStr as IAuthPerm, user);
  }
  /**
   * Determines if the specified user has read access.
   *
   * @param user - The user whose read access is being checked. If no user is provided, the method will use default permissions.
   * @returns A boolean indicating whether the user has read access.
   */
  canUserRead(user?: IAuthUser): boolean {
    return this.isAllowed(`read`, user);
  }
  canUserList(user?: IAuthUser): boolean {
    return this.isAllowed(`list`, user);
  }
  /**
   * Determines if the user has permission to create a resource.
   *
   * @param user - The user whose permissions are being checked. If not provided, the method will use the default user.
   * @returns A boolean indicating whether the user is allowed to create the resource.
   */
  canUserCreate(user?: IAuthUser): boolean {
    return this.isAllowed(`create`, user);
  }
  /**
   * Determines if the specified user has permission to update the resource.
   *
   * @param user - The user whose update permissions are being checked. If no user is provided, the method will use default permissions.
   * @returns A boolean indicating whether the user has permission to update the resource.
   */
  canUserUpdate(user?: IAuthUser): boolean {
    return this.isAllowed(`update`, user);
  }

  /**
   * Determines if the user has permission to delete.
   *
   * @param user - The authenticated user whose permissions are being checked. Optional.
   * @returns A boolean indicating whether the user is allowed to delete.
   */
  canUserDelete(user?: IAuthUser): boolean {
    return this.isAllowed(`delete`, user);
  }



  /**
   * Retrieves the translated value of the specified property, using the resource's translations.
   * If the property is not found in the translations, it returns the fallback value or the property name.
   *
   * @param propertyName - The name of the property to translate.
   * @param fallbackValue - The fallback value to use if the property is not found in the translations.
   * @param options - Additional options to pass to the translation function.
   * @returns The translated value of the property.
   */
  translateProperty(propertyName: string, fallbackValue?: string, options?: TranslateOptions): string {
    propertyName = defaultStr(propertyName).trim();
    options = Object.assign({}, { resourceName: this.getName() }, options);
    const translations = this.getTranslations();
    if (isNonNullString(propertyName) && translations[propertyName]) {
      const translatedValue = stringify(i18n.t(propertyName, options));
      if (isNonNullString(translatedValue) && translatedValue.includes("." + propertyName.ltrim("."))) {
        return translatedValue;
      }
    }
    return defaultStr(fallbackValue, propertyName);
  }

  /**
   * Retrieves the label of the resource.
   * 
   * If the label is not defined, it returns a default empty string.
   * 
   * @returns {string} The label of the resource.
   */
  getLabel(): string {
    return this.translateProperty("label", defaultStr(this.label, this.getName()));
  }

  /**
   * Retrieves the title of the resource.
   * 
   * If the title is not defined, it returns a default empty string.
   * 
   * @returns {string} The title of the resource.
   */
  getTitle(): string {
    return this.translateProperty("title", defaultStr(this.title, this.getLabel()));
  }

  /**
   * Retrieves the tooltip of the resource.
   * 
   * If the tooltip is not defined, it returns a default empty string.
   * 
   * @returns {string} The tooltip of the resource.
   */
  getTooltip(): string {
    return this.translateProperty("tooltip", defaultStr(this.tooltip));
  }

  /**
   * Retrieves the fields associated with the resource.
   * 
   * This method populates the `fields` property by invoking an external `getFields` function, 
   * which dynamically retrieves and returns all the fields related to the resource.
   * 
   * @returns {Record<string, IField>} A record containing all the fields of the resource.
   */
  getFields(): Record<string, IField> {
    this.resolveTranslations();
    this.fields = getFields(this);
    return this.fields;
  }

  /**
   * Formats a string by replacing placeholders with corresponding values from a parameters object.
   *
   * @param text - The string containing placeholders in the format `{key}` to be replaced.
   * @param params - An object containing key-value pairs where the key corresponds to the placeholder in the text and the value is the replacement.
   * @returns The formatted string with placeholders replaced by corresponding values from the params object.
   */
  sprintf(text?: string, params?: Record<string, any>): string {
    let t: string = defaultStr(text);
    if (text && isObj(params) && params) {
      for (let i in params) {
        if (!isEmpty(params[i])) {
          t = t.replaceAll(`{${i}}`, stringify(params[i]));
        }
      }
    }
    return t;
  }
  /**
   * Retrieves the label for a specified action, optionally formatting it with provided parameters.
   *
   * @param actionName - The name of the action for which to get the label.
   * @param params - Optional parameters to format the label.
   * @returns The formatted action label.
   */
  getActionLabel(actionName: IResourceActionName, params?: Record<string, any>) {
    return this.sprintf(this.getAction(actionName)?.label, params);
  }
  /**
   * Retrieves the title of a specified action, optionally formatting it with provided parameters.
   *
   * @param actionName - The name of the action for which the title is to be retrieved.
   * @param params - An optional record of parameters to format the title.
   * @returns The formatted title of the specified action.
   */
  getActionTitle(actionName: IResourceActionName, params?: Record<string, any>) {
    return this.sprintf(this.getAction(actionName)?.title, params);
  }
  /**
   * Retrieves the tooltip for a specified action.
   *
   * @param actionName - The name of the action for which to get the tooltip.
   * @param params - Optional parameters to format the tooltip string.
   * @returns The formatted tooltip string for the specified action.
   */
  getActionTooltip(actionName: IResourceActionName, params?: Record<string, any>) {
    return this.sprintf(this.getAction(actionName)?.tooltip, params);
  }
  /**
   * Retrieves a specific action by its name.
   *
   * @param {IResourceActionName} actionName - The name of the action to retrieve.
   * @returns {IResourceAction} The action object if found, otherwise an empty object.
   */
  getAction(actionName: IResourceActionName): IResourceAction {
    if (!isNonNullString(actionName)) return {};
    const actions = this.getActions();
    return (isObj(actions[actionName]) && actions[actionName]) || {};
  }

  /**
   * Retrieves the primary key fields from the current object's fields.
   *
   * @returns {IField[]} An array of fields that are marked as primary keys.
   */
  getPrimaryKeys(): IField[] {
    const primaryKeys: IField[] = [];
    if (isObj(this.fields)) {
      for (let i in this.fields) {
        if (isObj(this.fields[i]) && this.fields[i].primaryKey) {
          primaryKeys.push(this.fields[i]);
        }
      }
    }
    return primaryKeys;
  }
}

/**
 * Manages a collection of resources within the application.
 * 
 * The `ResourcesManager` class provides static methods to store, retrieve, and manage resource instances.
 * It maintains a global record of all instantiated resources, allowing for easy access and management.
 * Each resource is identified by a unique name, which is derived from the `IResourceName` type.
 * 
 * @example
 * // Instantiate and add resources to the manager
 * const userResource = new UserResource();
 * ResourcesManager.addResource('userResource', userResource);
 * 
 * // Retrieve the names of all resources
 * const resourceNames = ResourcesManager.getAllNames(); 
 * console.log(resourceNames); // Output: ['userResource']
 * 
 * // Retrieve a specific resource
 * const retrievedResource = ResourcesManager.getResource<UserResource>('userResource');
 * if (retrievedResource) {
 *   console.log(retrievedResource.getLabel()); // Output: The label of the user resource
 * }
 */
export class ResourcesManager {

  /**
   * A global constant storing a record of all instantiated resources.
   * 
   * This represents a record of all resources, where the keys are derived from `IResourceName`
   * and the values are instances of `ResourceBase`.
   * 
   * @example
   * const allResources: IAllResource = {
   *   userResource: new UserResource()
   * };
   */
  private static resources: Record<IResourceName, ResourceBase> = {} as Record<IResourceName, ResourceBase>;

  /**
   * Retrieves the global record of all resource options managed by the `ResourcesManager`.
   * 
   * This method returns a copy of the internal record of resource options, which can be used to access
   * the configuration and settings for each registered resource.
   * 
   * @returns {Record<IResourceName, IResource<any,any>>} A copy of the resource options record.
   */
  public static getAllOptions(): Record<IResourceName, IResource<any, any>> {
    return Object.assign({}, Reflect.getMetadata(resourcesMetaDataKey, ResourcesManager));
  }
  /**
   * Adds resource options to the global record managed by the `ResourcesManager`.
   * 
   * This method updates the internal record of resource options with the provided `options` for the given `resourceName`.
   * The updated record is then stored as metadata on the `ResourcesManager` class.
   * 
   * @param {IResourceName} resourceName - The unique name of the resource.
   * @param {IResource<any>} options - The resource options to be associated with the given `resourceName`.
   */
  public static addOptions(resourceName: IResourceName, options: IResource<any>) {
    const allOptions = this.getAllOptions();
    if (!isNonNullString(resourceName) || !resourceName) return;
    options = Object.assign({}, options);
    options.name = isNonNullString(options?.name) ? options.name : resourceName;
    (allOptions as any)[resourceName] = options;
    Reflect.defineMetadata(resourcesMetaDataKey, allOptions, ResourcesManager);
    if (isNonNullString(options.className)) {
      const classNames = ResourcesManager.getAllClassNames();
      (classNames as any)[options.className] = options.name;
      Reflect.defineMetadata(resourcesClassNameMetaData, classNames, ResourcesManager);
    }
  }
  /**
   * Retrieves the global record of resource class names managed by the `ResourcesManager`.
   * 
   * This method returns a copy of the internal record of resource class names, which can be used to access
   * the class name associated with each registered resource.
   * 
   * @returns {Record<string,IResourceName>} A copy of the resource class names record.
   */
  public static getAllClassNames(): Record<string, IResourceName> {
    return Object.assign({}, Reflect.getMetadata(resourcesClassNameMetaData, ResourcesManager));
  }
  /**
   * Retrieves the class name associated with the specified resource name.
   *
   * This method looks up the class name for the given `resourceName` in the global record of resource class names
   * managed by the `ResourcesManager`. If the resource name is not found, or is not a valid non-null string, this
   * method will return `undefined`.
   *
   * @param {IResourceName} resourceName - The unique name of the resource to retrieve the class name for.
   * @returns {string | undefined} The class name associated with the specified resource name, or `undefined` if not found.
   */
  public static getNameByClassName(className: string): IResourceName | undefined {
    if (!isNonNullString(className)) return undefined;
    const classNames = this.getAllClassNames();
    return classNames[className];
  }
  /**
   * Retrieves the resource options for the specified resource name.
   *
   * This method retrieves the resource options associated with the given `resourceName` from the global
   * record of resource options managed by the `ResourcesManager`. If the resource name is not a valid
   * non-null string, or if the resource options are not found, this method will return `undefined`.
   *
   * @param {IResourceName} resourceName - The unique name of the resource to retrieve the options for.
   * @returns {IResource<any,any> | undefined} The resource options for the specified resource name, or `undefined` if not found.
   */
  public static getOptions(resourceName: IResourceName): IResource<any, any> | undefined {
    const allOptions = this.getAllOptions();
    if (!isNonNullString(resourceName) || !resourceName) return;
    return (allOptions as any)[resourceName];
  }

  /**
   * Retrieves the resource options for the specified resource class name.
   *
   * This method first looks up the resource name associated with the given class name using the `getNameByClassName` method.
   * If the resource name is found, it then retrieves the resource options for that resource name using the `getOptions` method.
   * If the resource name is not found, or if the resource options are not found, this method will return `undefined`.
   *
   * @param {string} className - The class name of the resource to retrieve the options for.
   * @returns {IResource<any, any> | undefined} The resource options for the specified resource class name, or `undefined` if not found.
   */
  public static getOptionsByClassName(className: string): IResource<any, any> | undefined {
    const resourceName = this.getNameByClassName(className);
    if (!resourceName) return undefined;
    return this.getOptions(resourceName);
  }

  /**
   * Retrieves the names of all registered resources.
   * 
   * This method returns an array of resource names that are currently managed by the `ResourcesManager`.
   * 
   * @returns {string[]} An array of resource names.
   * 
   * @example
   * const names = ResourcesManager.getAllNames();
   * console.log(names); // Output: ['userResource', 'productResource']
   */
  public static getAllNames() {
    return Object.keys(this.resources);
  }

  /**
   * Retrieves a resource instance by its name from the `resources` record.
   * 
   * @template ResourceInstanceType The type extending `ResourceBase` for the resource being returned.
   * @param {IResourceName} name - The name of the resource to retrieve, as defined in `IResourceName`.
   * @returns {(ResourceInstanceType | null)} The resource instance if it exists, or `null` if the resource is not found.
   * 
   * @example
   * const userResource = ResourcesManager.getResource<UserResource>('userResource');
   * if (userResource) {
   *   console.log(userResource.getLabel()); // Output: The label of the user resource
   * }
   */
  public static getResource<ResourceInstanceType extends ResourceBase = ResourceBase>(name: IResourceName): ResourceInstanceType | null {
    if (typeof name === "string" && name) {
      return this.resources[name] as ResourceInstanceType;
    }
    return null;
  }

  /**
   * Checks if a resource with the given name exists in the `ResourcesManager`.
   *
   * @param {IResourceName} name - The name of the resource to check.
   * @returns {boolean} `true` if the resource exists, `false` otherwise.
   */
  public static hasResource(name: IResourceName) {
    return !!this.getResource(name);
  }
  /**
   * Adds a new resource instance to the manager.
   * 
   * @param {IResourceName} name - The unique name of the resource to add.
   * @param {ResourceBase<DataType>} resource - The resource instance to be added.
   * @template DataType The type of data associated with the resource.
   * 
   * @example
   * const productResource = new ProductResource();
   * ResourcesManager.addResource('productResource', productResource);
   * console.log(ResourcesManager.getAllNames()); // Output: ['userResource', 'productResource']
   */
  public static addResource<DataType = any>(name: IResourceName, resource: ResourceBase<DataType>) {
    if (typeof name === "string" && name && resource && resource instanceof ResourceBase) {
      (this.resources as IDict)[name] = resource;
    }
  }

  /**
   * Removes a resource instance from the manager by its name.
   * 
   * This method deletes the specified resource from the `resources` record. 
   * If the resource exists, it will be removed, and the updated list of resources will be returned.
   * 
   * @param {IResourceName} name - The name of the resource to be removed from the manager.
   * 
   * @returns {Record<IResourceName, ResourceBase>} The updated record of all remaining resources after the removal.
   * 
   * @example
   * // Assuming a resource named 'userResource' has been previously added
   * console.log(ResourcesManager.getAllNames()); // Output: ['userResource', 'productResource']
   * 
   * // Remove the user resource
   * ResourcesManager.removeResource('userResource');
   * 
   * // Check the remaining resources
   * console.log(ResourcesManager.getAllNames()); // Output: ['productResource']
   */
  public static removeResource(name: IResourceName): Record<IResourceName, ResourceBase> {
    if (typeof name === "string") {
      delete (this.resources as IDict)[name];
    }
    return this.resources;
  }


  /**
   * Retrieves all resource instances managed by the manager.
   * 
   * This method returns a record of all resources currently stored in the `ResourcesManager`.
   * The keys are derived from `IResourceName`, and the values are instances of `ResourceBase`.
   * This allows for easy access to all registered resources.
   * 
   * @returns {Record<IResourceName, ResourceBase>} A record containing all resource instances, where each key is a resource name.
   * 
   * @example
   * // Retrieve all registered resources
   * const allResources = ResourcesManager.getResources();
   * console.log(allResources); 
   * // Output: 
   * // {
   * //   userResource: UserResourceInstance,
   * //   productResource: ProductResourceInstance
   * // }
   */
  public static getResources(): Record<IResourceName, ResourceBase> {
    return this.resources;
  }

  /**
 * Checks if a resource is allowed for the given user and permissions.
 *
 * This static method retrieves the resource based on the provided `resourceName` and checks if the
 * user is allowed to perform the specified `perm` action on the resource. If the resource is not
 * found or the user is not allowed, the method returns `false`.
 *
 * @param options - An object containing the resource name and the required permission.
 * @param user - An optional user object to check the permissions against.
 * @returns `true` if the user is allowed to perform the specified action on the resource, `false` otherwise.
 * @example
 * // Example usage of the isAllowed method
 * const user = { id: 1, perms: { documents: ['read', 'create'] } };
 * const resourceName = 'documents';
 * const perm = 'read';
 * const isAllowed = ResourcesManager.isAllowed({ resourceName, perm }, user);
 * console.log(isAllowed); // Output: true
 */
  static isAllowed(options: IProtectedResource, user?: IAuthUser): boolean {
    if (!isObj(options)) return false;
    if (options?.resourceName && isNonNullString(options?.resourceName)) {
      const resource = ResourcesManager.getResource(options?.resourceName);
      if (resource) {
        return resource.isAllowed(options?.perm as IAuthPerm, user);
      }
    }
    return isAllowed(options?.perm, user);
  }
}

/**
 * A decorator function that adds resource metadata to a class that implements `ResourceBase`
 * 
 * This decorator stores the resource properties (`name`, `label`, `title`, `tooltip`) using Reflect metadata.
 *
 * @typeParam Datatype - An optional type representing the data that this resource holds. Defaults to `any`.
 * @param options - The properties to be set as metadata on the class.
 * 
 * @example
 * ```typescript
 * @Resource({
 *   name: "user",
 *   label: "User",
 *   title: "User Management",
 *   tooltip: "Manage user data"
 * })
 * class User {}
 * 
 * ```
 */
export function Resource<DataType = any>(options: IResource<DataType>) {
  return function (target: Function) {
    options = Object.assign({}, options);
    if (typeof target == "function") {
      try {
        options.className = defaultStr(options.className, target?.name);
        const resource = new (target as IConstructor)() as ResourceBase<DataType>;
        resource.init(options);
        ResourcesManager.addResource<DataType>((options.name as IResourceName), resource);
      } catch { }
    }
    Reflect.defineMetadata(resourceMetaData, options, target);
    ResourcesManager.addOptions(options.name as IResourceName, options);
  };
}

/**
 * Retrieves the resource metadata associated with the given target class.
 *
 * This function uses reflection to access the metadata stored on the target class using the `@Resource` decorator.
 * It returns a new object that is a copy of the metadata, which includes properties like `name`, `label`, `title`, and `tooltip`.
 *
 * @param {any} target - The target class or instance from which to retrieve the metadata.
 * @returns {ResourceBase} An object containing the resource metadata for the given target.
 */
export const getResourceMetaData = <DataType = any>(target: any): ResourceBase<DataType> => {
  return Object.assign({}, Reflect.getMetadata(resourceMetaData, target));
}
