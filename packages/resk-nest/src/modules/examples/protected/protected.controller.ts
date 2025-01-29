import { IClassConstructor } from "@resk/core";
import { User } from "src/modules/examples/typeorm/users/entities/user.entity";
import { ResourceController } from "src/modules/resource";
import { ProtectedService } from "./protected.service";
import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../../auth";

@Controller('protected')
export class ProtectedController extends ResourceController<User, ProtectedService> {
    constructor(protected readonly resourceService: ProtectedService) {
        super(resourceService);
    }
    @UseGuards(AuthGuard)
    @Post()
    async create(createResourceDto: Partial<User>) {
        return super.create(createResourceDto);
    }
    getCreateDtoClass(): IClassConstructor<Partial<User>, any[]> {
        throw new Error("Method not implemented.");
    }
    getUpdateDtoClass(): IClassConstructor<Partial<User>, any[]> {
        throw new Error("Method not implemented.");
    }
}