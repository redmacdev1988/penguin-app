

const firstPageURL = (user) => `/api/homework?id=${user.email}&role=${user.role}`;
const nthPageURL = (user, nextCursor) => `/api/homework?id=${user.email}&role=${user.role}&searchParams=${nextCursor}`;
const pageWithLimitURL = (user, limit) => `/api/homework?id=${user.email}&role=${user.role}&limit=${limit}`;

// Passing 0 means no limit.
export const fetchHomework = async ({user, nextCursor, limit}) => {

  if (!user && !nextCursor && !limit) return;

  let url;

  if (user && !nextCursor && !limit) {
    url = firstPageURL(user);
  } else if (user && nextCursor && !limit) {
    url = nthPageURL(user, nextCursor);
  } else if (user && !nextCursor && limit) {
    url = pageWithLimitURL(user, limit);
  }

  if (url) {
    console.log('===> url', url);
    try {
      const res = await fetch(url);
      if (res && res.status === 200) {
        return await res.json();
      } else {
        return null;
      }
    } catch (e) {
      console.log("error: ", e);
    }
  }

}