'use client'
import React, { useState, useEffect } from "react";
import HomeworkCard from './HomeworkCard'
import useInView from '@/hooks/useInView'
import { fetchHomework } from '@/actions/homeworkActions';
import { ToastContainer } from 'react-toastify';
// import { showInfoToast  } from "@/utils/toastMsgs";

import { useToast } from '@chakra-ui/react'

const PhotoList = ({  isAdmin, homeworkArr, author, nextCursor, refreshHomeworkData }) => {
  const toast = useToast()
  const {ref, inView} = useInView();
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(true);

  const handleLoadMore = async () => {

    if (!nextCursor || loading) {
      if (!nextCursor && !loading) {
        setNext(false);
        return;
      }
      return;
    }
    setLoading(true);

    const responseData = await fetchHomework({name: author, nextCursor});
    if (responseData) {
      const { allHmForUser, next_cursor} = responseData;
      refreshHomeworkData(allHmForUser, next_cursor);
      if (Array.isArray(allHmForUser) && allHmForUser.length === 0 && !next_cursor) {
        setNext(false);
      }
    }
    setLoading(false);
  }


  async function handleDeletePhoto(publicId) {
    try {
        return await fetch("/api/homework", {
          method: "DELETE",
          body: JSON.stringify({ publicId }),
          headers: { "Content-Type": "application/json" }
      });
      } catch (err) {
        console.log(err);
      }
  }

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
  }, [inView]);

  return (Array.isArray(homeworkArr) && homeworkArr.length > 0) ? 
  <>
    <div style={{ display: 'flex',  gap: 6,  flexWrap: 'wrap', margin: '10px 0',  }}>
      {
        homeworkArr.map(photo => (
          <HomeworkCard
            isAdmin={isAdmin}
            key={photo?.publicId} 
            publicId={photo?.publicId} 
            secureImageUrl={photo?.secureUrl} 
            name={photo?.name} 
            createdAt={photo?.createdAt} 
            updatedAt={photo?.updatedAt}
            slug={photo?.slug}
            improvementsURL={photo?.improvementsURL}
            onClickRefreshHomework={() => refreshHomeworkData()}
            onClickDelete={async (bDoneCB) => {
                const deleteRes = await handleDeletePhoto(photo?.publicId);
                if (deleteRes && deleteRes.status === 200) {
                    const { msg } = await deleteRes.json();
                    console.log('Deleted: ', msg);
                }
                const res = await refreshHomeworkData();
                if (res === true) {
                  bDoneCB(true);
                }
            }} 
            title={photo?.title}
            desc={photo?.desc}
            />
        ))
      }
      <ToastContainer />
    </div>
  
  <button 
    className='btn_loadmore' 
    disabled={loading} 
    ref={ref}
    style={{display: next ? 'block' : 'none'}}
    onClick={handleLoadMore}
  >
    { loading ? 'Loading...' : 'Load More' }
  </button>
    <h3>{ next ? 'Loading' : 'No more to load'}</h3>
  </> : (
    <h3>No homeworks yet</h3>
  ) 
}

export default PhotoList