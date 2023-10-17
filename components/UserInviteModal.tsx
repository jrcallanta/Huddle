import React, { useCallback, useEffect, useState } from "react";
import { PiCaretLeftBold } from "react-icons/pi";
import { twMerge } from "tailwind-merge";
import UserInviteTile from "./UserInviteTile";
import UserTileGeneric from "./UserTileGeneric";
import { InviteType, UserType, UserTypeForTile } from "@/types";

interface UserInviteModalProps {
    currentUser: UserType | undefined;
    owner: UserTypeForTile;
    inviteList: InviteType[];
    onCloseModal: any;
}

const UserInviteModal: React.FC<UserInviteModalProps> = ({
    currentUser,
    owner,
    inviteList,
    onCloseModal,
}) => {
    const [friendsList, setFriendsList] = useState<UserTypeForTile[] | null>(
        null
    );
    const [newInviteList, setNewInviteList] = useState<UserTypeForTile[]>([]);

    useEffect(() => {
        const getFriends = async () => {
            if (currentUser)
                fetch(`/api/friendships/${currentUser._id}`)
                    .then((res) => res.json())
                    .then((data) => setFriendsList(data.friendships));
        };

        if (owner._id === currentUser?._id) getFriends();
    }, [owner, currentUser]);

    const handleToggleUserSelect = useCallback((user: UserTypeForTile) => {
        setNewInviteList((prev) => {
            let newList = [...prev];
            let index = newList.map((user) => user._id).indexOf(user._id);
            if (index < 0) newList.push(user);
            else newList.splice(index, 1);
            console.log(newList);
            return newList;
        });
    }, []);

    let usertile_cn =
        "px-4 py-2 animate-none [&_p]:text-white/75 hover:bg-white/10";
    let label_cn = "pt-2 text-sm text-white/80 font-medium uppercase";
    let options = {
        hideUsername: true,
        avatarSize: "sm" as any,
    };

    return (
        <div className='absolute w-full z-[1] top-0 bottom-0 transition-[top] p-0 gap-0 flex-col overflow-hidden overflow-y-auto bg-[var(--400)]'>
            {/* UPPER BUTTON BAR */}
            <div
                className={twMerge(
                    "flex items-center w-full bg-[var(--400)] border-b-2 border-[var(--500)]",
                    "[&_>_button]:border-inherit [&_>_button:not(:only-child):nth-child(1)]:border-r-2"
                )}
            >
                <button
                    className={
                        "flex items-center gap-2 whitespace-nowrap w-fit h-full p-4 pl-2 pr-6 font-medium text-[var(--600)] hover:text-white hover:bg-white/10"
                    }
                    onClick={() => onCloseModal()}
                >
                    <PiCaretLeftBold size={26} />
                    <span className='text-sm text-left'>back</span>
                </button>
                {newInviteList && newInviteList.length > 0 && (
                    <button
                        className={
                            "flex items-center justify-center gap-2 whitespace-nowrap w-full h-full px-2 py-4 font-medium text-[var(--600)] hover:text-white hover:bg-white/10"
                        }
                        onClick={() => onCloseModal()}
                    >
                        send invites
                    </button>
                )}
            </div>

            {/* HOSTS */}
            <div className='w-full px-4 py-2'>
                <p className={label_cn}>Hosts</p>
            </div>
            <UserTileGeneric
                user={{
                    _id: owner._id,
                    name: owner.name,
                    username: owner.username,
                    imgUrl: owner.imgUrl,
                }}
                options={options}
                className={twMerge(
                    usertile_cn,
                    "[&_>_.userAvatar]:border-2 [&_>_.userAvatar]:border-white "
                )}
            />

            {/* USERS ALREADY INVITED */}
            {inviteList.length > 0 && (
                <>
                    <div className='w-full px-4 py-2'>
                        <p className={label_cn}>Invited</p>
                    </div>
                    {inviteList
                        // .filter(
                        //     ({ status }) =>
                        //         isEditing ||
                        //         status !== "NOT_GOING"
                        // )
                        .map(({ user, status }, i) =>
                            user ? (
                                <UserInviteTile
                                    key={i}
                                    user={{
                                        ...user,
                                        inviteStatus: status,
                                    }}
                                    options={options}
                                    className={twMerge(
                                        usertile_cn,
                                        "[&_button]:bg-[var(--500)] [&_button]:text-white",
                                        status !== "GOING" &&
                                            "[&_>_*]:opacity-50 [&:hover_>_*]:opacity-100"
                                    )}
                                />
                            ) : null
                        )}
                </>
            )}

            {/* FRIENDS NOT YET INVITED */}
            {friendsList?.length && (
                <>
                    <div className='w-full px-4 py-2'>
                        <p className={label_cn}>Invite Others</p>
                    </div>
                    {friendsList
                        .filter(
                            ({ _id }) =>
                                !inviteList
                                    .map((invite) => invite.user?._id)
                                    .includes(_id.toString())
                        )
                        .map((user, i) => (
                            <UserInviteTile
                                key={i}
                                user={{
                                    ...user,
                                    inviteStatus: newInviteList.includes(user)
                                        ? "NEW_INVITE"
                                        : undefined,
                                }}
                                options={options}
                                onToggleInvite={() =>
                                    handleToggleUserSelect(user)
                                }
                                className={twMerge(
                                    usertile_cn,
                                    "[&_button]:bg-[var(--500)] [&_button]:text-white"
                                )}
                            />
                        ))}
                </>
            )}
        </div>
    );
};

export default UserInviteModal;
