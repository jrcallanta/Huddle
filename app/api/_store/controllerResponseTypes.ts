import {
    FriendshipType,
    HuddleTypeForTile,
    InviteType,
    UserType,
} from "@/types";

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

// FRIENDSHIPS
export interface GetFriendshipsResponse extends Response {
    friendships?: FriendshipType[];
}

export interface PostFriendshipResponse extends Response {
    newFriendship?: FriendshipType | null;
}
export interface PatchFriendshipResponse extends Response {
    updatedFriendship?: FriendshipType | null;
}
export interface DeleteFriendshipResponse extends Response {
    deletedFriendship?: FriendshipType | null;
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

// HUDDLES
export interface DeleteHuddleResponse extends Response {
    deletedHuddle?: HuddleTypeForTile;
}
export interface PostHuddleResponse extends Response {
    newHuddle?: HuddleTypeForTile;
}
export interface PatchHuddleResponse extends Response {
    updatedHuddle?: HuddleTypeForTile;
}
