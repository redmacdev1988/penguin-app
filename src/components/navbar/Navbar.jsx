
'use client'

import Link from 'next/link'
import React from 'react'
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
      title: "Tutorial",
      url: "/tutorial",
    },
    {
      id: 3,
      title: "Homework",
      url: "/homework",
    },
    {
      id: 4,
      title: "About",
      url: "/about",
    },
    {
      id: 5,
      title: "Contact",
      url: "/contact",
    },
    {
      id: 6,
      title: "Dashboard",
      url: "/dashboard",
    },
  ];

export const Navbar = () => {
  const session = useSession();
  console.log(' Navbar session', session);

  return (
    <div className={styles.container}>
        <Link href="/" className={styles.logo}>
            RickyABC
        </Link>
        <div className={styles.links}> 
            <DarkModeToggle />
            {links.map((link) => (
            <Link key={link.id} href={link.url} className={styles.link}>
                {link.title}
            </Link>
            ))}
        </div>
        {session.status === "authenticated" && (
          <button className={styles.logout} onClick={signOut}>
            Logout
          </button>
        )}
    </div>
  )
}

export default Navbar;