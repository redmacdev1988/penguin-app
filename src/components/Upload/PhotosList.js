'use client'
import React, { useState, useEffect } from "react";
import HomeworkCard from './HomeworkCard'
import useInView from '@/hooks/useInView'

// renders the data

const PhotoList = ({  isAdmin, homeworkArr, author, refreshHomeworkData }) => {
  console.log('-- PhotoList --')
  const {ref, inView} = useInView();

  const [loading, setLoading] = useState(false);

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
    console.log('----- homework array was updated in PhotoList -----');
  }, [homeworkArr]);

  return (Array.isArray(homeworkArr) && homeworkArr.length > 0) ? 
  <>
    <div style={{
        display: 'flex', 
        gap: 6, 
        flexWrap: 'wrap',
        margin: '10px 0', 
    }}>
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
            onClickDelete={async () => {
                const deleteRes = await handleDeletePhoto(photo?.publicId);
                if (deleteRes && deleteRes.status === 200) {
                }
                refreshHomeworkData();
            }} 
            title={photo?.title}
            desc={photo?.desc}
            />
        ))
      }
    </div>
  
  <button className='btn_loadmore' disabled={loading} ref={ref}
      // onClick={handleLoadMore} style={{display: next ? 'block' : 'none'}}
  >
        { loading ? 'Loading...' : 'Load More' }
  </button>

  </> : (
    <h3>No homeworks yet</h3>
  ) 
}

export default PhotoList