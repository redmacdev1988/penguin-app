"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GlobalContext } from "@/context/GlobalContext";

const Dashboard = () => {
  const session = useSession();
  const router = useRouter();
  const [node, setNode] = useState();
  const { csFromUrl } = useContext(GlobalContext);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  
  // todo 
  // get numbers of homework
  // get number of improvement links
  // others etc
  
  const { data, mutate, error, isLoading } = useSWR(
    `/api/posts?username=${session?.data?.user.name}`,
    fetcher
  );  
  
  const loadingHTML = () => {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4.8em'}}>
      <h1>asdf Loading...</h1>
    </div>;
  }

  const renderPastHomeworkHTML = () => {
    return (
      <ul>
      {data && data?.map((post) => (
        <li className={styles.post} key={post._id}>
          <span>key: {post._id}</span>
          <div className={styles.imgContainer}>
            <Image src={post.img} alt="" width={200} height={100} />
          </div>
          <h2 className={styles.postTitle}>{post.title}</h2>
          <span className={styles.delete} onClick={() => handleDelete(post._id)}>Delete</span>
        </li>
      ))}
      </ul>
    )
  }

  const authenticatedHTML = () => {
    return (
      <div className={styles.container}>
       <h1>This is your dashboard</h1>
      </div>
    );
  }

  // when the data is updated, we need to re-render the react node
  useEffect(() => {
    if (session.status === "authenticated" && session?.data?.user.name) {
      setNode(authenticatedHTML());
    }
  }, [data])

  useEffect(() => {
    if (session.status === "loading") {
      setNode(loadingHTML());
    }
  
    if (session.status === "unauthenticated") {
      localStorage.setItem(csFromUrl, "dashboard");
      router?.push("/dashboard/login");
    }

    if (session.status === "authenticated") {
        setNode(authenticatedHTML());
    }
  }, [session.status]);

  const handleSubmit = async (e) => {

    e.preventDefault();
    const title = e.target[0].value;
    const desc = e.target[1].value;
    const img = e.target[2].value;
    const content = e.target[3].value;

    try {
      await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          desc,
          img,
          content,
          username: session.data.user.name,
        }),
      });
      mutate();
      e.target.reset()
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      mutate();
    } catch (err) {
      console.log(err);
    }
  };

 
  return (node);
};

export default Dashboard;
