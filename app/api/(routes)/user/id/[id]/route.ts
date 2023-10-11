import { getUserById } from "@/app/api/_store/controllers/users/getUserById";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    let result = await getUserById(id);

    return !result.error
        ? NextResponse.json(result)
        : NextResponse.json(result, { status: result.errorStatus ?? 500 });
}
