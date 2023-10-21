
'use client'

import Link from 'next/link'
import React, { useContext, useState } from "react";
import { MyThemeContext } from "../../context/MyThemeContext";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "./navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";

const links = [
    {
      id: 1,
      title: "Home",
      url: "/",
    },
    {
      id: 2,
      title: "Tutorials",
      url: "/tutorial",
    },
    {
      id: 3,
      title: "Homework",
      url: "/homework",
    },
    // {
    //   id: 4,
    //   title: "About",
    //   url: "/about",
    // },
    // {
    //   id: 5,
    //   title: "Contact",
    //   url: "/contact",
    // },
    {
      id: 6,
      title: "Dashboard",
      url: "/dashboard",
    },
  ];

export const Navbar = () => {


  const { mode } = useContext(MyThemeContext);
  const { csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials } = useContext(GlobalContext);

  const session = useSession();
  const username = session && session?.data?.user?.name || "";
  return (
      
    <div className={styles.container}>
        {/* <Link href="/" className={styles.logo}>
          <img
            src={mode === "dark" ? '/rickyabc-light-logo-370X280.png' : '/rickyabc-dark-logo-370X280.png'}
            height={'80%'}
            width={'80%'}
            alt=""
            className={styles.img}
          />
        </Link> */}

        {/* links */}
        <div className={styles.links}> 
            <DarkModeToggle />
            {links.map((link) => (
            <Link key={link.id} href={link.url} className={styles.link}>
                {link.title}
            </Link>
            ))}
        </div>

        <h3>{username ? "Welcome " : ""} {username}</h3>
        {session.status === "authenticated" && (
          <button className={styles.logout} onClick={() => { 
            localStorage.setItem(csCacheTutorials, JSON.stringify([false, false, false]));
            localStorage.setItem(csShouldCacheTutorials, 'yes');
            localStorage.setItem(csCacheTimeStamp, Date.now());
            signOut(); 
          }}>
            Logout
          </button>
        )}
    </div>
  )
}

export default Navbar;