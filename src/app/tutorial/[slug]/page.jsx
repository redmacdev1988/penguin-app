"use client"

import React from "react";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { Heading } from '@chakra-ui/react'


async function getDataBySlug(slug) {
  const dataURL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/tutorials/${slug}` :
  `http://${process.env.LOCALHOST_URL}/api/tutorials/${slug}`;
  const res = await fetch(dataURL, {cache: "no-store"});
  return (!res.ok) ? notFound() : res.json();
}

const Tutorial = async ({ params }) => {
  const { slug } = params;
  const data = await getDataBySlug(slug);
  const { content, title } = data;
  if (data) {
    return (
      <div className={styles.container}>
        <Heading style={{textAlign: 'center'}} as='h2' size='2xl' noOfLines={1}>{title}</Heading>
        <div style={{ 
            fontSize: 'x-large',
            borderRadius: '20px', 
            marginTop: '25px', 
            padding: '30px', 
            lineHeight: 2 
          }} dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  } else {
    return (
      <h3>Tutorial with slug {slug} Not Found</h3>
    )
  }
};

export default Tutorial;
