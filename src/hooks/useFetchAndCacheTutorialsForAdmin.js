import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { useSession } from "next-auth/react";
import { SESSION_AUTHENTICATED } from '@/utils/index';

const API_TUTORIALS_URL = "/api/tutorials";
const HOURS = 168;
const RESULTS_PER_PAGE = 10;

export const initLocalStorageForTut = ({lsKeyStr_cacheTimeStamp, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials}) => {
  localStorage.setItem(lsKeyStr_cacheTimeStamp, Date.now());
  const bPageCachedArr = [];
  for (let i = 0; i < 68; i++) {
    bPageCachedArr[i] = false;
  }
  localStorage.setItem(lsKeyStr_cacheTutPageArr, JSON.stringify(bPageCachedArr));
  localStorage.setItem(lsKeyStr_shouldCacheTutorials, 'yes');
}

const withinHours = (timestamp) => (Math.floor((Date.now() - timestamp)/1000) < HOURS * 3600);


const deleteTutorialsInDB = async () => {
  try {
    return await fetch(API_TUTORIALS_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
  });
  } catch (err) {
    console.log(err);
  }
}

const cacheTutorialContents = async (data) => {

  try {
    return await fetch(API_TUTORIALS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: data
        })
    });
  } catch (err) {
      console.log('cacheTutorialContents', err);
  }
}

const allCached = (arr, lsKeyStr_numOfTutPages) => {
  const numOfPagesTutorials = localStorage.getItem(lsKeyStr_numOfTutPages)
  if (numOfPagesTutorials <= 0) return false;
  let tutsArray = [];
  if (arr && Array.isArray(arr) && arr.length > 0) {
    tutsArray = arr.slice(0, numOfPagesTutorials);
    return (tutsArray.filter((item) => { return item === false }).length === 0);
  }
  return false;
}

const cleanDBAndRecache = ({ tutorialsData, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials, lsKeyStr_cacheTimeStamp}) => {
    deleteTutorialsInDB().then(response => {
      if (tutorialsData && Array.isArray(tutorialsData) && tutorialsData.length > 0) { 
        cacheTutorialContents(tutorialsData).then((response) => {
          if(response.status === 201) {
            localStorage.setItem(lsKeyStr_cacheTutPageArr, JSON.stringify([true]));
            localStorage.setItem(lsKeyStr_shouldCacheTutorials, 'no');
            localStorage.setItem(lsKeyStr_cacheTimeStamp, Date.now() );
          }
        })
      }
    });
}

const cacheByPage = ({tutorialsData, page, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials, lsKeyStr_cacheTimeStamp, lsKeyStr_numOfTutPages, }) => {
    let cacheArr = JSON.parse(localStorage.getItem(lsKeyStr_cacheTutPageArr));
    const strShouldCacheTuts = localStorage.getItem(lsKeyStr_shouldCacheTutorials);
    const bAllTutsCached = allCached(cacheArr, lsKeyStr_numOfTutPages);

    if (!bAllTutsCached) {
      if (tutorialsData && Array.isArray(tutorialsData) && tutorialsData.length > 0) { 
        cacheTutorialContents(tutorialsData).then((response) => {
          if(response.status === 201) {
            cacheArr[page-1] = true; // is ok because in cacheArr, we use totalNumberOfTutorials to slice it.
            localStorage.setItem(lsKeyStr_cacheTutPageArr, JSON.stringify(cacheArr));
          }
        })
      } else {
        console.log('Tutorials data error. Not an array of length of 0', tutorialsData);
      }
    } else if (bAllTutsCached && strShouldCacheTuts === 'yes') {
      localStorage.setItem(lsKeyStr_shouldCacheTutorials, 'no');
      localStorage.setItem(lsKeyStr_cacheTimeStamp, Date.now() );
    }
}

const alreadyCachedWithinHours = ({lsKeyStr_cacheTimeStamp, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials}) => {
  const strShouldCache = localStorage.getItem(lsKeyStr_shouldCacheTutorials);
  const lastCacheTimeStamp = localStorage.getItem(lsKeyStr_cacheTimeStamp);
  const bWithinHours = withinHours(lastCacheTimeStamp);

  if (!bWithinHours) {
    if (cleanDBAndRecache) {
      deleteTutorialsInDB();
    } else {
      console.log('Sorry cannot delete tutorials in db because you are user ');
    }
    initLocalStorageForTut({lsKeyStr_cacheTimeStamp, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials});
  }

  return (strShouldCache === 'no' && bWithinHours);
}



// full fetch is fetch everything (used in homework)
// partial fetch is page by page (used in tutorials)

// tutorialsData, totalItems, totalPages, page, setPage
const useFetchAndCacheTutorialsForAdmin = ({bFull}) => {
  const session = useSession();
  if (session.status !== SESSION_AUTHENTICATED) {
    return {
      tutorialsData: null,
      totalItems: 0,
      totalPages: 0,
      page: -1,
      setPage: null
    }
  };

  const isAdmin = session?.data?.user?.role === 'admin';

  const { lsKeyStr_numOfTutPages, lsKeyStr_cacheTimeStamp, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials } = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [tutorialsData, setTutorialsData] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const url = bFull ?  `https://chineseruleof8.com/wp-json/wp/v2/posts?categories=48&per_page=88&Authorization=BearerJ7Kcu42AoGxne4tQVwPcjtxh` :
  `https://chineseruleof8.com/wp-json/wp/v2/posts?categories=48&page=${page}&per_page=${RESULTS_PER_PAGE}&Authorization=BearerJ7Kcu42AoGxne4tQVwPcjtxh`

  // standard fetch from wordpress
  useEffect(() => {
    fetch(url)
      .then((res) => { 
        setTotalItems(res.headers.get('x-wp-total'));
        setTotalPages(res.headers.get('X-WP-TotalPages'));
        localStorage.setItem(lsKeyStr_numOfTutPages, res.headers.get('X-WP-TotalPages'));
        return res.json();
      }).then(data => {
          setTutorialsData(data);
      });
  }, [page])

  // when new data comes in, we re-cache once a week and only through the admin account
  useEffect(() => {
    if (isAdmin) {
      if (alreadyCachedWithinHours({lsKeyStr_cacheTimeStamp, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials})) {
        console.log('caching already done within hours. No need to cache anymore.')
      } else {
        if (bFull) { // full
          cleanDBAndRecache({tutorialsData, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials, lsKeyStr_cacheTimeStamp});
        } else { // partial
          cacheByPage({tutorialsData, page, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials, lsKeyStr_cacheTimeStamp, lsKeyStr_numOfTutPages});
        }
      }
    }
  }, [tutorialsData]);

  return { tutorialsData, totalItems, totalPages, setPage, page };
}


export default useFetchAndCacheTutorialsForAdmin;