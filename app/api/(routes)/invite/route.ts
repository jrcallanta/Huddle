import { NextRequest, NextResponse } from "next/server";
import { editExistingInvite } from "@/app/api/_store/controllers/invites/editExistingInvite";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const data = await editExistingInvite(body);

    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, { status: data.errorStatus ?? 500 });
}
