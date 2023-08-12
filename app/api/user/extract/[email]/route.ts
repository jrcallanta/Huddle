import { pullUserName } from "@/tools/pullUserName";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { email: string } }
) {
    const { email } = params;

    return NextResponse.json({ username: pullUserName(email) });
}
