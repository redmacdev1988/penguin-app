import Image from 'next/image'
import React, { useTransition } from 'react'
import moment from 'moment'
import Link from "next/link";

function parseTimeStampToDateTime(str_date) {
  return moment(str_date, "YYYY-MM-DDTHH:mm").utc().format('l LT');
}

const strUrlToGetCorrectionLink = (inputSlug) => `https://chineseruleof8.com/wp-json/wp/v2/posts?slug=${inputSlug}`;

const HomeworkCard = ({ isAdmin, publicId, secureImageUrl, name, onClickRefreshHomework, onClickDelete, createdAt, updatedAt, slug, improvementsURL }) => {

  const [isPending, startTransition] = useTransition();

  const handleUpdateSlug = async (e) => {
    e.preventDefault();
    const inputSlug = e.target[0].value;

    try {
      const response = await fetch(strUrlToGetCorrectionLink(inputSlug), {
        method: "GET"
      });
      const data = await response.json();
      if (data && data[0]) {
        
        const { link: foundLink, slug: confirmedSlug } = data[0];
        console.log('foundLink', foundLink);
        console.log('confirmedSlug', confirmedSlug);
        const res = await fetch(`/api/homework`, {
          method: "PUT",
          body: JSON.stringify({ slug: confirmedSlug, publicId, link: foundLink.replace('http', 'https') }),
        });

        if (res && res.status === 200) {
          console.log('response ok', 'lets update corrections');
          onClickRefreshHomework();
        } else {
          // todo error box
        }
  
      } else {
        alert(`Sorry, correction link for ${inputSlug} not available.`);
        return;
      }
    } catch (err) { console.log(err); }
  };

  return (
    <>
    <h3>Name: {name}</h3>
    {isAdmin && (
      <form onSubmit={handleUpdateSlug} style={{width: '100%'}}>
        <input
          style={{width: '100%'}}
          type="text"
          placeholder="slug URL"
        />
        <button>Update Correction</button>
      </form>
    )}

      <div style={{display: 'flex', flex: '3 100%',  justifyContent: 'space-between', flexDirection: 'row' }}>
        <div style={{padding: 5}}>
            <Image src={secureImageUrl} 
              alt='image' 
              height={250}
              width={250}
            />
        </div>

        {improvementsURL && (<Link href={improvementsURL}>
            {improvementsURL}
        </Link>)}

        {createdAt && <b>created at {parseTimeStampToDateTime(createdAt)}</b>}
        {updatedAt && <mark>updated at {parseTimeStampToDateTime(updatedAt)}</mark>}
        <button type='button' onClick={() => startTransition(onClickDelete)} disabled={isPending}>
          { isPending ? 'Loading...' : 'Delete' }
        </button>
      </div>
    </>
  )

   

}

export default HomeworkCard