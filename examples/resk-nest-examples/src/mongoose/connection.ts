import { MongooseResourceModule } from "@resk/nest";

import { DynamicModule } from "@nestjs/common";

export const ConnectionModule: DynamicModule = MongooseResourceModule.forRoot(
    process.env.MONGO_URI || ""
);