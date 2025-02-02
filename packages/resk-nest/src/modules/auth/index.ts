
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy, AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { defaultStr, i18n, IClassConstructor, isNonNullString, isObj } from '@resk/core';
import 'reflect-metadata';

export * from "./permission.guard";

const STRATEGIES_KEY = Symbol('auth:startegies-keys');

/**
 * Represents the type for strategy names, which can be either a single string or an array of strings.
 */
type IStrategyName = string | string[];

/**
 * A decorator function to register an authentication strategy.
 * 
 * @param name - The name or names of the strategy. Can be a single string or an array of strings.
 * @returns A class decorator that registers the strategy with the provided name(s).
 * 
 * @example
 * ```typescript
 * @AuthStrategy('jwt')
 * class JwtStrategy extends PassportStrategy(Strategy) {
 *   constructor() {
 *     super({
 *       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
 *       secretOrKey: 'secretKey',
 *     });
 *   }
 * 
 *   async validate(payload: any) {
 *     return { userId: payload.sub, username: payload.username };
 *   }
 * }
 * ```
 */
export function AuthStrategy(name: string | string[]): ClassDecorator {
    return (target: Function) => {
        AuthGuard.registerStrategy(name, target);
    };
}

/**
 * @interface IAuthStrategyMetaData
 * Represents metadata for an authentication strategy.
 * 
 * This interface is used to store information about an authentication strategy, including its name and the strategy itself.
 * 
 * @template T - The type of the strategy constructor. This should be a class constructor that extends the base strategy class.
 * @template TUser - The type of the user object returned by the strategy after validation.
 * @template TValidationResult - The type of the validation result, which can be a user object, `false`, or `null`.
 * 
 * @example
 * ```typescript
 * const jwtStrategyMetadata: IAuthStrategyMetaData = {
 *   name: 'jwt',
 *   strategy: JwtStrategy,
 * };
 * 
 * console.log(jwtStrategyMetadata.name); // Output: 'jwt'
 * ```
 */
export interface IAuthStrategyMetaData<T extends IClassConstructor = any, TUser = unknown, TValidationResult = TUser | false | null> {
    /**
     * The name or names of the authentication strategy.
     * 
     * This can be a single string (e.g., `'jwt'`) or an array of strings (e.g., `['jwt', 'oauth2']`).
     * 
     * @example
     * ```typescript
     * const strategyMetadata: IAuthStrategyMetaData = {
     *   name: ['jwt', 'oauth2'],
     *   strategy: new MultiStrategy(),
     * };
     * ```
     */
    name: IStrategyName;

    /**
     * The authentication strategy instance.
     * 
     * This is the actual strategy object that implements the authentication logic.
     * It is typically an instance of a class that extends `PassportStrategy`.
     * 
     * @example
     * ```typescript
     * const strategyMetadata: IAuthStrategyMetaData = {
     *   name: 'jwt',
     *   strategy: new JwtStrategy(),
     * };
     * ```
     */
    strategy: ReturnType<typeof PassportStrategy<T, TUser, TValidationResult>>;
}


/**
 * A guard class for handling authentication in the NestJS applications.
 * 
 * This class implements the `CanActivate` interface and is responsible for determining
 * whether a request is authorized based on the specified authentication strategy.
 * 
 * @example
 * ```typescript
 * @UseGuards(AuthGuard)
 * @Controller('auth')
 * export class AuthController {
 *   @Post('login')
 *   async login() {
 *     return 'Logged in successfully!';
 *   }
 * }
 * ```
 */
