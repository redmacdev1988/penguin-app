
"use client";
import React, { useEffect } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Homework = () => {

  const session = useSession();
  const router = useRouter();

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(
    `/api/posts?username=${session?.data?.user.name}`,
    fetcher
  );

  useEffect(() => {
    if (session.status === "loading") {
      return <p>Loading...</p>;
    }
  
    if (session.status === "unauthenticated") {
      localStorage.setItem("fromUrl", "homework");
      router?.push("/dashboard/login");
    }
  }, [session]);


  if (session.status === "authenticated") {
    return (
      <div className={styles.container}>
        <h1>Your Homework</h1>
        <div className={styles.mainContainer}>
          {data && data.map((item) => (
            <div>
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
        </div>
        ))}
        </div>
       
      </div>
    );
  }
};

export default Homework;


