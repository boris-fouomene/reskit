import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { applyLanguage } from './utils';
import { I18n } from '@resk/core';

@Injectable()
export class I18nMiddleware implements NestMiddleware {
    constructor(@Inject("I18N") private readonly i18n: I18n) { }
    async use(req: Request, res: Response, next: NextFunction) {
        await applyLanguage(this.i18n, req);
        next();
    }
}