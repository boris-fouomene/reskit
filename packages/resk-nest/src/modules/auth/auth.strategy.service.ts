
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy, AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { i18n, isNonNullString } from '@resk/core';
import 'reflect-metadata';

const STRATEGIES_KEY = Symbol('auth:startegies-keys');

export function AuthStrategy(name: string): ClassDecorator {
    return (target) => {
        AuthStrategyService.register(name, target);
    };
}


@Injectable()
export class AuthStrategyService {
    private strategies: Map<string, typeof PassportStrategy> = new Map();
    static STRAGEGY_NAME = 'resk-next-auth';
    getStrategies(): Map<string, typeof PassportStrategy> {
        if (this.strategies.size <= 0) {
            this.strategies = AuthStrategyService.loadStrategies();
        }
        return this.strategies;
    }
    getStrategy(name: string): typeof PassportStrategy {
        if (!isNonNullString(name)) throw new Error("Strategy name is not defined");
        const strategies = this.getStrategies();
        if (!strategies.has(name)) throw new UnauthorizedException(i18n.t("auth.tartegyNameNotFound", { strategyName: name }));
        const strategy = strategies.get(name);
        if (!strategy || typeof strategy !== 'function') {
            throw new UnauthorizedException(i18n.t("auth.invalidStrategy", { strategyName: name }));
        }
        return strategy;
    }
    // Load loadedStrategies registered using the decorator
    public static loadStrategies(): Map<string, typeof PassportStrategy> {
        const registeredStrategies = AuthStrategyService.getDecoratedStrategies();
        const loadedStrategies = new Map<string, typeof PassportStrategy>();
        for (const name in registeredStrategies) {
            try {
                const target = registeredStrategies[name];
                const strategyInstance = new (target as any)();
                loadedStrategies.set(name, strategyInstance);
            } catch (error) {
                console.error(`Error loading strategy ${name}:`, error);
            }
        }
        return loadedStrategies;
    }
    static register(name: string, target: Function): Record<string, typeof PassportStrategy> {
        const loadedStrategies = Object.assign({}, Reflect.getMetadata(STRATEGIES_KEY, AuthStrategyService));
        loadedStrategies[name] = target;
        Reflect.defineMetadata(STRATEGIES_KEY, loadedStrategies, global);
        return loadedStrategies;
    }
    static getDecoratedStrategies(): Record<string, typeof PassportStrategy> {
        return Object.assign({}, Reflect.getMetadata(STRATEGIES_KEY, AuthStrategyService))
    }
}

@Injectable()
export class AuthGuard extends PassportAuthGuard(AuthStrategyService.STRAGEGY_NAME) {
    constructor(private strategyManager: AuthStrategyService) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const strategyName = request.body.strategy || request.query.strategy;
        this.strategyManager.getStrategy(strategyName);
        // Pass the strategy name to the context for use in validate methods
        request.strategy = strategyName;
        return super.canActivate(context) as Promise<boolean>;
    }
}