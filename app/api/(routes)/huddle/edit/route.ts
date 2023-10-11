import { NextRequest, NextResponse } from "next/server";
import { editExistingHuddle } from "../../_store/controllers/huddles/editExistingHuddle";

export async function PATCH(req: NextRequest) {
    const body = await req.json();
    const data = await editExistingHuddle(body);

    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, { status: data.errorStatus ?? 500 });
}
