"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  InputGroup,
  Input,
  InputRightElement,
  InputLeftElement,
  Button,
  Icon,
  Heading,
  LinkBox,
  LinkOverlay,
  Text
} from '@chakra-ui/react'
import { LuUserCircle2, LuText } from "react-icons/lu";

const Register = () => {
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const session = useSession();
  const router = useRouter();
  const [node, setNode] = useState();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await res.json();
      const { id, msg } = result;

      // if the result status is 201, then we put the string
      res.status === 201 && router.push(`/dashboard?id=${id}&name=${name}&msg=${msg}`);
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };

  const loadingHTML = () => {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4.8em'}}>
      <h1>Loading...</h1>
    </div>;
  }


    
  const renderRegisterPage = () => (
    <div className={styles.container}>
      <Heading>Create an Account</Heading>

      <form onSubmit={handleSubmit} className={styles.form}>

        <InputGroup size='lg'>
          <InputLeftElement pointerEvents='none'>
            <Icon as={LuText} color='green.300' />
          </InputLeftElement>
          <Input size='lg' placeholder='Enter your Name' variant='outline' />
        </InputGroup>

        <InputGroup size='lg'>
          <InputLeftElement pointerEvents='none'>
            <Icon as={LuUserCircle2} color='orange.300' />
          </InputLeftElement>
          <Input size='lg' placeholder='Create an ID' variant='outline' />
        </InputGroup>

        <InputGroup size='lg'>
          <Input
            pr='4.5rem'
            type={show ? 'text' : 'password'}
            placeholder='Enter a Password'
          />
          <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                {show ? 'Hide' : 'Show'}
              </Button>
          </InputRightElement>
        </InputGroup>

        <button className={styles.button}>Register</button>

        {error && `Something went wrong: ${error}`}
      </form>

    </div>
  )

  useEffect(() => {
  setNode(renderRegisterPage());
  }, [show, error]);

  useEffect(() => {
    if (session.status === "loading") {
      setNode(loadingHTML());
    }
    else if (session.status === "unauthenticated") {
      router?.push("/dashboard/login");
    }
    else if (session.status === 'authenticated') {
      setNode(renderRegisterPage());
    }
    
  }, [session.status]);


  return  (session && session?.data?.user?.role!=='admin') ? (<Heading style={{textAlign: 'center'}}>Not Allowed</Heading>) : node;

};

export default Register;
