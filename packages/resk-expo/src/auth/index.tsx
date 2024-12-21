import Default from "./hooks";
export * from "./hooks";
export * from "./types";

type IAuth = {
    Login: typeof Default.Login;
    Container: typeof Default.Container;
}

export const Auth: IAuth = {
    Login: Default.Login,
    Container: Default.Container,
};