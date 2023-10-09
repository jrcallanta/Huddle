import { createNewFriendship } from "@/app/api/_store/controllers/friendships/createNewFriendship";
import { deleteExistingFriendship } from "@/app/api/_store/controllers/friendships/deleteExistingFriendship";
import { editExistingFriendship } from "@/app/api/_store/controllers/friendships/editExistingFriendship";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: { userId: string; otherUserId: string } }
) {
    const { userId, otherUserId } = params;

    const data = await createNewFriendship({ userId, otherUserId });

    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, {
              status: data.errorStatus ?? 500,
          });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { userId: string; otherUserId: string } }
) {
    const { userId, otherUserId } = params;
    const { changes } = await req.json();

    const data = await editExistingFriendship({ userId, otherUserId, changes });

    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, {
              status: data.errorStatus ?? 500,
          });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { userId: string; otherUserId: string } }
) {
    const { userId, otherUserId } = params;

    console.log(userId, otherUserId);

    if (!otherUserId)
        return NextResponse.json({
            message: "Could not delete friendship.",
            error: "Other user id not provided",
            status: 400,
        });

    const data = await deleteExistingFriendship({
        userId,
        otherUserId: otherUserId,
    });

    return !data.error
        ? NextResponse.json(data)
        : NextResponse.json(data, {
              status: data.errorStatus ?? 500,
          });
}
