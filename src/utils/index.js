const adminNames = ['rtsao', 'admin', 'root'];

export const isAdmin = (nameToTest) => adminNames.filter(item => item === nameToTest).length !== 0;

export const LOGIN_ERR_KEY = "loginError";

export const SESSION_AUTHENTICATED = "authenticated";
export const SESSION_UNAUTHENTICATED = "unauthenticated";
export const SESSION_LOADING = "loading";