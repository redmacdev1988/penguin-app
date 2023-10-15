'use client'

import React from 'react'
import styles from "./footer.module.css";
import Image from "next/image";

const Footer = () => {
    return (
      <div className={styles.container}>
        {/* <div>©2023 RickyABC. All rights reserved.</div>
        <div className={styles.social}>
            <Image src="/wechat-logo.png" width={32} height={32} className={styles.icon} alt="RickyABC Vocab Subscription" />
            <Image src="/douyin-logo.png" width={32} height={32} className={styles.icon} alt="RickyABC Live Stream" />
        </div> */}
      </div>
    );
  };

export default Footer;