"use client"
import React, {useEffect, useState, useContext} from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../../context/GlobalContext";
import { FiExternalLink } from 'react-icons/fi'
import { Divider, AbsoluteCenter, Button, Box, Text, SimpleGrid, Card, CardHeader, CardBody, Heading, Icon, Link } from '@chakra-ui/react'
import { SESSION_AUTHENTICATED, SESSION_UNAUTHENTICATED, SESSION_LOADING } from '@/utils/index';

const RESULTS_PER_PAGE = 10;
const HOURS = 8;

const loadingHTML = () => {
  return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4.8em'}}>
    <h1>Loading...</h1>
  </div>;
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
  const pageArr = createArray(totalPages);
  return (
    <main>

    <Box position='relative' padding='10'>
      <Divider />
      <AbsoluteCenter color='#ECC94B' bg='#111' px='6'><Text fontSize='2xl'>Total of {totalItems} Tutorials </Text></AbsoluteCenter>
      </Box>

      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
      {data && data.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <Heading size='md'>{item.title?.rendered}</Heading>
            </CardHeader>
            <CardBody>
              <div dangerouslySetInnerHTML={{ __html: item.excerpt.rendered.split(`&hellip;`)[0] }} />
            </CardBody>

            <Link style={{
              border: '1px solid white', color: '#FCB903', textAlign: 'center', 
              backgroundColor: 'black', width: '100%'
            }} 
            href={createHref(item.slug)} 
            key={item.id} isExternal>

              read more <Icon as={FiExternalLink} />

            </Link>
            
          </Card>
        ))}
      </SimpleGrid>
      
      <Box position='relative' padding='10'>
      <Divider />
      <AbsoluteCenter color='#ECC94B' bg='#111' px='6'>You are on Page {pageIndex}</AbsoluteCenter>
      </Box>


    <ul style={{display:'flex', flexDirection: 'row', listStyleType: 'none', justifyContent: 'space-between'}}>
      {pageIndex <= 1 ? <></> : <Button onClick={() => setPageIndex(pageIndex - 1)} colorScheme='yellow' variant='ghost'>Prev</Button> }
      <ul style={{width: '100%', display:'flex', flexDirection: 'row', listStyleType: 'none', justifyContent: 'space-evenly'}}>
        {pageArr.map((item, index) => {
          return <li key={item+index} style={{marginLeft: '10px', marginRight: '10px'}}>
            <Button onClick={() => setPageIndex(item)} colorScheme='yellow' variant='solid'>
              Page {item}
            </Button>
          </li>
        })}
      </ul>
      {pageIndex >= totalPages ? <></> : <Button onClick={() => setPageIndex(pageIndex + 1)} colorScheme='yellow' variant='ghost'>Next</Button>}
    </ul>
  </main>
  )
}

const withinHours = (timestamp) => (Math.floor((Date.now() - timestamp)/1000) < HOURS * 3600);

export const initLocalStorageForTut = (csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials) => {
  localStorage.setItem(csCacheTimeStamp, Date.now());
  localStorage.setItem(csCacheTutorials, JSON.stringify([false, false, false]));
  localStorage.setItem(csShouldCacheTutorials, 'yes');
}

const alreadyCachedWithinHours = (csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials) => {
  const strShouldCache = localStorage.getItem(csShouldCacheTutorials);
  const lastCacheTimeStamp = localStorage.getItem(csCacheTimeStamp);
  const bWithinHours = withinHours(lastCacheTimeStamp);

  if (!bWithinHours) {
    deleteTutorialsInDB();
    initLocalStorageForTut(csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials);
  }

  return (strShouldCache === 'no' && bWithinHours);
}

const TutorialList = () => {
  
  const { csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials, csFromUrl } = useContext(GlobalContext);

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

    setNode(loadingHTML());

    let _totalPages = 0;
    let _totalItems = 0;

    fetch(`https://chineseruleof8.com/wp-json/wp/v2/posts?categories=48&page=${page}&per_page=${RESULTS_PER_PAGE}&Authorization=BearerJ7Kcu42AoGxne4tQVwPcjtxh`)
      .then((res) => { 

        if (_totalItems === 0 && _totalPages === 0) {
          _totalItems = res.headers.get('x-wp-total');
          _totalPages = res.headers.get('X-WP-TotalPages');
        }
        return res.json();
      }).then(data => {
          setTutorialsData(data);
          setNode(renderPaginatedData(data, page, setPage, _totalPages, _totalItems));
      });

  }, [page])


  // this is about caching the data
  useEffect(() => {
    if (alreadyCachedWithinHours(csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials)) {
      console.log('caching already done within hours. No need to cache anymore.')
      return;
    } 

    const cacheArr = JSON.parse(localStorage.getItem(csCacheTutorials));
    const strShouldCacheTuts = localStorage.getItem(csShouldCacheTutorials);
    const bAllTutsCached = allCached(cacheArr);

    if (!bAllTutsCached) {
      if (tutorialsData && Array.isArray(tutorialsData) && tutorialsData.length > 0) { 
        cacheTutorialContents(tutorialsData).then((response) => {
          if(response.status === 201) {
            cacheArr[page-1] = true;
            localStorage.setItem(csCacheTutorials, JSON.stringify(cacheArr));
          }
        })
      }
    } else if (bAllTutsCached && strShouldCacheTuts === 'yes') {
      localStorage.setItem(csShouldCacheTutorials, 'no');
      localStorage.setItem(csCacheTimeStamp, Date.now() );
    }

  }, [tutorialsData]);


  useEffect(() => {
    if (session.status === SESSION_LOADING) {
      setNode(loadingHTML());
    }
  
    if (session.status === SESSION_UNAUTHENTICATED) { 
      localStorage.setItem(csFromUrl, "tutorial");
      router?.push("/dashboard/login");
    }

    if (session.status === SESSION_AUTHENTICATED) {
    }
  }, [session.status]);

  return (node);

};

export default TutorialList;
