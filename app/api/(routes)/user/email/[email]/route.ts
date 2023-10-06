import { getUserByEmail } from "@/app/api/_store/controllers/users/getUserByEmail";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { email: string } }
) {
    const { email } = params;

    let result = await getUserByEmail(email);

    return !result.error
        ? NextResponse.json(result)
        : NextResponse.json(result, { status: result.errorStatus ?? 500 });
}
