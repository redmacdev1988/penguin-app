'use client'
import { useRef, useState } from 'react'
import HomeworkCard from './HomeworkCard';
import ButtonSubmit from './ButtonSubmit';
import { uploadHomework } from '@/actions/uploadActions';
import { revalidatePath } from 'next/cache'
import { useSession } from "next-auth/react";
import imageCompression from 'browser-image-compression';
import styles from "./upload.module.css";

const UploadForm = ({ refreshHomeworkData }) => {

    const session = useSession();
    const formRef = useRef();
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [disabled, setDisabled] = useState(false);

    async function handleInputFiles(e) {
        console.log('handleInputFiles start √');

        const files = e.target.files;
        // name : "simple-get-route.png"
        // size : 132148
        // type : "image/png"
        // console.log(files[0]);
        
        const options = {
            maxSizeMB: 0.5,
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
        console.log('--===> handleUpload ');
        e.preventDefault();
 
        console.log(`title - ${title} description - ${desc}`);

        if(!files.length) return alert('No image files are selected.')
        if(files.length > 3) return alert('Upload up to 3 image files.')
    
        console.log('# of files OK √');

        setDisabled(true);

        const formData = new FormData();
        // image files
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
            alert(`Error: ${res?.errMsg}`);
            console.log(`Error: ${res?.errMsg}`);
            setDisabled(false);
        } else {
            setDisabled(false);
        }
    
        setFiles([]);
        formRef.current.reset();
        refreshHomeworkData();
    }

    return (
        <form onSubmit={handleUpload} ref={formRef}>
            <div style={{ minHeight: 200, margin: '10px 0', padding: 10}}>
    
                <div>
                    <input className={styles.defaultBtn} type="file" accept='image/*' multiple onChange={handleInputFiles} />
                </div>
                
                <div style={{display: 'flex', alignItems: 'left', alignContent:'space-evenly', flexDirection: 'column'}}>
                    <input className={styles.textBox} type="text" placeholder="homework title" onChange={handleInputTitle} />
                    <input className={styles.textBox} type="text" placeholder="homework description" onChange={handleInputDesc} />
                </div>
        
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


            <button classNames={styles.defaultBtn} >
                Upload Homework
            </button>
  
      </form>
    )
}

export default UploadForm