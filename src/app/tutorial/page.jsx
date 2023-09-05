"use client"
import React, {useEffect, useState} from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const reactObj = () => {
  return (<div className={styles.container}>
    <h1 className={styles.selectTitle}>Choose a tutorial</h1>
    <div className={styles.items}>
      <Link href="/tutorial/present-simple" className={styles.item}>
        <span className={styles.title}>Present Simple</span>
      </Link>
      <Link href="/tutorial/present-perfect" className={styles.item}>
        <span className={styles.title}>Present Perfect</span>
      </Link>
      <Link href="/tutorial/present-continuous" className={styles.item}>
        <span className={styles.title}>Continuous</span>
      </Link>
    </div>
    </div>); 
}

const loadingObj = () => {
  return (<p>Loading...</p>);
}


const Tutorial = () => {
  const session = useSession();
  const router = useRouter();
  const [node, setNode] = useState();


  useEffect(() => {
    if (session.status === "loading") {
      setNode(loadingObj);
    }
  
    if (session.status === "unauthenticated") {
      localStorage.setItem("fromUrl", "tutorial");
      router?.push("/dashboard/login");
    }

    if (session.status === "authenticated") {
      setNode(reactObj);
    }
  }, [session.status]);

  return (node);

};

export default Tutorial;
