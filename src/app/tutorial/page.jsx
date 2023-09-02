import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

const Tutorial = () => {
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
};

export default Tutorial;
