"use client"
import React, {useEffect, useState} from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const RESULTS_PER_PAGE = 8;
const HOURS = 8;

const loadingObj = () => {
  return (<p>Loading...</p>);
}

const createHref = (slug) => {
  return "/tutorial/" + slug;
}


export const deleteTutorialsInDB = async () => {
  try {
    return await fetch("/api/tutorials", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
  });
  } catch (err) {
    console.log(err);
}
}

export const cacheTutorialContents = async (data) => {
  console.log(`cacheTutorialContents: ${data.length} # of contents`, data.length);
  try {
    return await fetch("/api/tutorials", {
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


const createArray = (length) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i+1);
  }
  return arr;
}

const renderPaginatedData = (data, pageIndex, setPageIndex, totalPages, totalItems) => {
  if (!data) { return (<h1>No Data</h1>); }
  const pageArr = createArray(totalPages)
  return (
    <main>
      <h3>Total # of Tutorials {totalItems}, Total # of Pages {totalPages}</h3>
      <ul>
        {data && data.map((item) => (
          <li key={item.id}>
            <h2>{item.title?.rendered}</h2>
            <a href={createHref(item.slug)} key={item.id}>
              read more
            </a>
          </li>
        ))}
      </ul>

    <h3>You are on Page {pageIndex}</h3>
    
    <ul style={{display:'flex', flexDirection: 'row', listStyleType: 'none', justifyContent: 'space-between'}}>
      {pageIndex <= 1 ? <></> : <button onClick={() => setPageIndex(pageIndex - 1)}>Prev</button>}
      <ul style={{width: '100%', display:'flex', flexDirection: 'row', listStyleType: 'none', justifyContent: 'space-evenly'}}>
        {pageArr.map((item, index) => {
          return <li key={item+index} style={{marginLeft: '10px', marginRight: '10px'}}><button onClick={() => setPageIndex(item)}>Page {item}</button></li>
        })}
      </ul>
      {pageIndex >= totalPages ? <></> : <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button> }
    </ul>
  </main>
  )
}

// ref - https://stackoverflow.com/questions/59803923/how-to-get-response-headers-from-wp-rest-api-in-next-js


const withinHours = (timestamp) => (Math.floor((Date.now() - timestamp)/1000) < HOURS * 3600);

export const initLocalStorageForTut = () => {
  localStorage.setItem('cacheTimeStamp', Date.now());
  localStorage.setItem("cacheTutorials", JSON.stringify([false, false, false]));
  localStorage.setItem('shouldCacheTutorials', 'yes');
}


// returns true if:
// 1) should cache flag has been turned to no
// 2) last cache timestamp has been within our TIME limit
const alreadyCachedWithinHours = () => {
  const strShouldCache = localStorage.getItem('shouldCacheTutorials');
  const lastCacheTimeStamp = localStorage.getItem('cacheTimeStamp');
  const bWithinHours = withinHours(lastCacheTimeStamp);

  if (!bWithinHours) {
    deleteTutorialsInDB();
    initLocalStorageForTut();
  }

  return (strShouldCache === 'no' && bWithinHours);
}

const TutorialList = () => {
  
  const session = useSession();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [node, setNode] = useState();
  const [tutorialsData, setTutorialsData] = useState();

  const allCached = (arr) => {
    return (arr && Array.isArray(arr) && arr.length > 0) ? 
    (arr.filter((item) => { return item === false }).length === 0) : false;
  }


  // we need to update data on our page.
  useEffect(() => {
    console.log('~ page index has changed ~ ');
    setNode(<h1>Loading</h1>);

    let _totalPages = 0;
    let _totalItems = 0;

    fetch(`https://chineseruleof8.com/wp-json/wp/v2/posts?categories=48&page=${page}&per_page=${RESULTS_PER_PAGE}&Authorization=BearerJ7Kcu42AoGxne4tQVwPcjtxh`)
      .then((res) => { 

        if (_totalItems === 0 && _totalPages === 0) {
          _totalItems = res.headers.get('x-wp-total');
          console.log('x-wp-total', _totalItems);

          _totalPages = res.headers.get('X-WP-TotalPages');
          console.log('X-WP-TotalPages', _totalPages);
        }
        return res.json();
      }).then(data => {
          setTutorialsData(data);
          setNode(renderPaginatedData(data, page, setPage, _totalPages, _totalItems));
      });

  }, [page])


  // this is about caching the data
  useEffect(() => {
    console.log(`~ tutorials data has been updated ~`);
    if (alreadyCachedWithinHours()) {
      console.log('caching already done within hours. No need to cache anymore.')
      return;
    } 

    const cacheArr = JSON.parse(localStorage.getItem("cacheTutorials"));
    const strShouldCacheTuts = localStorage.getItem('shouldCacheTutorials');
    const bAllTutsCached = allCached(cacheArr);

    if (!bAllTutsCached) {
      if (tutorialsData && Array.isArray(tutorialsData) && tutorialsData.length > 0) { 
        cacheTutorialContents(tutorialsData).then((response) => {
          if(response.status === 201) {
            cacheArr[page-1] = true;
            localStorage.setItem('cacheTutorials', JSON.stringify(cacheArr));
          }
        })
      }
    } else if (bAllTutsCached && strShouldCacheTuts === 'yes') {
      localStorage.setItem('shouldCacheTutorials', 'no');
      localStorage.setItem('cacheTimeStamp', Date.now() );
    }

  }, [tutorialsData]);


  useEffect(() => {
    if (session.status === "loading") {
      setNode(loadingObj());
    }
  
    if (session.status === "unauthenticated") {
      localStorage.setItem("fromUrl", "tutorial");
      router?.push("/dashboard/login");
    }

    if (session.status === "authenticated") {
      console.log('tutorials page', 'authenticated')
    }
  }, [session.status]);

  return (node);

};

export default TutorialList;
