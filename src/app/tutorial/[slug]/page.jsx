import React from "react";
import styles from "./page.module.css";
import Button from "@/components/Button/Button";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getDataBySlug(slug) {
  const dataURL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/tutorials/${slug}` :
  `http://${process.env.LOCALHOST_URL}/api/tutorials/${slug}`;
  console.log('dataURL: ', dataURL);
  const res = await fetch(dataURL, {cache: "no-store"});
  return (!res.ok) ? notFound() : res.json();
}

const Tutorial = async ({ params }) => {
  const { slug } = params;
  const data = await getDataBySlug(slug);
  const { content } = data;
  if (data) {
    return (
      <div className={styles.container}>
        {<h1>{params.slug}</h1>}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  } else {
    return (
      <h3>Tutorial with slug {slug} Not Found</h3>
    )
  }
};

export default Tutorial;
