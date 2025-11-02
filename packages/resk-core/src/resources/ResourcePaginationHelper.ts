import { defaultArray } from "@utils/defaultArray";
import { isNonNullString } from "@utils/isNonNullString";
import { isNumber } from "@utils/isNumber";
import { extendObj, isObj } from "@utils/object";
import { isStringNumber } from "@utils/string";
import { getQueryParams } from "@utils/uri";
import {
  IResourcePaginationMetaData,
  IResourceQueryOptions,
  IResourceQueryOrderBy,
  NestedPaths,
} from "./types";

export class ResourcePaginationHelper {
  /**
   * Normalizes pagination parameters by calculating the `page` from `skip` if provided,
   * or calculating `skip` from `page` if only `page` is provided.
   *
   * @param {IResourceQueryOptions} options - The pagination options.
   * @param {number} options.limit - The number of records per page.
   * @param {number} optioins.page - The requested page number (optional).
   * @param {number} options.skip - The number of records to skip (optional).
   * @returns {{ page: number, skip: number,limit:number }} The normalized pagination options : "page" and "skip" are calculated from "limit" and "skip" or "page" and "limit" if provided.
   *
   * @example
   * ```typescript
   * normalizePagination({ limit: 10, skip: 20 }); // { page: 3, skip: 20 }
   * normalizePagination({ limit: 10 }); // { page: 1, skip: 0 }
   * normalizePagination({ page: 3, limit: 10 }); // { page: 3, skip: 0 }
   * normalizePagination({ page: 3, skip: 20 }); // { page: 3, skip: 20 }
   * ```
   */
  static normalizePagination(options?: IResourceQueryOptions) {
    let { page, skip, limit } = Object.assign({}, options);
    if (!isNumber(limit)) {
      return {};
    }
    if (isNumber(skip) && skip > 0) {
      // Calculate page when skip is provided
      page = Math.floor(skip / limit) + 1;
    } else if (isNumber(page) && page > 0) {
      // Calculate skip when page is provided
      skip = (page - 1) * limit;
    } else {
      // Default to first page
      page = 1;
      skip = 0;
    }
    return { page, skip, limit };
  }

  /**
   * Normalizes orderBy parameters into a structured object format.
   *
   * This method takes various input formats for sorting criteria and converts them into a consistent
   * object where keys are valid nested property paths and values are sort directions ("asc" or "desc").
   * It handles single strings, arrays of strings, and undefined inputs gracefully.
   *
   * @template T - The resource type to validate paths against
   * @param orderBy - The orderBy specification in various formats:
   *   - `string`: Single field like "name" (ascending) or "-name" (descending)
   *   - `string[]`: Multiple fields like ["name", "-age", "createdAt"]
   *   - `undefined`: No sorting specified
   * @returns A partial record mapping valid nested paths to sort directions
   *
   * @example
   * ```typescript
   * interface User {
   *   id: number;
   *   name: string;
   *   profile: { age: number; address: { city: string } };
   * }
   *
   * // Single ascending field
   * normalizeOrderBy<User>("name")
   * // Returns: { "name": "asc" }
   *
   * // Single descending field
   * normalizeOrderBy<User>("-profile.age")
   * // Returns: { "profile.age": "desc" }
   *
   * // Multiple fields
   * normalizeOrderBy<User>(["name", "-profile.age", "profile.address.city"])
   * // Returns: { "name": "asc", "profile.age": "desc", "profile.address.city": "asc" }
   *
   * // Invalid input (filtered out)
   * normalizeOrderBy<User>([null, "", "name", undefined])
   * // Returns: { "name": "asc" }
   * ```
   *
   * @remarks
   * - Fields starting with "-" are treated as descending order
   * - Invalid or empty strings are silently filtered out
   * - Duplicate fields will log a warning and use the last occurrence
   * - The method performs type assertion to `NestedPaths<T>` - ensure input paths are valid at call site
   */
  static normalizeOrderBy<T = unknown>(
    orderBy?: IResourceQueryOrderBy<T>
  ): Partial<Record<NestedPaths<T>, SortOrder>> {
    const fields = Array.isArray(orderBy)
      ? orderBy
      : isNonNullString(orderBy)
        ? [orderBy]
        : [];

    const result: Partial<Record<NestedPaths<T>, SortOrder>> = {};
    fields.forEach((field) => {
      if (!isNonNullString(field) || String(field).trim() === "") return;
      const isDescending = String(field).startsWith("-");
      const direction: SortOrder = isDescending ? "desc" : "asc";
      const path = isDescending ? String(field).slice(1) : field;
      // Type assertion - caller should ensure path validity
      const key = path as NestedPaths<T>;
      // Warn about duplicates (last one wins)
      if (result[key] !== undefined) {
        console.warn(
          `Duplicate orderBy field: ${path}. Using last occurrence.`
        );
      }
      result[key] = direction;
    });

    return result;
  }

