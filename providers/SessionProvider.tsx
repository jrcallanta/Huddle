"use client";

import { SessionProvider as NextSessionProvider } from "next-auth/react";
import React from "react";

const SessionProvider = (props: { children: React.ReactNode }) => {
    return <NextSessionProvider>{props.children}</NextSessionProvider>;
};

export default SessionProvider;
