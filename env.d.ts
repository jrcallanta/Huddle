namespace NodeJS {
    interface ProcessEnv {
        // NextAuth
        NEXTAUTH_URL: string;
        NEXTAUTH_SECRET: string;

        // MongoDB
        DATABASE_URL: string;

        // GogleMaps
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
        NEXT_PUBLIC_MAP_ID: string;
    }
}
