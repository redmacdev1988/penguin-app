
"use client";
import React, { useEffect, useState, useContext } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../../context/GlobalContext";
import UploadForm from '@/components/Upload/UploadForm';
import PhotoList from '@/components/Upload/PhotosList';
import { fetchHomework } from '@/actions/homeworkActions';
import { fetchUsers } from '@/actions/userActions';
import { SESSION_AUTHENTICATED, SESSION_UNAUTHENTICATED, SESSION_LOADING } from '@/utils/index';
import { CircularProgress, Input, Button, Flex, Text, Heading, Select } from '@chakra-ui/react'
import useFetchAndCacheTutorialsForAdmin from "@/hooks/useFetchAndCacheTutorialsForAdmin";

const loadingHTML = () => {
  return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '6.8em'}}>
    <h1>Loading...</h1>
  </div>;
}

const HomeworkPage = () => {
  const session = useSession();
  const router = useRouter();
  const [logged, setLogged] = useState(false);
  const [data, setData] = useState([]);
  const [students, setStudents] = useState([]);
  const [nextCursor, setNextCursor] = useState();
  const { lsKeyStr_fromUrl } = useContext(GlobalContext);
  const bUserAdmin = session?.data?.user.role === "admin";
  const [loading, setLoading] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [updatingSelectStudent, setUpdatingSelectStudent] = useState(false);

  useFetchAndCacheTutorialsForAdmin({bFull: true, isAdmin: bUserAdmin});
  
  useEffect(() => {
    (async () => {
      const responseData = await fetchHomework({ user: session?.data?.user });
      if (responseData) {
        const {allHmForUser, next_cursor} = responseData;
        setData([...allHmForUser]);
        setNextCursor(next_cursor);
      }

      const responseUsers = await fetchUsers({});
      if(responseUsers) {
        console.log('response: ', responseUsers);
        const {allUsers} = responseUsers;
        setStudents(allUsers);
      }
    })();
  }, []);



  useEffect(() => {
    setLoading(false);
    setLogged(true);
  }, [data]);

  useEffect(() => { 
    if (session.status === SESSION_LOADING) {
      setLoading(true);
    }

    if (session.status === SESSION_UNAUTHENTICATED) {
      localStorage.setItem(lsKeyStr_fromUrl, "homework");
      router?.push("/dashboard/login");
    }

    if (session.status === SESSION_AUTHENTICATED) {
      (async () => {
        const responseData = await fetchHomework({ user: session?.data?.user });
        if (responseData) {
          const {allHmForUser, next_cursor} = responseData;
          setData([...allHmForUser]);
          setNextCursor(next_cursor);
        }
      })();
    } 
  }, [session.status]);

  const handleStudentOnChange = (e) => {

    setUpdatingSelectStudent(true);

    if (!e.target.value) {
      console.log(`User wants to look at ALL users`);
      setUpdatedUser(session?.data?.user);
      fetchHomework({user: session?.data?.user, limit: 5}).then(res => {
        if (res) {
          const {allHmForUser, next_cursor} = res;
          setData([...allHmForUser]);
          setNextCursor(next_cursor);
        }

        setUpdatingSelectStudent(false);
      });
      return;
    } 

    const userId = e.target.value.split('-')[1];
    const userName = e.target.value.split('-')[0];
    const userObj = { 
      email: userId, 
      name: userName, 
      role: "user"
    }
    setUpdatedUser(userObj);
    fetchHomework({user: userObj, limit: 5}).then(res => {
      if (res) {
        const {allHmForUser, next_cursor} = res;
        setData([...allHmForUser]);
        setNextCursor(next_cursor);
      }
      setUpdatingSelectStudent(false);
    });
  }


  if (loading) return loadingHTML();

  return logged && !loading && (
    <div className={styles.container}>
      {updatingSelectStudent && <CircularProgress isIndeterminate color='green.300' />}
      {bUserAdmin && students && Array.isArray(students) && 
      <Select
        onChange={handleStudentOnChange}
        bg='black'
        borderColor='tomato'
        color='white'
        placeholder='Students'>
        {students.map((student, index) => {
          const { name, role, email } = student;
          return role === 'user' && <option value={`${name}-${email}`} key={email}>{name}, {email}</option>
        })}
      </Select>}

      {!bUserAdmin && <Heading size="lg" fontFamily={"mono"} color={"gray.500"}>Your Homework</Heading>}
      {!bUserAdmin && <UploadForm refreshHomeworkData={async() => {
        const responseData = await fetchHomework({user: session?.data?.user, limit: data.length + 1});
        if (responseData) {
          const {allHmForUser, next_cursor} = responseData;
          setData(allHmForUser);
          setNextCursor(next_cursor);
        }
      }}/>}
      <Heading size="lg" fontFamily={"mono"} color={"white"}>
        {bUserAdmin ? `Welcome Administrator ${session?.data?.user.name}` : ``}
      </Heading>

      {data && data && Array.isArray(data) && data.length > 0 && 
      <PhotoList
        nextCursor={nextCursor}
        isAdmin={bUserAdmin} 
        homeworkArr={data || []} 
        user={updatedUser || session?.data?.user} 
        refreshHomeworkData={ async (additionalData, nextCursor) => {
          if (additionalData) {
            setData(prev => [...prev, ...additionalData]);
            setNextCursor(nextCursor)
          } else { // update correctional link
            const responseData = await fetchHomework({user: session?.data?.user, limit: data.length});
            if (responseData) {
              const {allHmForUser, next_cursor} = responseData;
              setData(allHmForUser);
              setNextCursor(next_cursor);
            }
          }
          return true;
        }} 
      />}
    </div>
  );
};

export default HomeworkPage;


