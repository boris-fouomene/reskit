import "../utils";
import { ResourcePaginationHelper } from "./ResourcePaginationHelper";

describe("ResourcePaginationHelper", () => {
    describe("getPaginationMetaData", () => {
        it("should return correct metadata for valid pagination options", () => {
            const count = 100;
            const queryOptions = { limit: 10, page: 2 };
            const meta = ResourcePaginationHelper.getPaginationMetaData(count, queryOptions);

            expect(meta).toEqual({
                total: 100,
                currentPage: 2,
                pageSize: 10,
                totalPages: 10,
                hasNextPage: true,
                hasPreviousPage: true,
                nextPage: 3,
                previousPage: 1,
                lastPage: 10,
            });
        });

        it("should handle cases where limit or page is not provided", () => {
            const count = 50;
            const queryOptions = {};
            const meta = ResourcePaginationHelper.getPaginationMetaData(count, queryOptions);

            expect(meta).toEqual({
                total: 50,
            });
        });

        it("should handle cases where count is not a number", () => {
            const count = null;
            const queryOptions = { limit: 10, page: 1 };
            const meta = ResourcePaginationHelper.getPaginationMetaData(count as any, queryOptions);

            expect(meta).toEqual({
                total: 0,
                currentPage: 1,
                pageSize: 10,
                totalPages: 0,
                hasNextPage: false,
                hasPreviousPage: false,
                nextPage: undefined,
                previousPage: undefined,
                lastPage: 0,
            });
        });
    });

    describe("paginate", () => {
        it("should return paginated data with correct metadata", () => {
            const data = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
            const count = 100;
            const queryOptions = { limit: 10, page: 2 };
            const result = ResourcePaginationHelper.paginate(data, count, queryOptions);
            expect(result).toEqual({
                data: data.slice(10, 20),
                total: 100,
                meta: {
                    total: 100,
                    currentPage: 2,
                    pageSize: 10,
                    totalPages: 10,
                    hasNextPage: true,
                    hasPreviousPage: true,
                    nextPage: 3,
                    previousPage: 1,
                    lastPage: 10,
                },
            });
        });

        it("should handle empty data arrays", () => {
            const data: any[] = [];
            const count = 0;
            const queryOptions = { limit: 10, page: 1 };

            const result = ResourcePaginationHelper.paginate(data, count, queryOptions);

            expect(result).toEqual({
                data: [],
                total: 0,
                meta: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false,
                    nextPage: undefined,
                    previousPage: undefined,
                    lastPage: 0,
                },
            });
        });

        it("should handle cases where pagination options are not provided", () => {
            const data = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
            const count = 50;
            const result = ResourcePaginationHelper.paginate(data, count);
            expect(result).toEqual({
                data,
                total: 50,
                meta: {
                    total: 50,
                },
            });
        });
    });
});