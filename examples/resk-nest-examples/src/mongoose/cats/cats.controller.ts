import { IClassConstructor } from "@resk/core/types";
import { ResourceController } from "@resk/nest";
import { CatDto } from "./cats.dto";
import { Controller } from "@nestjs/common";
import { CatsService } from "./cats.service";

@Controller("cats")
export class CatsController extends ResourceController<CatDto, CatsService> {
    constructor(protected readonly service: CatsService) {
        super(service);
    }
    getCreateDtoClass(): IClassConstructor<Partial<CatDto>> {
        return CatDto;
    }
    getUpdateDtoClass(): IClassConstructor<Partial<CatDto>> {
        return CatDto;
    }
}
