
"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const loadingHTML = () => {
  return <p>Loading...</p>;
}

const Homework = () => {
  const session = useSession();
  const router = useRouter();
  const [node, setNode] = useState();

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(
    `/api/posts?username=${session?.data?.user.name}`,
    fetcher
  );

  const authenticatedHTML = () => {
    return (
      <div className={styles.container}>
        <h1>Your Homework</h1>
        <div className={styles.mainContainer}>
          <ul>
          {data && data.map((item) => (
            <li key={item.title}>
              <div className={styles.imageContainer}>
                <Image
                  src={item.img}
                  alt=""
                  fill={true}
                  className={styles.image}
                />
              </div>
              <a href={`/homework/${item._id}`} className={styles.container} key={item.id}>
                <div className={styles.content}>
                  <h1 className={styles.title}>{item.title}</h1>
                  <p className={styles.desc}>{item.desc}</p>
                </div>
              </a>
            </li>
          ))}
          </ul>
        </div>
      </div>
    );
  }
  
  useEffect(() => {
    console.log('data has changed', data);
    setNode(authenticatedHTML());
  }, [data]);

  useEffect(() => {
    if (session.status === "loading") {
      setNode(loadingHTML);
    }
  
    if (session.status === "unauthenticated") {
      console.log('UNauthenticated!!!!');
      localStorage.setItem("fromUrl", "homework");
      router?.push("/dashboard/login");
    }

    if (session.status === "authenticated") {
      setNode(authenticatedHTML());
    } 
  }, [session.status]);

    return (node);
};

export default Homework;


