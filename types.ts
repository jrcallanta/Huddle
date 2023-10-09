export interface LocationType {
    display?: String;
    coordinates: {
        lat: number;
        lng: number;
    };
}
export interface HuddleType {
    _id: string;
    author_id: string;
    author: UserType;
    title: string;
    description?: string;
    location?: LocationType;
    start_time: Date;
    end_time?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface HuddleTypeForTile extends HuddleType {
    invite_list?: InviteType[]; // joined on retrieval
    invite_status?: string;
}

export interface InviteType {
    huddle_id: string;
    user_id?: string;
    user?: UserType;
    status: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserType {
    _id: string;
    email?: string;
    name: string;
    username: string;
    imgUrl?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserTypeForTile extends UserType {
    friendStatus: string;
    friendRequester?: boolean;
    inviteStatus?: string;
}

export interface FriendshipType {
    _id?: string;
    status: string;
    fromUserId?: string;
    toUserId?: string;
    fromUser?: UserType;
    toUser?: UserType;
    created_at?: Date;
    updated_at?: Date;
}
export enum FRIENDSHIP_STATUS {
    pending = "PENDING",
    friends = "FRIENDS",
}
