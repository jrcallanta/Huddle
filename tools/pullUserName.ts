export const pullUserName = (email: string) => {
    let [, username] = email.match(
        /^([A-Z0-9._%+-]+)@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    ) ?? [null, null];
    return username;
};
