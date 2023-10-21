

const firstPageURL = (name) => `/api/homework?name=${name}`;
const nthPageURL = (name, nextCursor) => `/api/homework?name=${name}&searchParams=${nextCursor}`;
const pageWithLimitURL = (name, limit) => `/api/homework?name=${name}&limit=${limit}`;

// Passing 0 means no limit.
export const fetchHomework = async ({name, nextCursor, limit}) => {

  if (!name && !nextCursor && !limit) return;

  let url;

  if (name && !nextCursor && !limit) {
    url = firstPageURL(name);
  } else if (name && nextCursor && !limit) {
    url = nthPageURL(name, nextCursor);
  } else if (name && !nextCursor && limit) {
    url = pageWithLimitURL(name, limit);
  }

  if (url) {
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