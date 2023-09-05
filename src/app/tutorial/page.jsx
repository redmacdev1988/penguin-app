"use client"
import React, {useEffect} from "react";
import styles from "./page.module.css";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Tutorial = () => {
  const session = useSession();
  const router = useRouter();


  useEffect(() => {
    if (session.status === "loading") {
      return <p>Loading...</p>;
    }
  
    if (session.status === "unauthenticated") {
      localStorage.setItem("fromUrl", "homework");
      router?.push("/dashboard/login");
    }

    if (session.status === "authenticated") {
      return (
        <div className={styles.container}>
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
        </div>
      );
    }

  }, [session.status])


};

export default Tutorial;
