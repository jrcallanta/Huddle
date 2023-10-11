import { createNewUser } from "@/app/api/_store/controllers/users/createNewUser";
import { editExistingUser } from "@/app/api/_store/controllers/users/editExistingUser";
import { getAllUsers } from "@/app/api/_store/controllers/users/getAllUsers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const data = await getAllUsers();
    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, { status: data.errorStatus ?? 500 });
}

export async function POST(req: Request) {
    const body = await req.json();
    const data = await createNewUser(body);
    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, { status: data.errorStatus ?? 500 });
}

export async function PATCH(req: Request) {
    const { userId, ...changes } = await req.json();
    const data = await editExistingUser(userId, changes);
    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, { status: data.errorStatus ?? 500 });
}
