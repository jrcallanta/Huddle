import { deleteHuddle } from "@/app/api/_store/controllers/huddles/deleteHuddle";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { huddleId: string } }
) {
    const { huddleId } = params;

    const data = await deleteHuddle({ huddleId: huddleId });

    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, { status: data.errorStatus ?? 500 });
}
