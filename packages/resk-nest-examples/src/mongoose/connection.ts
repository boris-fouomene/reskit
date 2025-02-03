import { MongooseResourceModule } from "@resk/nest";

export const ConnectionModule = MongooseResourceModule.forRoot(
    process.env.MONGO_URI ||
    "mongodb+srv://borisfouomen14:W5uPEPOg2jugRA7E@cluster0.xd93nhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
        name: "connection",
    }
);