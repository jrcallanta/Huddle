import mongooseClient from "mongoose";

export const connectMongoose = () => {
    if (!process.env.DATABASE_URL) throw Error("No URL provided in .env");

    return mongooseClient.connect(process.env.DATABASE_URL);
};
