import { getHuddlesByInvited } from "@/app/api/_store/controllers/huddles/getHuddlesByInvited";
import { getHuddlesByOwner } from "@/app/api/_store/controllers/huddles/getHuddlesByOwner";
import { getHuddlesByRelevance } from "@/app/api/_store/controllers/huddles/getHuddlesByRelevance";
import { HuddleType, HuddleTypeForTile } from "@/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { searchkey: string; searchval: string } }
) {
    const { searchkey, searchval } = params;
    console.log(searchkey, searchval);

    let huddles: HuddleTypeForTile[];
    switch (searchkey) {
        case "owner": {
            huddles = await getHuddlesByOwner(searchval);
            break;
        }
        case "invited": {
            huddles = await getHuddlesByInvited(searchval);
            break;
        }
        case "relevant": {
            huddles = await getHuddlesByRelevance(searchval);
            break;
        }
        default:
            huddles = [];
    }

    return NextResponse.json({
        message: "Succesfully retrieved huddles",
        huddles: huddles,
    });
}
