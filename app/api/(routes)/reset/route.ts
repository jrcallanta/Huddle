import { NextRequest, NextResponse } from "next/server";
import { resetDB } from "../../_store/controllers/seed/resetDB";
import mongoose from "mongoose";
import { connectMongoose } from "../../_store/connectMongoose";

export async function GET(req: NextRequest) {
    console.log("resetting...");
    try {
        await connectMongoose();

        const data = await resetDB();
        return NextResponse.json({
            message: "Succesfully reset",
            data: data,
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Could not reset", data: error },
            { status: 500 }
        );
    } finally {
        await mongoose.disconnect();
    }
}
