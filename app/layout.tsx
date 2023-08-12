import { twMerge } from "tailwind-merge";
import "./globals.css";
import { Poppins } from "next/font/google";

import { HuddleContextProvider } from "@/providers/HuddleProvider";
import { UserContextProvider } from "@/providers/UserProvider";
import SessionProvider from "@/providers/SessionProvider";
import NavBar from "@/components/NavBar";

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
});

export const metadata = {
    title: "Huddle App",
    description: "Quickly Send Invites For Spontaneous Plans!",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body
                className={twMerge(
                    `bg-[var(--background-color)]`,
                    poppins.className
                )}
            >
                <SessionProvider>
                    <UserContextProvider>
                        <div className='h-screen w-full flex flex-col [&:has([data-vertical=true])]:flex-row justify-center items-center'>
                            <NavBar vertical={false} />
                            <HuddleContextProvider>
                                {children}
                            </HuddleContextProvider>
                        </div>
                    </UserContextProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
