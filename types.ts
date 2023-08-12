export interface HuddleType {
    _id: string;
    created_at: Date;
    author_id: string;
    author?: UserType;
    title: string;
    description?: string;
    location?: LocationType;
    start_time: Date;
    end_time?: Date;
}

export interface LocationType {
    display?: String;
    coordinates: [Number, Number];
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
    created_at: Date;
}

export interface UserType {
    _id: string;
    email: string;
    name: string;
    username: string;
    imgUrl?: string;
}
