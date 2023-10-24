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
import { isAdmin } from "@/utils/index";


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
      // if the result status is 201, then we put the string
      res.status === 201 && router.push("/dashboard/login?success=Account has been created");
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


    
  const renderRegisterPage = () => isAdmin(session?.data?.user.name) ? (
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

        {error && "Something went wrong!"}
      </form>
      {/* <span className={styles.or}>- OR -</span> */}

      {/* <LinkBox as='article' maxW='sm' p='5' borderWidth='1px' rounded='md' style={{textAlign: 'center'}}>
        <Text mb='3'>If you have registered</Text>
          <Heading size='md' my='2'>
            <LinkOverlay href="/dashboard/login">Login with an existing account</LinkOverlay>
          </Heading>
      </LinkBox> */}
    </div>
  ) : (<Heading style={{textAlign: 'center'}}>Sorry, you are not allowed</Heading>)

  

  useEffect(() => {
    if (session.status === "loading") {
      setNode(loadingHTML());
    }
    else if (session.status === "unauthenticated") {
      router?.push("/dashboard/login");
    }
    else if (session.status === 'authenticated') {
      console.log('dashboard authenticated');
      setNode(renderRegisterPage());
    }
    
  }, [session.status]);


  return session.status === 'authenticated' && node;

};

export default Register;
