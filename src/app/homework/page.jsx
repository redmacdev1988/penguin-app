
"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../../context/GlobalContext";
import UploadForm from '@/components/Upload/UploadForm';
import PhotoList from '@/components/Upload/PhotosList';
import { fetchHomework } from '@/actions/homeworkActions';
import { SESSION_AUTHENTICATED, SESSION_UNAUTHENTICATED, SESSION_LOADING } from '@/utils/index';
import { CircularProgress, Input, Button, Flex, Text, Heading } from '@chakra-ui/react'
import useFetchAndCacheTutorials from "@/hooks/useFetchAndCacheTutorials";

const loadingHTML = () => {
  return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '6.8em'}}>
    <h1>Loading...</h1>
  </div>;
}

const HomeworkPage = () => {
  const session = useSession();
  const router = useRouter();
  const [node, setNode] = useState();
  const [data, setData] = useState([]);
  const [nextCursor, setNextCursor] = useState();
  const { lsKeyStr_fromUrl } = useContext(GlobalContext);
 
  const authenticatedHTML = () => {
    const bUserAdmin = session?.data?.user.role === "admin";
    console.log('bUserAdmin', bUserAdmin);
    return (
      <div className={styles.container}>

        {!bUserAdmin && <Heading size="lg" fontFamily={"mono"} color={"gray.500"}>Your Homework</Heading>}
        {!bUserAdmin && <UploadForm refreshHomeworkData={async() => {
          const responseData = await fetchHomework({user: session?.data?.user, limit: data.length + 1});
          if (responseData) {
            const {allHmForUser, next_cursor} = responseData;
            setData(allHmForUser);
            setNextCursor(next_cursor);
          }
        }}/>}
        <Heading size="lg" fontFamily={"mono"} color={"white"}>
          {bUserAdmin ? `Welcome Administrator ${session?.data?.user.name}` : ``}
        </Heading>

        {data && data && Array.isArray(data) && data.length > 0 && 
        <PhotoList
          nextCursor={nextCursor}
          isAdmin={bUserAdmin} 
          homeworkArr={data || []} 
          user={session?.data?.user} 
          refreshHomeworkData={ async (additionalData, nextCursor) => {
            if (additionalData) {
              setData(prev => [...prev, ...additionalData]);
              setNextCursor(nextCursor)
            } else { // update correctional link
              const responseData = await fetchHomework({user: session?.data?.user, limit: data.length});
              if (responseData) {
                const {allHmForUser, next_cursor} = responseData;
                setData(allHmForUser);
                setNextCursor(next_cursor);
              }
            }
            return true;
          }} 
        />}
      </div>
    );
  }

  useEffect(() => {
    (async () => {
      const responseData = await fetchHomework({ user: session?.data?.user });
      console.log('responseData', responseData);
      if (responseData) {
        const {allHmForUser, next_cursor} = responseData;
        setData([...allHmForUser]);
        setNextCursor(next_cursor);
      }
    })();
  }, []);

  useEffect(() => {
    setNode(authenticatedHTML());
  }, [data]);

  useEffect(() => { 
    if (session.status === SESSION_LOADING) {
      setNode(loadingHTML());
    }
  
    if (session.status === SESSION_UNAUTHENTICATED) {
      localStorage.setItem(lsKeyStr_fromUrl, "homework");
      router?.push("/dashboard/login");
    }

    if (session.status === SESSION_AUTHENTICATED) {
      (async () => {
        const responseData = await fetchHomework({ user: session?.data?.user });
        if (responseData) {
          const {allHmForUser, next_cursor} = responseData;
          setData([...allHmForUser]);
          setNextCursor(next_cursor);
        }
      })();
    } 
  }, [session.status]);

    return (node);
};

export default HomeworkPage;


