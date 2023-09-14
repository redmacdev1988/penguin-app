"use client"
import React, {useEffect, useState} from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const RESULTS_PER_PAGE = 3;

const loadingObj = () => {
  return (<p>Loading...</p>);
}

const createExcerpt = (excerpt, slug) => {
  const result = excerpt.split('<a href=\"');
  const moreLink = result[result.length-1];
  const toUpdateData = moreLink.split('/"');
  return excerpt.replace(toUpdateData[0], `/tutorial/${slug}`); 
}

const createHref = (slug) => {
  return "/tutorial/" + slug;
}

const createList = (data) => {
  return (
    <main>
      <ul>
        {data && data.map((item) => (
          <li key={item.id}>
            <h2>{item.title?.rendered}</h2>

            {/* should be: /tutorial/simple-resent  */}
            {/* we need to go to tutorial/[slug]/page.jsx  */}
            <a href={createHref(item.slug)} key={item.id}>
              read more
            </a>

          </li>
        ))}
      </ul>
    </main>
  )
}

const cacheTutorialContents = async (data) => {
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
      setError(err);
      console.log(err);
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
      <h3>Total # of Tutorials {totalItems}</h3>
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
    
    <ul style={{display:'flex', flexDirection: 'row'}}>

    {pageIndex <= 1 ? <></> : <button onClick={() => setPageIndex(pageIndex - 1)}>Previous</button>}
    <ul style={{display:'flex', flexDirection: 'row'}}>
      {pageArr.map((item, index) => {
        return <li key={item+index}><button onClick={() => {}}>Page {item}</button></li>
      })}
    </ul>
    {pageIndex >= totalPages ? <></> : <button onClick={() => setPageIndex(pageIndex + 1)}>Next</button> }
    </ul>

  </main>
  )
}

// ref - https://stackoverflow.com/questions/59803923/how-to-get-response-headers-from-wp-rest-api-in-next-js

const TutorialList = () => {
  
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const session = useSession();
  const router = useRouter();
  const [node, setNode] = useState();
  const [tutorialsData, setTutorialsData] = useState();
  // const fetcher = (...args) => fetch(...args).then((res) => res.json());

  // get HTTP headers

  /*
  const { data } = useSWR(
    `https://chineseruleof8.com/wp-json/wp/v2/posts?categories=48&Authorization=BearerJ7Kcu42AoGxne4tQVwPcjtxh`,
    fetcher
  );
  */

  useEffect(() => {
    fetch(`https://chineseruleof8.com/wp-json/wp/v2/posts?categories=48&page=${page}&per_page=${RESULTS_PER_PAGE}&Authorization=BearerJ7Kcu42AoGxne4tQVwPcjtxh`)
      .then((res) => { 
        console.log('x-wp-total', res.headers.get('x-wp-total'));
        setTotalItems(res.headers.get('x-wp-total'));

        console.log('X-WP-TotalPages', res.headers.get('X-WP-TotalPages'));
        setTotalPages(res.headers.get('X-WP-TotalPages'));

        return res.json();
      }).then(data => {
          console.log('received data: ', data);
          setTutorialsData(data);
      });
  }, [])


  useEffect(() => {
    console.log('tutorialsData has been updated. totalPages: ', totalPages);
    setNode(renderPaginatedData(tutorialsData, page, setPage, totalPages, totalItems));
  }, [tutorialsData, page]);

  /*
  useEffect(() => {
    const fetchStr = localStorage.getItem("refetchTutorials");
    if (fetchStr === "refetch" && data && Array.isArray(data) && data.length > 0) { // needs to be cached
      cacheTutorialContents(data).then((response) => {
        if(response.status === 201) {
          localStorage.setItem("refetchTutorials", 'fetched');
        }
      })
    }
    setNode(createList(data));
  }, [data]);
  */

  useEffect(() => {
    if (session.status === "loading") {
      setNode(loadingObj());
    }
  
    if (session.status === "unauthenticated") {
      localStorage.setItem("fromUrl", "tutorial");
      router?.push("/dashboard/login");
    }

    if (session.status === "authenticated") {
      setNode(renderPaginatedData());
      setNode(<h1>Tutorials List</h1>);
    }
  }, [session.status]);

  return (node);

};

export default TutorialList;
