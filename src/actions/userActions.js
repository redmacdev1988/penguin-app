
export const fetchUsers = async ({}) => {
    console.log('userActions: ', 'fetchUsers');
    try {
        const res = await fetch(`/api/users`);
        if (res && res.status === 200) {
        return await res.json();
        } else {
            return null;
        }
    } catch (e) {
        console.log("error: ", e);
    }


}