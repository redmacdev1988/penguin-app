"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./page.module.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { initLocalStorageForTut } from '@/app/tutorial/page';
import { GlobalContext } from '@/context/GlobalContext';
import { Icon, Heading, InputGroup, Input, InputRightElement, InputLeftElement, Button } from '@chakra-ui/react'
import { LuUserCircle2 } from "react-icons/lu";
import PenguinBanner from "@/../public/horizontal-logo-title.png";
import Image from "next/image";

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
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [node, setNode] = useState("");

  useEffect(() => {
    setError(params.get("error"));
    setSuccess(params.get("success"));
  }, [params]);

  useEffect(() => {
    console.log('session.status: ', session.status);

    if (session.status === "loading") {
      setNode(loadingHTML());
    }
    else if (session.status === "unauthenticated") {
      setNode(renderLoginPage());
    }
    else if (session.status === "authenticated") {
      setLoading(false);
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

  const loadingHTML = () => {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4.8em'}}>
      <h1>Logging in...</h1>
    </div>;
  }

  const renderLoginPage = () => {
    return !loading && (
      <div className={styles.container}>
      <div>
        <Heading>{success ? success : "Welcome Back"}</Heading>
      </div>
      <div className={styles.bannerOuter}>
        <Image src={PenguinBanner} alt="" className={styles.banner} />
      </div>
      <div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputGroup size='lg'>
            <InputLeftElement pointerEvents='none'>
              <Icon as={LuUserCircle2} color='orange.300' />
            </InputLeftElement>
            <Input size='lg' placeholder='Your ID' variant='outline' />
          </InputGroup>
  
          <InputGroup size='lg'>
            <Input
              pr='4.5rem'
              type={showPwd ? 'text' : 'password'}
              placeholder='Enter a Password'
            />
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
          </InputGroup>
  
          <button className={styles.button}>Login</button>
          {error && error}
        </form>
      </div>
        
        <div className={styles.msg}>No Account? Please ask a Penguin admin to create one for you</div>
  
        {/* <LinkBox as='article' maxW='sm' p='5' borderWidth='1px' rounded='md' style={{textAlign: 'center'}}>
          <Text mb='3'>Come Join Us!</Text>
            <Heading size='md' my='2'>
              <LinkOverlay href="/dashboard/register">Create New Account</LinkOverlay>
            </Heading>
        </LinkBox> */}
        
      </div>
    );
  }
  
  return node;
};

export default Login;
