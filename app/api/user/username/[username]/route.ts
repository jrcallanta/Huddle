import { getUserByUserName } from "@/app/api/_store/controllers/users/getUserByUserName";
import { getUsersByStringSearch } from "@/app/api/_store/controllers/users/getUsersByStringSearch";
import { getUsersByUserNameSearch } from "@/app/api/_store/controllers/users/getUsersByUserNameSearch";
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

export async function POST(
    req: NextRequest,
    { params }: { params: { username: string } }
) {
    const { username } = params;
    const { currentUser } = await req.json();

    let result = await getUsersByStringSearch({ query: username, page: 2 });

    console.log(result);

    return !result.error
        ? NextResponse.json(result)
        : NextResponse.json(result, { status: result.errorStatus ?? 500 });
}
