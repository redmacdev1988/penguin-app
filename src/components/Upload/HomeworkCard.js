"use client"

import Image from 'next/image'
import React, { useTransition, useContext, useState } from 'react'
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
  Icon,
  Flex,
  Box,
  Text,
  Square,
  Spacer,
  Heading,
  useToast
} from '@chakra-ui/react'
import { LuX, LuXCircle } from "react-icons/lu";

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
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [updatingCorrection, setUpdatingCorrection] = useState(false);
  const { mode } = useContext(MyThemeContext);

  // isPending - a boolean indicating whether the transition is currently in progress or not.
  // startTransition - a function that can be used to start the transition.
  const [isPending, startTransition] = useTransition();

  const handleUpdateSlug = async (e) => {
    e.preventDefault();
    
    const inputSlug = e.target[0].value;
    if (!inputSlug) {
      setUpdatingCorrection(false);
      return toast({
          position: 'top',
          title: 'Slug Input',
          description: 'Please enter a slug for tutorial',
          status: 'warning',
          duration: 8000,
          isClosable: true,
      });
    }

    setUpdatingCorrection(true);
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
          onClickRefreshHomework();
          setUpdatingCorrection(false);
        } else {
          // todo error box
        }
  
      } else {
        setUpdatingCorrection(false);
        return toast({
            position: 'top',
            title: 'Erroneous Slug',
            description: `Sorry, correction link for ${inputSlug} not available.`,
            status: 'warning',
            duration: 8000,
            isClosable: true,
        });
      }
    } catch (err) { console.log(err); }
  };

  return (
    <>
      <div style={{
        borderTop: `2px solid #FCB903`, 
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
                  width={300}
                  height={240}
                />
              </Link>
            </div>) : (<Image src={secureImageUrl} 
                alt='image' 
                width={300}
                height={240}
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
                  leftIcon={<Image alt={'update'} priority height={64} width={64} src={approvalIcon} />} 
                  colorScheme='yellow' variant='solid' style={{marginTop: '15px', width: '100%', height: '100%'}}
                >
                  <Box width="40%">
                    <Heading>Update Correction</Heading>
                  </Box>
                  <Spacer />
                  <Box width="50%">
                    {updatingCorrection && <CircularProgress size='30px' thickness='15px' isIndeterminate color='green.300' />}
                  </Box>
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
              size='lg'
              leftIcon={<Icon boxSize={6} as={LuXCircle} color='white.100' />} 
              colorScheme='red'
              disabled={isPending}
              onClick={onOpen}>
                {isPending ? 'Loading...' : 'Delete' } 
                {isPending && <CircularProgress size='25px' style={{margin: '5px'}} isIndeterminate color='red.300' />}
            </Button>) : (<button className={styles.defaultBtn} onClick={onClickDelete}> Delete
              </button>)}
      </div>
    </>
  )
}

export default HomeworkCard
