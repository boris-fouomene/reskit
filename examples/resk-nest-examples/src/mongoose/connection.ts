import { MongooseResourceModule } from "@resk/nest";

export const ConnectionModule = MongooseResourceModule.forRoot(
    process.env.MONGO_URI || ""
);