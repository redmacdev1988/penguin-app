import Image from 'next/image'
import React, { useTransition, useContext } from 'react'
import { ThemeContext } from "../../context/ThemeContext";
import moment from 'moment'
import Link from "next/link";
import styles from "./upload.module.css";
import lightExternalIcon from "../../../public/icons/external-link.svg"
import darkExternalIcon from "../../../public/icons/external-link-dark.svg"

function parseTimeStampToDateTime(str_date) {
  return moment(str_date, "YYYY-MM-DDTHH:mm").utc().format('l LT');
}

const strUrlToGetCorrectionLink = (inputSlug) => `https://chineseruleof8.com/wp-json/wp/v2/posts?slug=${inputSlug}`;

const HomeworkCard = ({ 
  isAdmin, 
  publicId, 
  secureImageUrl, 
  name, 
  onClickRefreshHomework, 
  onClickDelete, 
  createdAt, 
  updatedAt, 
  slug, 
  improvementsURL,
  title,
  desc
}) => {

  const { mode } = useContext(ThemeContext);

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
        const res = await fetch(`/api/homework`, {
          method: "PUT",
          body: JSON.stringify({ slug: confirmedSlug, publicId, link: foundLink }),
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
      <div style={{
        borderTop: '2px solid green', 
        borderTopStyle: 'dotted',
        paddingTop: '30px',
        paddingBottom: '30px',
        display: 'flex', 
        flex: '1 100%',  
        justifyContent: 'space-evenly', 
        flexDirection: 'row' 
      }}>

        {secureImageUrl && <div style={{padding: 5}}>
          <Link href={secureImageUrl} target='_blank'>
              <Image src={secureImageUrl} 
                alt='image' 
                height={250}
                width={250}
              />
            </Link>
        </div>}
      
        <div style={{display: 'flex', flexDirection: 'column'}}>
          
          <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
            {improvementsURL && (<i>see improvements</i>)}
            {improvementsURL && (<Link href={improvementsURL} target='_blank'>
              <Image priority height={48} width={48} src={mode==="dark" ? darkExternalIcon : lightExternalIcon} alt={improvementsURL} />
            </Link>)}
          </div>

          <div style={{padding: 10}}>
          {createdAt && updatedAt && <b>created at {parseTimeStampToDateTime(createdAt)}, <mark>updated at {parseTimeStampToDateTime(updatedAt)}</mark></b>}
          </div>
          
          {<div style={{padding: 10}}>
          <span style={{fontSize: 18}}>{name}</span> - <span style={{color: '#53c28b'}}>{!title ? "no title" : title}</span>, <i>{!desc ? "no desc" : desc}</i>
          </div>}
          
          <div style={{padding: '20px', border: '1px solid #53c28b', display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
            {isAdmin && (<div style={{display: 'flex', flexDirection: 'row', alignContent:'space-evenly'}}>
              <form onSubmit={handleUpdateSlug} style={{marginBottom: '10px', padding: '15px', width: '100%'}}>
                <input style={{width: '70%'}} type="text" placeholder="slug URL" />
                <button className={styles.defaultBtn}  style={{float: 'right', width: '20%'}}>Update Correction</button>
              </form>
              </div>
            )}

            <button
              className={styles.defaultBtn} 
              type='button' 
              onClick={() => startTransition(onClickDelete)} 
              disabled={isPending}
            >
              { isPending ? 'Loading...' : 'Delete Homework' }
            </button>

          </div>

        </div>
      </div>
 
    </>
  )

   

}

export default HomeworkCard