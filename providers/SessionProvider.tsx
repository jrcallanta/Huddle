"use client";

import { SessionProvider as NextSessionProvider } from "next-auth/react";
import React from "react";

interface Props {
    children: React.ReactNode;
}

const SessionProvider = (props: Props) => {
    return <NextSessionProvider>{props.children}</NextSessionProvider>;
};

export default SessionProvider;
