import { NextRequest, NextResponse } from "next/server";
import { createNewHuddle } from "../../_store/controllers/huddles/createNewHuddle";

export async function POST(req: NextRequest) {
    let body = await req.json();
    let data = await createNewHuddle(body);

    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, { status: data.errorStatus ?? 500 });
}
