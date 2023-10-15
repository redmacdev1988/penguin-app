
"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../../context/GlobalContext";
import UploadForm from '@/components/Upload/UploadForm';
import PhotoList from '@/components/Upload/PhotosList';
import { fetchHomework } from '@/actions/homeworkActions';

const loadingHTML = () => {
  return <p>Loading...</p>;
}

const HomeworkPage = () => {
  console.log('--- HomeworkPage ---');

  const session = useSession();
  const router = useRouter();
  const [node, setNode] = useState();
  
  const [data, setData] = useState([]);
  const [nextCursor, setNextCursor] = useState();

  const { csFromUrl } = useContext(GlobalContext);
 

  const isAdmin = (name) => (name === 'rtsao' || name === 'admin')

  const authenticatedHTML = () => {

    const bUserAdmin = isAdmin(session?.data?.user.name);

    return (
      <div className={styles.container}>

        {!bUserAdmin && <h1>Upload Image Files for {session?.data?.user.name}</h1>}
        {!bUserAdmin && <UploadForm refreshHomeworkData={ async() => {
          const responseData = await fetchHomework({name: session?.data?.user.name, limit: data.length + 1});
          if (responseData) {
            const {allHmForUser, next_cursor} = responseData;
            setData(allHmForUser);
            setNextCursor(next_cursor);
          }
        }}/>}
        <h1>{bUserAdmin ? `Welcome Administrator ${session?.data?.user.name}` : `${session?.data?.user.name}'s Homework`}</h1>

        {data && data && Array.isArray(data) && data.length > 0 && 
        <PhotoList
          nextCursor={nextCursor}
          isAdmin={isAdmin(session?.data?.user.name)} 
          homeworkArr={data || []} 
          author={session?.data?.user.name} 
          refreshHomeworkData={ async (additionalData, nextCursor) => {
            if (additionalData) {
              setData(prev => [...prev, ...additionalData]);
              setNextCursor(nextCursor)
            } else { // update correctional link
              const responseData = await fetchHomework({name: session?.data?.user.name, limit: data.length});
              if (responseData) {
                const {allHmForUser, next_cursor} = responseData;
                setData(allHmForUser);
                setNextCursor(next_cursor);
              }
            }
          }} 
        />}
      </div>
    );
  }



  useEffect(() => {
    console.log('session updated');
    (async () => {
      const responseData = await fetchHomework({ name: session?.data?.user.name });
      if (responseData) {
        const {allHmForUser, next_cursor} = responseData;
        setData([...allHmForUser]);
        setNextCursor(next_cursor);
      }
    })();
  }, []);

  useEffect(() => {
    console.log('data updated');
    if (data) {
      console.log('update Node');
      setNode(authenticatedHTML());
    }
    
  }, [data]);

  useEffect(() => {
    console.log('session.status updated');
    if (session.status === "loading") {
      setNode(loadingHTML());
    }
  
    if (session.status === "unauthenticated") {
      localStorage.setItem(csFromUrl, "homework");
      router?.push("/dashboard/login");
    }

    if (session.status === "authenticated") {
      setNode(authenticatedHTML());
    } 
  }, [session.status]);

    return (node);
};

export default HomeworkPage;


