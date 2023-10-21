"use client"

import Image from 'next/image'
import React, { useTransition, useContext } from 'react'
import { MyThemeContext } from "../../context/MyThemeContext";
import moment from 'moment'
import Link from "next/link";
import styles from "./upload.module.css";
import lightExternalIcon from "../../../public/icons/external-link.svg"
import darkExternalIcon from "../../../public/icons/external-link-dark.svg"
import approvalIcon from "../../../public/icons/approval.svg"
import {
  Input,
  CircularProgress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton, 
  Button,
  useDisclosure,
} from '@chakra-ui/react'

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

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { mode } = useContext(MyThemeContext);

  // isPending - a boolean indicating whether the transition is currently in progress or not.
  // startTransition - a function that can be used to start the transition.
  const [isPending, startTransition] = useTransition();

  const handleUpdateSlug = async (e) => {
    console.log('--- handleUpdateSlug --');
    e.preventDefault();
    const inputSlug = e.target[0].value;
    console.log('inputSlug', inputSlug);
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
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <div style={{width: '20%'}}>
          {createdAt ? (<div style={{padding: 5}}>
            <Link href={secureImageUrl} target='_blank'>
                <Image src={secureImageUrl} 
                  alt='image' 
                  width={250}
                  height={200}
                />
              </Link>
            </div>) : (<Image src={secureImageUrl} 
                alt='image' 
                width={250}
                height={200}
            />)
          }
        </div>

        <div style={{display: 'flex', flexDirection: 'column', width: "70%"}}>
          
          <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
            {improvementsURL && (<i>see improvements</i>)}
            {improvementsURL && (<Link href={improvementsURL} target='_blank'>
              <Image priority height={48} width={48} src={mode==="dark" ? darkExternalIcon : lightExternalIcon} alt={improvementsURL} />
            </Link>)}
          </div>

          <div style={{padding: 10}}>
          {createdAt && updatedAt && <b>created at {parseTimeStampToDateTime(createdAt)}, updated at {parseTimeStampToDateTime(updatedAt)}</b>}
          </div>
          
          {<div style={{padding: 10}}>
          {createdAt && (<><span>{!title ? "no title" : title}</span> - <i>{!desc ? "no desc" : desc}</i> by <span style={{fontSize: 18}}>{name}</span></>)}
          </div>}
          
          <div style={{padding: '20px',  display: 'flex', flexDirection: 'column' }}>
            {isAdmin && (<div style={{display: 'flex', flexDirection: 'row', alignContent:'space-evenly'}}>
              <form onSubmit={handleUpdateSlug} style={{marginBottom: '10px', padding: '15px', width: '100%'}}>
                <Input placeholder='slug URL' size='lg' />
                <Button 
                  type='submit'
                  leftIcon={<Image alt={'update'} priority height={32} width={32} src={approvalIcon} />} 
                  colorScheme='yellow' variant='solid' style={{marginTop: '15px'}}
                >
                  Update Correction
                </Button>
              </form>
              </div>
            )}

           

            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Are you sure?</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <h1>Delete Homework <b><mark>{title}</mark></b></h1>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={() => {
                    startTransition(() => onClickDelete((bDone) => {
                        if (bDone) {
                          onClose();
                        }
                    }));
                  }}>Yes</Button>
                  <Button variant='ghost' onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>


          </div>
        </div>

        {createdAt ? (<Button  
              colorScheme='red'
              disabled={isPending}
              onClick={onOpen}>
                {isPending ? 'Loading...' : 'Delete Homework' } 
                {isPending && <CircularProgress size='25px' style={{margin: '5px'}} isIndeterminate color='red.300' />}
            </Button>) : (<button className={styles.defaultBtn} onClick={onClickDelete}> Delete
              </button>)}
      </div>
    </>
  )


}

export default HomeworkCard