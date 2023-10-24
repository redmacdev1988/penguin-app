
'use client'

import Link from 'next/link'
import React, { useContext, useState } from "react";
import { MyThemeContext } from "../../context/MyThemeContext";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "./navbar.module.css";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";
import {
  Button,
  Icon,
} from '@chakra-ui/react'
import { LuLogOut } from "react-icons/lu";
import { isAdmin } from "@/utils";
import PenguinLogo from "@/../public/yellow-bckgnd-logo.jpeg";
import Image from "next/image";

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
    {
      id: 7,
      title: "Register",
      url: "/dashboard/register"
    }
  ];

export const Navbar = () => {

  const { mode } = useContext(MyThemeContext);
  const { csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials } = useContext(GlobalContext);

  const session = useSession();
  const username = session && session?.data?.user?.name || "";
  const bAdmin = isAdmin(username);
  return (
    <div className={styles.container}>
        

        {/* links */}
        <div className={styles.links}> 
            <Image src={PenguinLogo} alt="" style={{width: '64px', borderRadius: '5px'}} />
            <DarkModeToggle />
            {bAdmin && links.map((link) => { 
              return (
                <Link key={link.id} href={link.url} className={styles.link}>
                  {link.title}
                </Link>
              );
            })}

            {!bAdmin && links.map((link) => { 
              return (link.id < 7) && (
                <Link key={link.id} href={link.url} className={styles.link}>
                  {link.title}
                </Link>
              );
            })}
        </div>

        <h3>{username ? "Welcome " : ""} {username}</h3>
        {session.status === "authenticated" && (
           <Button 
            leftIcon={<Icon as={LuLogOut} color='black.300' />} 
            colorScheme='yellow' variant='solid' style={{marginTop: '15px'}}
            onClick={() => { 
              localStorage.setItem(csCacheTutorials, JSON.stringify([false, false, false]));
              localStorage.setItem(csShouldCacheTutorials, 'yes');
              localStorage.setItem(csCacheTimeStamp, Date.now());
              signOut(); 
          }}
         >
           Logout
         </Button>
        )}
    </div>
  )
}

export default Navbar;