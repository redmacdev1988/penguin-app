"use client";
import React, { useEffect, useState, useContext, useTransition } from "react";
import styles from "./page.module.css";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { initLocalStorageForTut } from '@/hooks/useFetchAndCacheTutorialsForAdmin';
import { GlobalContext } from '@/context/GlobalContext';
import { CircularProgress, CloseButton, Box, Alert, AlertTitle, AlertIcon, AlertDescription, Icon, Heading, InputGroup, Input, InputRightElement, InputLeftElement, Button } from '@chakra-ui/react'
import { LuUserCircle2 } from "react-icons/lu";
import PenguinBanner from "@/../public/horizontal-logo-title.png";
import Image from "next/image";
import { LOGIN_ERR_KEY, SESSION_AUTHENTICATED, SESSION_UNAUTHENTICATED, SESSION_LOADING } from "@/utils/index";

const cacheTutPropMissing = (lsKeyStr_cacheTimeStamp, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials) => {
  return !localStorage.getItem(lsKeyStr_cacheTimeStamp) || !localStorage.getItem(lsKeyStr_cacheTutPageArr) || !localStorage.getItem(lsKeyStr_shouldCacheTutorials);
}

const Login = ({ from }) => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState();
  const [success, setSuccess] = useState("");
  const {lsKeyStr_cacheTimeStamp, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials, lsKeyStr_fromUrl } = useContext(GlobalContext);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSigningin, setIsSigningin] = useState(false);

  useEffect(() => {
    const errObj = JSON.parse(params.get("error"));
    if (errObj) {
      setError(errObj);
    }
    setSuccess(params.get("success"));
  }, [params]);

  useEffect(() => {
    if (session.status === SESSION_LOADING) {

    }
    else if (session.status === SESSION_UNAUTHENTICATED) {
      setLoading(false);
    }
    else if (session.status === SESSION_AUTHENTICATED) {

      setLoading(true);
      if (cacheTutPropMissing(lsKeyStr_cacheTimeStamp, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials)) {
        initLocalStorageForTut({lsKeyStr_cacheTimeStamp, lsKeyStr_cacheTutPageArr, lsKeyStr_shouldCacheTutorials});
      } 
      const fromUrl = localStorage.getItem(lsKeyStr_fromUrl);
      router?.push(`/${fromUrl}`);
    }
  }, [session.status]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSigningin(true);
    const email = e.target[0].value;
    const password = e.target[1].value;
    signIn("credentials", { email, password });
  };

  const loadingHTML = () => {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4.8em'}}>
      <h1>Verifying...</h1>
    </div>;
  }

  return loading ? loadingHTML() : (

    <div className={styles.container}>

      <div>
        {error && <Alert status='warning'>
          <AlertIcon />
          <Box>
            <AlertTitle>Log In</AlertTitle>
            <AlertDescription>{error && error[LOGIN_ERR_KEY]}</AlertDescription>
          </Box>
          <CloseButton
            alignSelf='flex-start'
            position='relative'
            right={-1}
            top={-1}
            onClick={() => {
              console.log('setError');
              setError(null);
            }}
          />
        </Alert>}

        <Heading>{success ? success : "Welcome"}</Heading>
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
          <button className={styles.button} disabled={isSigningin}>
            Login
            {isSigningin && <CircularProgress size='25px' style={{margin: '5px'}} isIndeterminate color='red.300' />}
          </button>
        </form>
      </div>
      
      <div className={styles.msg}>No Account? Please ask a Penguin admin to create one for you</div>
    </div>
  );

};

export default Login;
