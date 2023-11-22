'use client'

import React from 'react'
import styles from "./footer.module.css";
import Image from "next/image";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react'

const Footer = () => {
    return (
      <div className={styles.container}>
        <div>©2023 RickyABC. All rights reserved. v1.1122.1606</div>

        <Popover style={{color: 'black'}}>
          <PopoverTrigger>
            <Image src="/douyin-logo.png" width={32} height={32} className={styles.icon} alt="RickyABC Live Stream" />
          </PopoverTrigger>
        <PopoverContent style={{color: 'black'}}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Visit our Douyin!</PopoverHeader>
          <PopoverBody>Search for <mark>RickyABC 北美英语</mark></PopoverBody>
        </PopoverContent>
      </Popover>

      </div>
    );
  };

export default Footer;  