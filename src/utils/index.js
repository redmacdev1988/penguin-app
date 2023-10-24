const adminNames = ['rtsao', 'admin', 'root'];

export const isAdmin = (nameToTest) => adminNames.filter(item => item === nameToTest).length !== 0;