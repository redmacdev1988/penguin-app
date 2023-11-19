"use client"
import React, {useEffect, useState, useContext} from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../../context/GlobalContext";
import { FiExternalLink } from 'react-icons/fi'
import { Divider, AbsoluteCenter, Button, Box, Text, SimpleGrid, Card, CardHeader, CardBody, Heading, Icon, Link } from '@chakra-ui/react'
import { SESSION_AUTHENTICATED, SESSION_UNAUTHENTICATED, SESSION_LOADING } from '@/utils/index';
import useFetchAndCacheTutorialsForAdmin from "@/hooks/useFetchAndCacheTutorialsForAdmin";

const loadingHTML = () => {
  return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4.8em'}}>
    <h1>Loading...</h1>
  </div>;
}

const createHref = (slug) => {
  return "/tutorial/" + slug;
}

const createArray = (length) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(i+1);
  }
  return arr;
}

const renderPaginatedData = (dataArr, pageIndex, setPageIndexFunc, totalPages, totalItems) => {
  if (!dataArr || !Array.isArray(dataArr) || (Array.isArray(dataArr) && dataArr.length === 0)) { return (<h1>No Data</h1>); }
  const pageArr = createArray(totalPages);
  return (
    <main>

    <Box position='relative' padding='10'>
      <Divider />
      <AbsoluteCenter color='#ECC94B' bg='#111' px='6'><Text fontSize='2xl'>Total of {totalItems} Tutorials </Text></AbsoluteCenter>
      </Box>

      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
      {dataArr && dataArr.map((item) => (
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
      {pageIndex <= 1 ? <></> : <Button onClick={() => setPageIndexFunc(pageIndex - 1)} colorScheme='yellow' variant='ghost'>Prev</Button> }
      <ul style={{width: '100%', display:'flex', flexDirection: 'row', listStyleType: 'none', justifyContent: 'space-evenly'}}>
        {pageArr.map((item, index) => {
          return <li key={item+index} style={{marginLeft: '10px', marginRight: '10px'}}>
            <Button onClick={() => setPageIndexFunc(item)} colorScheme='yellow' variant='solid'>
              Page {item}
            </Button>
          </li>
        })}
      </ul>
      {pageIndex >= totalPages ? <></> : <Button onClick={() => setPageIndexFunc(pageIndex + 1)} colorScheme='yellow' variant='ghost'>Next</Button>}
    </ul>
  </main>
  )
}

const TutorialList = () => {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { lsKeyStr_fromUrl } = useContext(GlobalContext);

  const {tutorialsData, totalItems, totalPages, page, setPage } = useFetchAndCacheTutorialsForAdmin({bFull: false, isAdmin: session?.data?.user.role === "admin"});


  useEffect(() => {
    if (session.status === SESSION_LOADING) {
      setLoading(true);
    }
  
    if (session.status === SESSION_UNAUTHENTICATED) { 
      localStorage.setItem(lsKeyStr_fromUrl, "tutorial");
      router?.push("/dashboard/login");
    }

    if (session.status === SESSION_AUTHENTICATED) {
      setLoading(false);
    }
  }, [session.status]);

  return loading ? loadingHTML() : (totalPages > 0 && totalItems > 0) && renderPaginatedData(tutorialsData, page, setPage, totalPages, totalItems);

};

export default TutorialList;
