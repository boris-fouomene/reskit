
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PassportStrategy, AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Auth, defaultStr, i18n, IClassConstructor, isNonNullString, isObj } from '@resk/core';
import 'reflect-metadata';

const STRATEGIES_KEY = Symbol('auth:startegies-keys');
const STRAGEGY_NAME = '@resk:nest-auth-strategy';

type IStrategyName = string | string[];

export function AuthStrategy(name: string | string[]): ClassDecorator {
    return (target) => {
        AuthGuard.registerStrategy(name, target);
    };
}

export interface IAuthStrategy<T extends IClassConstructor = any, TUser = unknown, TValidationResult = TUser | false | null> extends ReturnType<typeof PassportStrategy<T, TUser, TValidationResult>> { }
export interface IAuthGuard extends ReturnType<typeof PassportAuthGuard> { }
export interface IAuthStrategyAndGuard<T extends IClassConstructor = any, TUser = unknown, TValidationResult = TUser | false | null> {
    name: IStrategyName;
    guard: IAuthGuard;
    strategy: IAuthStrategy<T, TUser, TValidationResult>;
}
@Injectable()
export class AuthGuard implements CanActivate {
    private static stringifyName(name: string | string[]): string {
        if (Array.isArray(name)) {
            return name.join(':::');
        }
        return defaultStr(name);
    }
    static isValidStrategy(strategyAndGuard?: IAuthStrategyAndGuard): boolean {
        if (!strategyAndGuard || !isObj(strategyAndGuard)) return false;
        if (!isNonNullString(strategyAndGuard.name) && (!Array.isArray(strategyAndGuard.name) || !strategyAndGuard.name.length)) return false;
        const { guard, strategy } = strategyAndGuard;
        return (typeof guard === "function");
    }
    static get STRAGEGY_NAME() {
        return STRAGEGY_NAME;
    };

    public static getStrategy<T extends IClassConstructor = any, TUser = unknown, TValidationResult = TUser | false | null>(name?: IStrategyName): IAuthStrategyAndGuard<T, TUser, TValidationResult> {
        const strategies = this.getStrategies();
        const keys = Object.keys(strategies);
        const nameStringify = this.stringifyName(name as string | string[]);
        if (!nameStringify) {
            if (keys.length === 1) {
                const stragey2Guard = strategies[keys[0]];
                if (this.isValidStrategy(stragey2Guard)) {
                    return stragey2Guard;
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
    static registerStrategy(name: string | string[], target: Function): IAuthStrategy {
        const loadedStrategies = Object.assign({}, Reflect.getMetadata(STRATEGIES_KEY, AuthGuard));
        const nameStringify = this.stringifyName(name);
        loadedStrategies[nameStringify] = {
            strategy: target,
            name: name,
            guard: PassportAuthGuard(name)
        };
        Reflect.defineMetadata(STRATEGIES_KEY, loadedStrategies, AuthGuard);
        return loadedStrategies;
    }
    static getStrategies(): Record<string, IAuthStrategyAndGuard> {
        return Object.assign({}, Reflect.getMetadata(STRATEGIES_KEY, AuthGuard))
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const strategyName = defaultStr(request?.body?.strategy, request?.query?.strategy);
        const strategy2Guard = AuthGuard.getStrategy(strategyName);
        // Pass the strategy name to the context for use in validate methods
        //request.strategy = strategy2Guard.name;
        const guardInstance = new strategy2Guard.guard();
        console.log(guardInstance, " is qggggggggggg ", guardInstance.canActivate, guardInstance.constructor)
        return guardInstance.canActivate(context) as Promise<boolean>;
    }
}