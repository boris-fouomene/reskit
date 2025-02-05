import isNonNullString from "@utils/isNonNullString";
import { IMongoQuery, IResourceData, IResourcePaginatedResult, IResourceQueryOptions, IResourceQueryOptionsOrderDirection } from "../types";
import { isNumber } from "lodash";
import { defaultObj, isObj } from "@utils/object";
import { getQueryParams } from "@utils/uri";
import defaultVal from "@utils/defaultVal";
import { isStringNumber } from "@utils/string";
import { defaultArray } from "@utils/defaultArray";

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
     * Normalizes the `orderBy` object from the query options.
     * Ensures the order direction is either 'ASC' or 'DESC' and handles multiple fields.
     *
     * @param {IResourceQueryOptions} queryOptions - The query options object containing the orderBy property.
     * @returns {Record<string, IResourceQueryOptionsOrderDirection>} A normalized object suitable for TypeORM's `order` option.
     *
     * @example
     * ```typescript
     * normalizeOrderBy({ lastName: 'ASC', firstName: 'DESC' });
     * // Output: { lastName: 'ASC', firstName: 'DESC' }
     * 
     * normalizeOrderBy({ age: 'asc', createdAt: 'DESC' });
     * // Output: { age: 'ASC', createdAt: 'DESC' }
     * 
     * normalizeOrderBy({ name: ['ASC', 'DESC'] });
     * // Output: { name: 'ASC' } (if you provide multiple directions for the same field)
     * ```
     */
    static normalizeOrderBy(orderBy?: IResourceQueryOptions<any>["orderBy"]): Record<string, IResourceQueryOptionsOrderDirection> {
        if (!orderBy) return {}
        if (isNonNullString(orderBy)) {
            return { [orderBy]: 'ASC' };
        }
        if (Array.isArray(orderBy)) {
            const r: Record<string, IResourceQueryOptionsOrderDirection> = {};
            orderBy.map((o) => {
                if (isObj(o)) {
                    const [field, dir] = Object.entries(o)[0];
                    if (!isNonNullString(field)) return;
                    r[field] = String(dir).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
                }
            });
            return r;
        }
        if (!isObj(orderBy)) return {};
        const normalizedOrder: Record<string, IResourceQueryOptionsOrderDirection> = {};
        for (const [field, direction] of Object.entries(orderBy)) {
            if (!isNonNullString(field)) continue;
            let normalizedDirection: IResourceQueryOptionsOrderDirection;
            // Handle array of directions (if provided)
            if (Array.isArray(direction)) {
                normalizedDirection = String(direction[0]).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            } else {
                normalizedDirection = String(direction).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            }
            normalizedOrder[field] = normalizedDirection;
        }
        return normalizedOrder;
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

    /***
     * Paginates the result based on the provided options.
     * @param {DataType[]} data - The data to paginate.
     * @param {number} count - The total count of the data.
     * @param {IResourceQueryOptions} options - The pagination options.
     * @returns {IResourcePaginatedResult<DataType>} The paginated result.
     */
    static paginate<DataType extends IResourceData = any>(data: DataType[], count: number, options?: IResourceQueryOptions) {
        const { limit, page, skip } = ResourcePaginationHelper.normalizePagination(options);
        const meta: IResourcePaginatedResult<DataType>["meta"] = {
            total: count,
        }
        if (typeof limit === "number" && limit > 0 && typeof page === "number" && page >= 0) {
            meta.currentPage = page;
            meta.pageSize = limit;
            meta.totalPages = Math.ceil(count / limit);
            meta.hasNextPage = meta.currentPage < meta.totalPages;
            meta.hasPreviousPage = meta.currentPage > 1;
            meta.nextPage = meta.hasNextPage ? meta.currentPage + 1 : undefined;
            meta.previousPage = meta.hasPreviousPage ? meta.currentPage - 1 : undefined;
            meta.lastPage = meta.totalPages;
        }
        return {
            data,
            total: count,
            meta,
        }
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
    static parseQueryOptions<T extends IResourceData = IResourceData>(req: { url: string, headers: Record<string, any>, params: Record<string, any> }): IResourceQueryOptions<T> & { queryParams: Record<string, any>, } {
        const queryParams = Object.assign({}, req?.params, getQueryParams(req?.url));
        const xFilters = Object.assign({}, req?.headers["x-filters"]);
        const limit = defaultVal(parseNumber(queryParams.limit), parseNumber(xFilters.limit));
        const skip = defaultVal(parseNumber(queryParams.skip), parseNumber(xFilters.skip));
        const page = defaultVal(parseNumber(queryParams.page), parseNumber(xFilters.page));
        const result: IResourceQueryOptions<T> = ResourcePaginationHelper.normalizePagination({ limit, skip, page });
        const distinct = defaultVal(queryParams.distinct, xFilters.distinct);
        if (typeof distinct === "boolean" || Array.isArray(distinct) && distinct.length) {
            result.distinct = distinct;
        }
        const defaultOrderBy = defaultVal(queryParams.orderBy, xFilters.orderBy);
        const orderBy = ResourcePaginationHelper.normalizeOrderBy(defaultOrderBy);
        if (orderBy) {
            (result as any).orderBy = orderBy;
        }
        const include = defaultArray<any>(queryParams.include, xFilters.include);
        if (include.length) {
            result.include = include as any;
        }
        const cache = defaultVal(queryParams.cach, xFilters.cache);
        if (cache !== undefined) {
            result.cache = !!cache;
        }
        const cacheTTL = defaultVal(queryParams.cacheTTL, xFilters.cacheTTL);
        if (cacheTTL !== undefined) {
            result.cacheTTL = cacheTTL;
        }
        const where = defaultArrayOrStringOrObject(queryParams.where, xFilters.where);
        if (isObj(where) && Object.getSize(where, true)) {
            result.where = where;
        }
        const includeDeleted = defaultVal(queryParams.includeDeleted, xFilters.includeDeleted);
        if (typeof includeDeleted === "boolean") {
            result.includeDeleted = includeDeleted;
        }
        const relations = defaultArray(queryParams.relations, xFilters.relations);
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
}