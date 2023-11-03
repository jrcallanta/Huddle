import { NextRequest, NextResponse } from "next/server";
import { editExistingInvite } from "@/app/api/_store/controllers/invites/editExistingInvite";
import { createNewInvite } from "@/app/api/_store/controllers/invites/createNewInvites";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const data = await editExistingInvite(body);

    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, { status: data.errorStatus ?? 500 });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const data = await createNewInvite(body);

    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, { status: data.errorStatus ?? 500 });
}
