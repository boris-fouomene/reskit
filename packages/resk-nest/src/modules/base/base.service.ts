import { Injectable } from "@nestjs/common";

@Injectable()
export class BaseService<DataType = any> {
    constructor() {}
}