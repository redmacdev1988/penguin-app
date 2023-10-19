'use client'
import { useRef, useState } from 'react'
import HomeworkCard from './HomeworkCard';
import { uploadHomework } from '@/actions/uploadActions';
import { useSession } from "next-auth/react";
import imageCompression from 'browser-image-compression';
import styles from "./upload.module.css";
import { useToast } from '@chakra-ui/react'
import { ChakraProvider, CircularProgress, Input, Button } from '@chakra-ui/react'


const UploadForm = ({ refreshHomeworkData }) => {
    const toast = useToast()
    const session = useSession();
    const formRef = useRef();
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [progressing, setProgressing] = useState(false);

    async function handleInputFiles(e) {
        const files = e.target.files;

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
                console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);
                compressedFilesArr.push(compressedFile);
            }
            
            const newFiles = [...compressedFilesArr].filter(file => {
                if(file.type.startsWith('image/')){
                    return file;
                }
            })
      
            console.log(`Setting ${newFiles.length} # of image files`);
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

    const handleInputTitle = async (e) => {
        e.preventDefault();
        setTitle(e.target.value);    
    }

    const handleInputDesc = async (e) => {
        e.preventDefault();
        setDesc(e.target.value);
    }

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
                console.log(`Error: ${res?.errMsg}`);
                showErrorToast(`Error: ${res?.errMsg}`);
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
        <ChakraProvider>
        <form onSubmit={handleUpload} ref={formRef}>

            <div style={{ minHeight: 200, margin: '10px 0', padding: 10}}>
                <div>
                    <input className={styles.defaultBtn} type="file" accept='image/*' multiple onChange={handleInputFiles} />
                </div>
                
                <div style={{display: 'flex', alignItems: 'left', alignContent:'space-evenly', flexDirection: 'column'}}>
                    <Input style={{marginTop: '20px'}} placeholder="homework title" size='lg' onChange={handleInputTitle} />
                    <Input style={{marginTop: '20px'}} placeholder="homework description" size='lg' onChange={handleInputDesc} />
                </div>
                <button 
                    className={`${disabled ? styles.disabled : styles.enabled} ${styles.defaultBtn}`} 
                    disabled={disabled}
                    style={{ marginTop: '30px', marginBottom: '20px'}}
                >
                    Upload Homework
                    {progressing && <CircularProgress style={{margin: '10px'}} isIndeterminate color='green.300' />}
                </button>

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
                <h5>3 images or less</h5>
            </div>
      </form>
      </ChakraProvider>
    )
}

export default UploadForm