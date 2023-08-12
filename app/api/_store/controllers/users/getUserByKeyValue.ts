import { GetUserResponse } from "@/app/api/_store/controllerResponseTypes";
import { getUserByEmail } from "./getUserByEmail";
import { getUserById } from "./getUserById";

export const getUserByKeyValue: (
    searchKey: string,
    searchVal: string
) => Promise<GetUserResponse> = async (searchKey, searchVal) => {
    let response: GetUserResponse;

    switch (searchKey.toLowerCase()) {
        case "email": {
            response = await getUserByEmail(searchVal);
            break;
        }
        case "id": {
            response = await getUserById(searchVal);
            break;
        }
        default:
            response = {
                message: "Invalid key value pair",
                error: Error("InvalidInputError"),
            };
    }

    return response;
};
