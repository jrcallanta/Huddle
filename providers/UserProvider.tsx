"use client";

import { UserType } from "@/types";
import { createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { pullUserName } from "@/tools/pullUserName";

interface UserContextType {
    currentUser: UserType | null;
}

export const UserContext = createContext<UserContextType>({
    currentUser: null,
});

export interface Props {
    [propName: string]: any;
}

export const UserContextProvider = (props: Props) => {
    const { data: sessionData, status: sessionStatus } = useSession();
    const [currentUser, setCurrentUser] = useState<UserType | null>(null);

    useEffect(() => {
        if (sessionStatus !== "loading") {
            const asyncFetch = async () => {
                if (sessionData?.user?.email) {
                    let data = await fetch(
                        `/api/user/email/${sessionData.user.email}`
                    )
                        .then((res) => res.json())
                        .catch((error) => console.log(error));

                    console.log(data);

                    if (!data.user)
                        data = await fetch("/api/user", {
                            method: "POST",
                            body: JSON.stringify({
                                email: sessionData.user.email,
                                name: sessionData.user.name,
                                username: pullUserName(sessionData.user.email),
                                image: sessionData.user.image,
                            }),
                        }).then((res) => res.json());
                    else
                        data = await fetch("/api/user", {
                            method: "PATCH",
                            body: JSON.stringify({
                                userId: data.user._id,
                                imgUrl: sessionData.user.image,
                            }),
                        }).then((res) => res.json());

                    console.log(data);

                    if (data && (data.user || data.newUser || data.updatedUser))
                        setCurrentUser(
                            data.user ?? data.newUser ?? data.updatedUser
                        );
                } else console.log("no session");
            };

            asyncFetch();
        }
    }, [sessionStatus, sessionData]);

    const value = {
        currentUser: currentUser,
    };

    return <UserContext.Provider value={value} {...props} />;
};
