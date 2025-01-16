import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const PrimaryKeys = createParamDecorator(
    (entity: Function, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const keys = request.params.keys.split('/');
        const primaryKeys = getPrimaryKeys(entity);
        if (keys.length !== primaryKeys.length) {
            throw new Error('Invalid number of primary key values');
        }
        const conditions = {};
        primaryKeys.forEach((key, index) => {
            (conditions as any)[key] = keys[index];
        });
        return conditions;
    },
);

export function getPrimaryKeys(entity: any): string[] {
    console.log(entity, " is entity");
    return [];
}