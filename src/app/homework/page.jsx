
"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../../context/GlobalContext";
import UploadForm from '@/components/Upload/UploadForm';
import PhotoList from '@/components/Upload/PhotosList';

const loadingHTML = () => {
  return <p>Loading...</p>;
}

const HomeworkPage = () => {
  const session = useSession();
  const router = useRouter();
  const [node, setNode] = useState();
  const { csFromUrl } = useContext(GlobalContext);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate } = useSWR(
    `/api/homework?name=${session?.data?.user.name}`,
    fetcher
  );

  const isAdmin = (name) => (name === 'rtsao' || name === 'admin')

  const authenticatedHTML = () => {
    const bUserAdmin = isAdmin(session?.data?.user.name);
    return (
      <div className={styles.container}>

      {!bUserAdmin && <h1>Upload Image Files for {session?.data?.user.name}</h1>}
      {!bUserAdmin && <UploadForm refreshHomeworkData={() => mutate()}/>}
      <h1>{bUserAdmin ? `Welcome Administrator ${session?.data?.user.name}` : `${session?.data?.user.name}'s Homework`}</h1>

        {data && <PhotoList 
                  isAdmin={isAdmin(session?.data?.user.name)} 
                  homeworkArr={data} 
                  author={session?.data?.user.name} 
                  refreshHomeworkData={() => mutate()} />}
      </div>
    );
  }
  
  useEffect(() => {
    setNode(authenticatedHTML());
  }, [data]);

  useEffect(() => {
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


