import {
    FindOperator,
    MoreThan,
    MoreThanOrEqual,
    LessThan,
    LessThanOrEqual,
    Like,
    ILike,
    In,
    Not,
    IsNull,
    Raw,
} from "typeorm";

class MongoToTypeOrm {
    /**
     * Converts MongoDB query operators to TypeORM FindOperators
     */
    private static operatorMap = {
        $eq: (value: any) => value,
        $gt: (value: any) => MoreThan(value),
        $gte: (value: any) => MoreThanOrEqual(value),
        $lt: (value: any) => LessThan(value),
        $lte: (value: any) => LessThanOrEqual(value),
        $ne: (value: any) => Not(value),
        $in: (value: any[]) => In(value),
        $nin: (value: any[]) => Not(In(value)),
        $regex: (value: string, options?: string) => {
            const pattern = `%${value}%`;
            return options?.includes('i') ? ILike(pattern) : Like(pattern);
        },
        $exists: (value: boolean) => value ? Not(IsNull()) : IsNull(),
    };

    /**
     * Main conversion method
     */
    static convert(mongoQuery: any): any {
        // Handle empty query
        if (!mongoQuery || Object.keys(mongoQuery).length === 0) {
            return {};
        }

        const whereConditions: any[] = [];
        const andConditions: any = {};

        // Process each key in the query
        for (const [key, value] of Object.entries(mongoQuery)) {
            if (key === '$or' && Array.isArray(value)) {
                // Handle OR conditions
                const orConditions = value.map((condition: any) => {
                    return this.processCondition(condition);
                });
                whereConditions.push(...orConditions);
            } else if (key === '$and' && typeof value === 'object') {
                // Handle AND conditions
                (value as any).forEach((condition: any) => {
                    const processed = this.processCondition(condition);
                    Object.assign(andConditions, processed);
                });
            } else {
                // Handle regular field conditions
                const processed = this.processCondition({ [key]: value });
                Object.assign(andConditions, processed);
            }
        }

        // Combine AND conditions with OR conditions
        if (Object.keys(andConditions).length > 0) {
            whereConditions.push(andConditions);
        }

        // Return array for multiple conditions, object for single condition
        return whereConditions.length > 1 ? whereConditions : whereConditions[0] || andConditions;
    }

    /**
     * Process individual conditions
     */
    private static processCondition(condition: any): any {
        const result: any = {};

        for (const [field, value] of Object.entries(condition)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Handle operator objects
                const operators = Object.keys(value);
                if (operators.some(op => op.startsWith('$'))) {
                    result[field] = this.convertOperators(value);
                } else {
                    // Handle nested objects
                    result[field] = value;
                }
            } else {
                // Handle direct values
                result[field] = value;
            }
        }

        return result;
    }

    /**
     * Convert MongoDB operators to TypeORM operators
     */
    private static convertOperators(operatorObj: any): any {
        for (const [operator, value] of Object.entries(operatorObj)) {
            if (operator in this.operatorMap) {
                if (operator === '$regex') {
                    return this.operatorMap[operator](value as any, operatorObj.$options);
                }
                return this.operatorMap[operator as keyof typeof this.operatorMap](value);
            }
        }
        return operatorObj;
    }
}

// Test cases
const testCases = [
    // Test Case 1: Mixed AND/OR
    {
        name: "Mixed AND/OR",
        query: {
            $and: [{ id: 2, name: 'boris' }],
            $or: [{ id: 8 }, { name: 'test' }]
        }
    },

    // Test Case 2: Nested operators
    {
        name: "Nested operators",
        query: {
            age: { $gte: 21, $lte: 30 },
            status: "active"
        }
    },

    // Test Case 3: Complex nested query
    {
        name: "Complex nested",
        query: {
            $and: [
                { age: { $gt: 20 } },
                { status: "active" }
            ],
            $or: [
                { role: "admin" },
                { permissions: { $in: ["read", "write"] } }
            ]
        }
    },

    // Test Case 4: Deep nested fields
    {
        name: "Deep nested fields",
        query: {
            "user.profile.age": { $gte: 18 },
            "user.status": "active",
            $or: [
                { "user.role": "admin" },
                { "user.permissions": { $in: ["read", "write"] } }
            ]
        }
    }
];

// Run tests
console.log("MongoDB to TypeORM Query Converter Tests\n");
testCases.forEach((test, index) => {
    console.log(`Test ${index + 1}: ${test.name}`);
    console.log('MongoDB Query:', JSON.stringify(test.query, null, 2));
    console.log('TypeORM Result:', JSON.stringify(MongoToTypeOrm.convert(test.query), null, 2));
    console.log('---\n');
});

// Example usage
const mongoQuery = {
    $and: [{ id: 2, name: 'boris' }],
    $or: [{ id: 8 }, { name: 'test' }]
};

const typeormQuery = MongoToTypeOrm.convert(mongoQuery);
console.log('Example Query Result:', JSON.stringify(typeormQuery, null, 2));


///***************IWhereCondition 
type FlattenKeys<T, Prefix extends string = '', Depth extends number[] = []> =
    Depth['length'] extends 10 // Limit depth to avoid infinite recursion
    ? never
    : {
        [K in keyof T]: T[K] extends object
        ? FlattenKeys<T[K], `${Prefix}${K & string}.`, [...Depth, 1]>
        : `${Prefix}${K & string}`;
    }[keyof T];

// TypeORM-style where condition type
type TypeOrmWhere<T> = {
    [K in FlattenKeys<T>]?: string | number | boolean | object;
};

// Example nested object
type User1 = {
    id: number;
    name: string;
    profile: {
        age: number;
        address: {
            city: string;
            country: string;
        };
    };
};

// Example usage
const whereCondition: TypeOrmWhere<User1> = {
    id: 1,
    name: "John",
    "profile.age": 25,
    "profile.address.city": "New York",
};


/**** Mango final type***********/
// Recursive type for handling nested objects
type Nested<T> = {
    [P in keyof T]: T[P] extends object
    ? T[P] | Nested<T[P]> | { [key in MongoOperator]?: any }
    : T[P] | { [key in MongoOperator]?: any };
}

type MongoQuery<T> = {
    [P in keyof T]?: T[P] extends object
    ? Nested<T[P]> | { [key: string]: any }
    : T[P] | { [key in MongoOperator]?: any };
} & {
    $and?: MongoQuery<T>[];
    $or?: MongoQuery<T>[];
    $nor?: MongoQuery<T>[];
    $not?: MongoQuery<T>;
}

type MongoOperator =
    | '$eq'
    | '$gt'
    | '$gte'
    | '$in'
    | '$lt'
    | '$lte'
    | '$ne'
    | '$nin'
    | '$exists'
    | '$regex';

// Example with nested objects
interface User {
    id: number;
    name: string;
    profile: {
        age: number;
        address: {
            city: string;
            country: string;
        };
        social: {
            twitter?: string;
            facebook?: string;
        };
    };
    settings: {
        notifications: boolean;
        theme: string;
    };
}

// Now these are all valid queries:
const query1: MongoQuery<User> = {
    name: "John",
    // Nested object with direct values
    profile: {
        age: 25,
        address: {
            city: "New York"
        }
    }
};

const query2: MongoQuery<User> = {
    // Nested object with operators
    profile: {
        age: { $gte: 25 },
        address: {
            city: { $in: ["New York", "London"] }
        }
    }
};

/*const query3: MongoQuery<User1> = {
    // Mixed nested and dot notation
    name: "John",
    "profile.age": { $gte: 25 },
    "profile.address": {
        city: "New York"
    }
};*/
