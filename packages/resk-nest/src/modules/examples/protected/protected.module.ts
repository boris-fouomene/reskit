import { Module } from "@nestjs/common";
import { ProtectedController } from "./protected.controller";
import { ProtectedService } from "./protected.service";
import { LocalStrategy } from "./local.strategy";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";

@Module({
    imports: [AuthModule],
    controllers: [ProtectedController],
    providers: [AuthService, LocalStrategy, ProtectedService],
    exports: [ProtectedService]
})
export class ProtectedModule { }