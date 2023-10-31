'use client'
import { useRef, useState } from 'react'
import HomeworkCard from './HomeworkCard';
import { uploadHomework } from '@/actions/uploadActions';
import { useSession } from "next-auth/react";
import imageCompression from 'browser-image-compression';
import styles from "./upload.module.css";
import { useToast } from '@chakra-ui/react'
import { CircularProgress, Input, Button, Flex, Text, Heading, Box } from '@chakra-ui/react'


const UploadForm = ({ refreshHomeworkData }) => {
    const toast = useToast()
    const session = useSession();
    const formRef = useRef();
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [progressing, setProgressing] = useState(false);

    const fileInputRef = useRef(null);
    const [letter, setLetter] = useState("");


    const handleUploadHomeworkClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click(); // programmatically click the file input's browse button
        }
    };

    // when tne file input has browsed and loaded in files, we come here

    async function handleInputFiles(e) {
        const files = e.target.files;
        console.log('files', files);
        
        debugger
        if (files.length > 3) {
            formRef.current.reset();
            return toast({
                position: 'top',
                title: 'Upload Warning',
                description: 'Upload up to 3 image files only.',
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
            
            console.log('newFiles', newFiles.length);
            setFiles(newFiles);

        } catch (error) {
            console.log('Compress Image error: ', error);
        }

        formRef.current.reset();
        
    }

    async function handleDeleteLocalStateFile(index) {
        const newFiles = files.filter((_, i) => i !== index) // filter out the one with the index
        setFiles(newFiles) // set our files again
    }

    // when title string is being updated this is called
    const handleInputTitle = async (e) => {
        e.preventDefault();
        setTitle(e.target.value);    
    }

    // when description string is being updated this is called
    const handleInputDesc = async (e) => {
        e.preventDefault();
        setDesc(e.target.value);
    }

    // when upload homework form is submitted
    const handleUpload = async (e) => {
        debugger
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


            if (!title || !desc) {
                setDisabled(false);
                return toast({
                    position: 'top',
                    title: 'Upload Warning',
                    description: 'Please enter a title and a description',
                    status: 'warning',
                    duration: 9000,
                    isClosable: true,
                });
            }

            setProgressing(true);

            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file)
            })
            formData.append('title', title);
            formData.append('desc', desc);
    
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
                    description: `UploadForm.jsx - Error: ${res?.errMsg}`,
                    status: 'warning',
                    duration: 9000,
                    isClosable: true,
                });

            } else {

                const registerUserRes = JSON.parse(res);
                console.log('res', registerUserRes);
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

    const handleAnswerChange = (evt) => {
        console.log(evt.code, `key ${evt.key}  keyCode ${evt.keyCode}`);
        setLetter(`${evt.code} ${evt.keyCode}`);
    }

    return (
        <form onSubmit={handleUpload} ref={formRef} style={{width: "100%", textAlign: 'center'}}>
            <h1>Letter pressed: {letter}</h1>
            <div style={{ minHeight: 200, margin: '10px 0', padding: 10}}>
                <div>
                    
                    <Flex direction="column" width="100%" minHeight="300px" alignItems="center" justifyContent="center">
                        <h5>3 images or less</h5>
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

                        <input className={styles.defaultBtn}
                            type="file" accept='image/*' 
                            ref={fileInputRef} 
                            onChange={handleInputFiles} 
                            style={{ display: 'none' }} 
                            multiple  
                        />

                    </Flex>

                </div>
                
                <div style={{display: 'flex', gap: '10px', alignItems: 'center', alignContent:'space-evenly', flexDirection: 'column'}}>

                    {<Flex p={5} w={"100%"} justifyContent={"space-between"} alignItems={"center"}>
                        <Box flex='1' bg='#111'>
                            <Flex direction={"column"}>
                                <Heading size="lg" fontFamily={"mono"} color={"gray.500"}>{files.length} files loaded</Heading>
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
                    </Flex>}

                    <Input 
                        style={{marginTop: '10px', height: '100px', fontSize: 'xxx-large'}} 
                        placeholder="homework title" 
                        size='lg' 
                        onChange={handleInputTitle} 
                        onKeyDown={handleAnswerChange}
                    />
                    <Input style={{marginTop: '10px', height: '100px', fontSize: 'xxx-large'}} placeholder="homework description" size='lg' onChange={handleInputDesc} />
                </div>

                <button 
                    className={`${disabled ? styles.disabled : styles.enabled} ${styles.defaultBtn}`} 
                    disabled={disabled} 
                    style={{ height: '80px', borderRadius: '20px', marginTop: '30px', marginBottom: '20px'}}
                >
                    Upload Homework
                    {progressing && <CircularProgress style={{margin: '10px'}} isIndeterminate color='green.300' />}
                </button>

            </div>
      </form>
    )
}

export default UploadForm