@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * Converts a strategy name or array of names into a string.
     * 
     * @param name - The name or names of the strategy.
     * @returns A string representation of the strategy name(s).
     * 
     * @example
     * ```typescript
     * const nameString = AuthGuard.stringifyName(['jwt', 'oauth2']);
     * console.log(nameString); // Output: 'jwt:::oauth2'
     * ```
     */
    static stringifyName(name: string | string[]): string {
        if (Array.isArray(name)) {
            return name.join(':::');
        }
        return defaultStr(name);
    }

    /**
     * Validates whether the provided strategy metadata is valid.
     * 
     * @param strategyMetadata - The strategy metadata to validate.
     * @returns `true` if the strategy metadata is valid, otherwise `false`.
     * 
     * @example
     * ```typescript
     * const isValid = AuthGuard.isValidStrategy({ name: 'jwt', strategy: JwtStrategy });
     * console.log(isValid); // Output: true
     * ```
     */
    static isValidStrategy(strategyMetadata?: IAuthStrategyMetaData): boolean {
        if (!strategyMetadata || !isObj(strategyMetadata)) return false;
        if (!isNonNullString(strategyMetadata.name) && (!Array.isArray(strategyMetadata.name) || !strategyMetadata.name.length)) return false;
        const { strategy } = strategyMetadata;
        return typeof strategy === 'function';
    }

    /**
     * Retrieves the authentication strategy metadata by name.
     * 
     * @param name - The name or names of the strategy to retrieve.
     * @returns The strategy metadata.
     * @throws UnauthorizedException if the strategy is invalid or not found.
     * 
     * @example
     * ```typescript
     * const strategyMetadata = AuthGuard.getStrategy('jwt');
     * console.log(strategyMetadata.name); // Output: 'jwt'
     * ```
     */
    public static getStrategy<T extends IClassConstructor = any, TUser = unknown, TValidationResult = TUser | false | null>(name?: IStrategyName): IAuthStrategyMetaData<T, TUser, TValidationResult> {
        const strategies = this.getStrategies();
        const keys = Object.keys(strategies);
        const nameStringify = this.stringifyName(name as string | string[]);
        if (!nameStringify) {
            if (keys.length === 1) {
                const strategyWithName = strategies[keys[0]];
                if (this.isValidStrategy(strategyWithName)) {
                    return strategyWithName;
                }
            }
            throw new UnauthorizedException(i18n.t("auth.invalidStrategyName"));
        }
        const strategy2Guard = strategies[nameStringify];
        if (!strategy2Guard) {
            throw new UnauthorizedException(i18n.t("auth.strategyNameNotFound", { strategyName: nameStringify }));
        }
        return strategy2Guard;
    }

    /**
     * Registers a new authentication strategy with the given name(s).
     * 
     * @param {string | string[]} name  - The name or names of the strategy to register.
     * @param {Function} target - The strategy class to register.
     * @returns {Record<string,IAuthStrategyMetaData>} All registered strategies.
     * 
     * @example
     * ```typescript
     * AuthGuard.registerStrategy('jwt', JwtStrategy);
     * ```
     */
    static registerStrategy(name: string | string[], target: Function): Record<string, IAuthStrategyMetaData> {
        const loadedStrategies = Object.assign({}, Reflect.getMetadata(STRATEGIES_KEY, AuthGuard));
        const nameStringify = this.stringifyName(name);
        loadedStrategies[nameStringify] = {
            strategy: target,
            name: name,
        };
        Reflect.defineMetadata(STRATEGIES_KEY, loadedStrategies, AuthGuard);
        return loadedStrategies;
    }

    /**
     * Retrieves all registered authentication strategies.
     * 
     * @returns An object containing all registered strategies.
     * 
     * @example
     * ```typescript
     * const strategies = AuthGuard.getStrategies();
     * console.log(strategies); // Output: { 'jwt': { name: 'jwt', strategy: [Function: JwtStrategy] } }
     * ```
     */
    static getStrategies(): Record<string, IAuthStrategyMetaData> {
        return Object.assign({}, Reflect.getMetadata(STRATEGIES_KEY, AuthGuard));
    }

    /**
     * Determines whether the request is authorized based on the specified strategy.
     * 
     * @param context - The execution context.
     * @returns A boolean indicating whether the request is authorized.
     * @throws UnauthorizedException if the request is not authorized.
     * 
     * @example
     * ```typescript
     * const canActivate = await authGuard.canActivate(context);
     * ```
     */
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const strategyName = defaultStr(request?.body?.strategy, request?.query?.strategy);
        const { name } = AuthGuard.getStrategy(strategyName);
        return new (PassportAuthGuard(name))().canActivate(context);
    }
}