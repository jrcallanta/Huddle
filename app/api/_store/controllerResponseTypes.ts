import { InviteType, UserType } from "@/types";

interface Response {
    message: string;
    error?: Error;
    errorStatus?: number;
}

// USERS
export interface GetUserResponse extends Response {
    user?: UserType;
    users?: UserType[];
}

export interface PostNewUserResponse extends Response {
    newUser?: UserType;
}

export interface PatchUserResponse extends Response {
    updatedUser?: UserType;
}

// INVITES
export interface GetInvitesResponse extends Response {
    invites?: InviteType[];
}

export interface PostNewInviteResponse extends Response {
    newInvite?: InviteType;
}

export interface PatchInviteResponse extends Response {
    updatedInvite?: InviteType;
}
