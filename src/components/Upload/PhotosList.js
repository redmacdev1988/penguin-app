'use client'
import React, { useState } from "react";
import HomeworkCard from './HomeworkCard'


const PhotoList = ({ isAdmin, homeworkArr, author, refreshHomeworkData }) => {

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

  {return (Array.isArray(homeworkArr) && homeworkArr.length > 0) ?
   (
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
  ) : (
    <h3>No homeworks yet</h3>
  ) }
}

export default PhotoList