  /***
   * Determines if result can be paginated based on the provided query options.
   * It checks if the query options have a `limit` property of type number.
   * @param {IResourceQueryOptions} queryOptions - The query options.
   * @returns {boolean} Whether the result can be paginated.
   *
   * @example
   * canPaginateResult({ limit: undefined }); //false
   * canPaginateResult({ limit: 10, skip: 20 }); // true
   * canPaginateResult({ page: 3, limit: 10 }); // true
   * canPaginateResult({ page: 3, skip: 20 }); // true
   */
  static canPaginateResult(queryOptions: IResourceQueryOptions): boolean {
    if (!isObj(queryOptions)) {
      return false;
    }
    return isNumber(queryOptions.limit);
  }
  static getPaginationMetaData(
    count: number,
    queryOptions?: IResourceQueryOptions
  ): IResourcePaginationMetaData {
    const { limit, page, skip } =
      ResourcePaginationHelper.normalizePagination(queryOptions);
    count = isNumber(count) ? count : 0;
    const meta: IResourcePaginationMetaData = {
      total: count,
    };
    if (
      typeof limit === "number" &&
      limit > 0 &&
      typeof page === "number" &&
      page >= 0
    ) {
      meta.currentPage = page;
      meta.pageSize = limit;
      meta.totalPages = Math.ceil(count / limit);
      meta.hasNextPage = meta.currentPage < meta.totalPages;
      meta.hasPreviousPage = meta.currentPage > 1;
      meta.nextPage = meta.hasNextPage ? meta.currentPage + 1 : undefined;
      meta.previousPage = meta.hasPreviousPage
        ? meta.currentPage - 1
        : undefined;
      meta.lastPage = meta.totalPages;
    }
    return meta;
  }
  /***
   * Paginates the result based on the provided options.
   * @param {DataType[]} data - The data to paginate.
   * @param {number} count - The total count of the data.
   * @param {IResourceQueryOptions} options - The pagination options.
   * @returns {IResourcePaginatedResult<DataType>} The paginated result.
   */
  static paginate<DataType = unknown>(
    data: DataType[],
    count: number,
    options?: IResourceQueryOptions
  ) {
    const meta = ResourcePaginationHelper.getPaginationMetaData(count, options);
    const { currentPage, pageSize, totalPages } = meta;
    if (
      Array.isArray(data) &&
      isNumber(currentPage) &&
      isNumber(pageSize) &&
      isNumber(totalPages)
    ) {
      const startIndex = Math.max(0, currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      data = data.slice(startIndex, endIndex);
    }
    return {
      data,
      total: count,
      meta,
    };
  }
  /**
   * Parses query options from the provided request object.
   * It extracts query parameters, headers, and other relevant information to construct a query options object.
   * @template T The type of resource data.
   * @param req The request object containing the URL and headers.
   * @returns {IResourceQueryOptions<T> & {queryParams: Record<string, any>}} The parsed query options object.
   *
   * @example
   * const req = { url: '/api/resources?limit=10&skip=5', headers: { 'x-filters': { limit: 10, skip: 5 } } };
   * const queryOptions = parseQueryOptions(req);
   */
  static parseQueryOptions<T = unknown>(req: {
    url: string;
    headers: Record<string, any>;
    params?: Record<string, any>;
    filters?: Record<string, any>;
  }): IResourceQueryOptions<T> & { queryParams: Record<string, any> } {
    const queryParams = extendObj({}, req?.params, getQueryParams(req?.url));
    const xFilters = extendObj(
      {},
      queryParams,
      req?.headers?.["x-filters"],
      req?.filters
    );
    const limit = parseNumber(xFilters.limit);
    const skip = parseNumber(xFilters.skip);
    const page = parseNumber(xFilters.page);
    const result: IResourceQueryOptions<T> =
      ResourcePaginationHelper.normalizePagination({ limit, skip, page });
    let distinct = xFilters.distinct;
    if (typeof distinct == "number") {
      distinct = !!distinct;
    }
    if (
      typeof distinct === "boolean" ||
      (Array.isArray(distinct) && distinct.length)
    ) {
      result.distinct = distinct;
    }
    const defaultOrderBy = xFilters.orderBy;
    const orderBy = ResourcePaginationHelper.normalizeOrderBy(defaultOrderBy);
    if (orderBy && Object.getSize(orderBy, true) > 0) {
      (result as any).orderBy = orderBy;
    }
    const include = defaultArray<any>(xFilters.include);
    if (include.length) {
      result.include = include as any;
    }
    const cache = xFilters.cache;
    if (cache !== undefined) {
      result.cache = !!cache;
    }
    const cacheTTL = xFilters.cacheTTL;
    if (cacheTTL !== undefined) {
      result.cacheTTL = cacheTTL;
    }
    const where = defaultArrayOrStringOrObject(xFilters.where);
    if (isObj(where) && Object.getSize(where, true)) {
      result.where = where;
    }
    const includeDeleted = xFilters.includeDeleted;
    if (typeof includeDeleted === "boolean") {
      result.includeDeleted = includeDeleted;
    }
    const relations = defaultArray(xFilters.relations);
    if (relations.length) {
      result.relations = relations;
    }
    return { ...result, queryParams };
  }
}

const defaultArrayOrStringOrObject = (...args: any[]) => {
  for (const arg of args) {
    if (Array.isArray(arg) && arg.length) {
      return arg;
    }
    if (isNonNullString(arg)) {
      return arg;
    }
    if (isObj(arg) && Object.getSize(arg, true)) {
      return arg;
    }
  }
  return undefined;
};

const parseNumber = (value: any) => {
  if (isStringNumber(value)) {
    return Number(value);
  }
  if (typeof value === "number") {
    return value;
  }
  return undefined;
};

type SortOrder = "asc" | "desc";
