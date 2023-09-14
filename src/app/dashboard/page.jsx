"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Dashboard = () => {
  const session = useSession();
  const router = useRouter();
  const [node, setNode] = useState();

  console.log('---> session name: ', session?.data?.user.name);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, mutate, error, isLoading } = useSWR(
    `/api/posts?username=${session?.data?.user.name}`,
    fetcher
  );  
  
  const loadingHTML = () => <p>Loading...</p>;

  const addNewHmForm = () => {
    return (
      <form className={styles.new} onSubmit={handleSubmit}>
          <h1>Add New Homework</h1>
          <input type="text" placeholder="Title" className={styles.input} />
          <input type="text" placeholder="Desc" className={styles.input} />
          <input type="text" placeholder="Image" className={styles.input} />
          <textarea placeholder="Content" className={styles.textArea} cols="30" rows="10"></textarea>
          <button className={styles.button}>Send</button>
        </form>
    )
  }

  const renderPastHomeworkHTML = () => {
    return (
      data && data?.map((post) => (
        <ul>
          <li className={styles.post} key={post._id}>
            <span>key: {post._id}</span>
            <div className={styles.imgContainer}>
              <Image src={post.img} alt="" width={200} height={100} />
            </div>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <span className={styles.delete} onClick={() => handleDelete(post._id)}>Delete</span>
          </li>
        </ul>
      ))
    )
  }

  const authenticatedHTML = () => {
    return (
      <div className={styles.container}>
        {addNewHmForm()}
        <h1>Your Past Homework</h1>
        <div className={styles.posts}>
          {isLoading ? "loading" : renderPastHomeworkHTML()}
        </div>
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
      localStorage.setItem("fromUrl", "dashboard");
      router?.push("/dashboard/login");
    }

    if (session.status === "authenticated") {
        setNode(authenticatedHTML());
    }
  }, [session.status]);

  const handleSubmit = async (e) => {
    console.log('handle submit..................');
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
