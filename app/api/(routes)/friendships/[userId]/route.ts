import { NextRequest, NextResponse } from "next/server";
import { getFriendships } from "../../../_store/controllers/friendships/getFriendships";

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    const { userId } = params;
    const data = await getFriendships({ userId });

    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, {
              status: data.errorStatus ?? 500,
          });
}
