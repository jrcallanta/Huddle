import { getUserByUserName } from "@/app/api/_store/controllers/users/getUserByUserName";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { username: string } }
) {
    const { username } = params;

    let result = await getUserByUserName(username);

    return !result.error
        ? NextResponse.json(result)
        : NextResponse.json(result, { status: result.errorStatus ?? 500 });
}
