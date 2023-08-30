import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

const Portfolio = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.selectTitle}>Choose a feature</h1>
      <div className={styles.items}>
        <Link href="/portfolio/present-simple" className={styles.item}>
          <span className={styles.title}>Present Simple</span>
        </Link>
        <Link href="/portfolio/present-perfect" className={styles.item}>
          <span className={styles.title}>Present Perfect</span>
        </Link>
        <Link href="/portfolio/present-continuous" className={styles.item}>
          <span className={styles.title}>Continuous</span>
        </Link>
      </div>
    </div>
  );
};

export default Portfolio;
