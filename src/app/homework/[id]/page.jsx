import React from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getDataById(id) {
  console.log('Get homework from : ', `http://localhost:3000/api/posts/${id}`)
  const res = await fetch(`http://localhost:3000/api/posts/${id}`, {cache: "no-store"});
  return (!res.ok) ? notFound() : res.json();
}

export async function generateMetadata({ params }) {
  const post = await getDataById(params.id)
  return {
    title: post.title,
    description: post.desc,
  };
}

const HomeworkPost = async ({ params }) => {
  const { id } = params;
  if (id) {
    const data = await getDataById(id);
    return (
      <div className={styles.container}>
        <div className={styles.top}>

        <div className={styles.imageContainer}>
          <Image
            src={data.img}
            fill={true}
            alt=""
            className={styles.image}
          />
        </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{data.title}</h1>
            <p className={styles.desc}>
              {data.description}
            </p>
            <div className={styles.author}>
            <span className={styles.username}>{data.username}</span>
            </div>

          </div>
          <div className={styles.content}>
            <p className={styles.text}>
              {data.content}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
};

export default HomeworkPost;
