"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./page.module.css";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { initLocalStorageForTut } from '@/app/tutorial/page';
import { GlobalContext } from '@/context/GlobalContext';

const cacheTutPropMissing = (csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials) => {
  return !localStorage.getItem(csCacheTimeStamp) || !localStorage.getItem(csCacheTutorials) || !localStorage.getItem(csShouldCacheTutorials);
}

const Login = ({ from }) => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials, csFromUrl } = useContext(GlobalContext);
  
  useEffect(() => {
    setError(params.get("error"));
    setSuccess(params.get("success"));
  }, [params]);

  useEffect(() => {

    if (session.status === "loading") {
      console.log('here!');
    }
    else if (session.status === "unauthenticated") {
      console.log('dashboard/login unauthenticated!!');
    }
    else if (session.status === "authenticated") {

      // we need to check for tutorial cache
      if (cacheTutPropMissing(csCacheTimeStamp, csCacheTutorials, csShouldCacheTutorials)) {
        initLocalStorageForTut();
      } 

      const fromUrl = localStorage.getItem(csFromUrl);
      router?.push(`/${fromUrl}`);
    }
  }, [session.status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    signIn("credentials", { email, password });
  };

  return (
    <div className={styles.container}>
     
      <h1 className={styles.title}>{success ? success : "Welcome Back"}</h1>
      <h2 className={styles.subtitle}>Please sign in to see the dashboard.</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          id ="email"
          type="text"
          placeholder="Email"
          required
          autoComplete="on"
          className={styles.input}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          required
          autoComplete="on"
          className={styles.input}
        />
        <button className={styles.button}>Login</button>
        {error && error}
      </form>

      <span className={styles.or}>- OR -</span>
      <Link className={styles.link} href="/dashboard/register">
        Create new account
      </Link>
      
    </div>
  );
};

export default Login;
