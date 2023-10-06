import { getUsersByStringSearch } from "@/app/api/_store/controllers/users/getUsersByStringSearch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { query: string } }
) {
    const { query } = params;
    let result = await getUsersByStringSearch(query);

    return !result.error
        ? NextResponse.json(result)
        : NextResponse.json(result, { status: result.errorStatus ?? 500 });
}

export async function POST(
    req: NextRequest,
    { params }: { params: { query: string } }
) {
    const { query } = params;
    const options = await req.json();

    let result = await getUsersByStringSearch(query, options);

    return !result.error
        ? NextResponse.json(result)
        : NextResponse.json(result, { status: result.errorStatus ?? 500 });
}
