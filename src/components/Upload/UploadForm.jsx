'use client'
import { useRef, useState } from 'react'
import HomeworkCard from './HomeworkCard';
import { uploadHomework } from '@/actions/uploadActions';
import { useSession } from "next-auth/react";
import imageCompression from 'browser-image-compression';
import styles from "./upload.module.css";
import { useToast } from '@chakra-ui/react'
import { CircularProgress, HStack, Button, Flex, Text, Heading, Box, Icon, useRadioGroup } from '@chakra-ui/react'
import { DateTime } from "luxon";
import RadioCard from './RadioCard';


const VOCAB_STR = 'Vocab';
const ESSAY_STR = 'Essay';

const homeworkOptionsArr = [VOCAB_STR, ESSAY_STR];

const UploadForm = ({ refreshHomeworkData }) => {

    const toast = useToast()
    const session = useSession();
    const formRef = useRef();
    const [files, setFiles] = useState([]);

    const [disabled, setDisabled] = useState(false);
    const [progressing, setProgressing] = useState(false);

    const fileInputRef = useRef(null);
    const [homeworkType, setHomeworkType] = useState(VOCAB_STR)

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'Homework',
        defaultValue: VOCAB_STR,
        onChange: (titleStr) => {
            setHomeworkType(titleStr);
        },
    })
    const group = getRootProps();

    const handleUploadHomeworkClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click(); // programmatically click the file input's browse button
        }
    };

    // when tne file input has browsed and loaded in files, we come here

    async function handleInputFiles(e) {
        const files = e.target.files;
        if (files.length > 3) {
            formRef.current.reset();
            return toast({
                position: 'top',
                title: 'Upload Warning',
                description: 'Up to 3 image files only.',
                status: 'warning',
                duration: 9000,
                isClosable: true,
            });
        }

        const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
        }

        try {
            const compressedFilesArr = [];
            for (let i = 0; i < files.length; i++) {
                const compressedFile = await imageCompression(files[i], options);
                compressedFilesArr.push(compressedFile);
            }
            const newFiles = [...compressedFilesArr].filter(file => {
                if(file.type.startsWith('image/')){
                    return file;
                }
            })
            setFiles(newFiles);
        } catch (error) {
            console.log('Compress Image error: ', error);
        }

        formRef.current.reset();
        
    }

    // called when local files are deleted after browsing
    async function handleDeleteLocalStateFile(index) {
        const newFiles = files.filter((_, i) => i !== index) // filter out the one with the index
        setFiles(newFiles) // set our files again
    }


    // when upload homework form is submitted
    const handleUpload = async (e) => {
        if (!disabled) {
            setDisabled(true);
            e.preventDefault();
     
            if(!files.length || files.length === 0)  {
                setDisabled(false);
                return toast({
                    position: 'top',
                    title: 'Upload Warning',
                    description: 'You must select an image file',
                    status: 'warning',
                    duration: 9000,
                    isClosable: true,
                });
            }

            setProgressing(true);

            // todo check this out.
            // shouldn't it be formData.append('files', files);

            // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
            // formData.append("name", true);
            // formData.append("name", 72);
            // formData.getAll("name"); // ["true", "72"]
            
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file)
            })

            formData.append('title',  session?.data?.user.name + '-' + DateTime.now().toFormat('MM-dd-yyyy-hh:mm', { locale: "cn" }));
            formData.append('desc', homeworkType);
    
            console.log('files and everything appended to form √');
    
            if (!session || !session?.data?.user) {
                throw Error("Error, no user associated with Session");
            }
    
            const res = await uploadHomework(formData, session?.data?.user);
        
            if(res?.errMsg) {
                console.log(`UploadForm.jsx - Error: ${res?.errMsg}`);
                toast({
                    position: 'top',
                    title: 'Error',
                    description: `${res?.errMsg}`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });

            } else {
                const registerUserRes = JSON.parse(res);
                const { msg, title, desc } = registerUserRes;
                toast({
                    position: 'top',
                    title: msg,
                    description: `You have uploaded homework ${title}, ${desc}`,
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                });
            }

            setFiles([]);
            formRef.current.reset();
            setDisabled(false);

            setProgressing(false);
            refreshHomeworkData();

        } else {
            console.log('Please wait, submit btn disabled, already processing upload request');
        } 
    }

    return (
        <form onSubmit={handleUpload} ref={formRef} style={{width: "100%", textAlign: 'center'}}>
            <div style={{ minHeight: 200, margin: '10px 0', padding: 10}}>
                <div>
                    <Flex direction="column" width="100%" minHeight="300px" alignItems="center" justifyContent="center">
                        <Flex flex={1} style={{width: '100%'}} justifyContent={"center"} alignItems={"center"}>
                            <Button height='120px' width='100%' border='2px' borderColor='green.500' variant='solid' size='lg' 
                                shadow={"xl"} backgroundColor="gray.700" _hover={{ backgroundColor: 'gray.800' }} 
                                _active={{ backgroundColor: "gray.900" }} 
                                style={{borderRadius: '50px'}}
                                onClick={handleUploadHomeworkClick}
                            >
                                <Heading size="lg" fontFamily={"mono"} color={"white"}>Browse</Heading>
                            </Button>
                        </Flex>

                        <div style={{display: 'flex', gap: '10px', alignItems: 'center', alignContent:'space-evenly', flexDirection: 'column'}}>
                            <Flex p={5} w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                                <Box flex='1' bg='#111'>
                                    <Flex direction={"column"}>
                                        {/* <Heading size="lg" fontFamily={"mono"} color={"gray.500"}>{files.length} files loaded</Heading> */}
                                        {/* Preview Images */}
                                        <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', margin: '10px 0'}}>
                                            {
                                            files.map((file, index) => (
                                                <HomeworkCard 
                                                    key={index} 
                                                    secureImageUrl={URL.createObjectURL(file)} 
                                                    onClickDelete={() => handleDeleteLocalStateFile(index)} 
                                                />
                                            ))
                                            }
                                        </div>
                                    </Flex>
                                </Box>    
                            </Flex>
                        </div>



                        <Flex direction="column" width="100%" alignItems={"center"} justifyContent={"space-evenly"}>
                            <Box flex='1' bg='#111' style={{width: '100%'}}>
                                <HStack {...group} style={{ display: 'flex', justifyContent: 'space-evenly'}}>
                                    {homeworkOptionsArr.map((value) => {
                                        const radio = getRadioProps({ value })
                                        return (
                                        <RadioCard key={value} {...radio}>
                                            {value}
                                        </RadioCard>
                                        )
                                    })}
                                </HStack>
                            </Box>
                        </Flex>
                        <input className={styles.defaultBtn}
                            type="file" accept='image/*' 
                            ref={fileInputRef} 
                            onChange={handleInputFiles} 
                            style={{ display: 'none' }}  
                        />
                    </Flex>
                </div>
                
                

                <button 
                    className={`${disabled ? styles.disabled : styles.enabled} ${styles.defaultBtn}`} 
                    disabled={disabled} 
                    style={{ borderRadius: '50px', marginTop: '30px', marginBottom: '20px', padding: '50px'}}
                >
                    
                    <Heading size="lg" fontFamily={"mono"} color={"white"}>Upload Homework</Heading>
                    {progressing && <CircularProgress style={{margin: '10px'}} isIndeterminate color='green.300' />}
                </button>

            </div>
      </form>
    )
}

export default UploadForm