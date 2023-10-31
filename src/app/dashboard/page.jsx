"use client"

import React, { useEffect, useState, useContext } from "react";
import styles from "./page.module.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { GlobalContext } from "@/context/GlobalContext";
import { DateTime } from "luxon";

import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Heading,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  CloseButton
} from '@chakra-ui/react'


const Dashboard = () => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [numOfHms, setNumOfHms] = useState(0);
  const [numOfCorrected, setNumOfCorrected] = useState(0);
  const [numOfDaysPerHm, setNumOfDaysPerHm] = useState(0);
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");
  const [node, setNode] = useState();
  const [msg, setMsg] = useState('');

  const { csFromUrl } = useContext(GlobalContext);

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  
  const { data, mutate, error, isLoading } = useSWR(
    `/api/homework?name=${session?.data?.user.name}&&limit=0`,
    fetcher
  );  


  useEffect(() => {
    const id = params.get("id");
    const name = params.get("name");
    if (id && name) {
      console.log('Dashboard', `You have registered user ${name} with id ${id}`);
      setMsg(`You have registered user ${name} with id ${id}`);
    }
  }, [params]);



  const loadingHTML = () => {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '4.8em'}}>
      <h1>Loading...</h1>
    </div>;
  }
  const renderDashboard = () => {
    return (
      <div className={styles.container}>
        {msg &&  <Alert status='success'>
          <AlertIcon />
          <Box>
            <AlertTitle>User Created!</AlertTitle>
            <AlertDescription>
              <b>{msg}</b>
            </AlertDescription>
          </Box>
        </Alert>}

        <Heading>Your Dashboard</Heading>
        <StatGroup>
          <Stat>
            <StatLabel># of homeworks</StatLabel>
            <StatNumber>{numOfHms}</StatNumber>
            <StatHelpText>{startDateStr} - {endDateStr}</StatHelpText>
          </Stat>

          <Stat>
            <StatLabel># of corrected</StatLabel>
            <StatNumber>{numOfCorrected}</StatNumber>
            <StatHelpText>
              {numOfCorrected && numOfHms && <h1> {(numOfCorrected/numOfHms).toFixed(2) * 100} % of your homework has been corrected</h1>} 
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel>One homework takes: </StatLabel>
            <StatNumber>
              {(numOfDaysPerHm >= 1) && <span>{numOfDaysPerHm} day(s)</span>}
              <span>{(numOfDaysPerHm < 1) && (numOfDaysPerHm * 24).toFixed(2)} hours</span>
            </StatNumber>
          </Stat>
        </StatGroup>
    </div>);
  }


  // when the data is updated, we need to re-render the react node
  useEffect(() => {
    if (data) {
      const { allHmForUser } = data;
      setNumOfHms(allHmForUser.length);
    }

    if (data) {
      const { allHmForUser } = data;
      const hmWithImprovements = allHmForUser.filter(hm => {
        const { improvementsURL } = hm;
        return improvementsURL;
      });

      console.log('total homeworks with improvements: ', hmWithImprovements);
      setNumOfCorrected(hmWithImprovements.length);
    }

    if (data) {
      const { allHmForUser } = data;
      
      if (allHmForUser && Array.isArray(allHmForUser) && allHmForUser.length > 0) {
        const sortedByCreatedAt = allHmForUser.sort((a,b) => {
          const left = DateTime.fromISO(a.createdAt);
          const right = DateTime.fromISO(b.createdAt);
          return left.ts - right.ts;
        });
  
        
        const firstDay = DateTime.fromISO(sortedByCreatedAt[0].createdAt);
        const latestDay = sortedByCreatedAt.length > 1 ? DateTime.fromISO(sortedByCreatedAt[sortedByCreatedAt.length - 1].createdAt) :
        DateTime.now();
    
        setStartDateStr(firstDay.toFormat('MM/dd/yyyy hh:mm', { locale: "cn" }));
        setEndDateStr(latestDay.toFormat('MM/dd/yyyy hh:mm', { locale: "cn" }));
  
        const diffInDays = latestDay.diff(firstDay, 'days');
        const days = diffInDays.toObject().days;
  
        console.log(`It takes ${days/allHmForUser.length} days to do 1 homework`);
        setNumOfDaysPerHm((days/allHmForUser.length).toFixed(2));
  
        const daysPerHm = days/allHmForUser.length;
        if (daysPerHm < 1) {
          // we need to calculate the hours
          console.log(`It takes  ${daysPerHm * 24} hours to do 1 homework`);
        }
      }
      setNode(renderDashboard());
    }
    
  }, [data])

  useEffect(() => {
    setNode(renderDashboard());
  }, [numOfDaysPerHm, numOfCorrected, msg])

  useEffect(() => {

    if (session.status === "loading") {
      setNode(loadingHTML());
    }
    else if (session.status === "unauthenticated") {
      localStorage.setItem(csFromUrl, "dashboard");
      router?.push("/dashboard/login");
    }
    else if (session.status === 'authenticated') {
    }
    
  }, [session.status]);

  return !isLoading && session.status === 'authenticated' && node;
};

export default Dashboard;
