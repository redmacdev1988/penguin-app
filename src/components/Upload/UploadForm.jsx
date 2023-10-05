'use client'
import { useRef, useState } from 'react'
import HomeworkCard from './HomeworkCard';
import ButtonSubmit from './ButtonSubmit';
import { uploadHomework } from '@/actions/uploadActions';
import { revalidatePath } from 'next/cache'
import { useSession } from "next-auth/react";

const UploadForm = ({ refreshHomeworkData }) => {

    const session = useSession();
    const formRef = useRef();
    const [files, setFiles] = useState([]);

    async function handleInputFiles(e) {
        const files = e.target.files;

        // name : "simple-get-route.png"
        // size : 132148
        // type : "image/png"
        console.log(files[0]);
        
        // for each file, if its less than a mb, and it starts with image, then 
        // we filter it in.

        const newFiles = [...files].filter(file => {
          if(file.size < 1024*1024 && file.type.startsWith('image/')){
            return file;
          }
        })
    
        setFiles(newFiles);
        formRef.current.reset();
    }

    async function handleDeleteLocalStateFile(index) {
        const newFiles = files.filter((_, i) => i !== index) // filter out the one with the index
        setFiles(newFiles) // set our files again
    }

    async function handleUpload(e) {
        e.preventDefault();
        if(!files.length) return alert('No image files are selected.')
        if(files.length > 3) return alert('Upload up to 3 image files.')
    
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file)
        })
    
        if (!session || !session?.data?.user) {
            throw Error("Error, no user associated with Sesion");
        }

        const res = await uploadHomework(formData, session?.data?.user.name);
        if(res?.errMsg) {
            alert(`Error: ${res?.errMsg}`);
            console.log(`Error: ${res?.errMsg}`);
        }
    
        setFiles([]);
        formRef.current.reset();
        refreshHomeworkData();
    }

    return (
        <form onSubmit={handleUpload} ref={formRef}>
            <div style={{background: '#ddd', minHeight: 200, margin: '10px 0', padding: 10}}>
    
                <input type="file" accept='image/*' multiple onChange={handleInputFiles} />
        
                <h5 style={{background: 'red', minHeight: 100, margin: '10px 0', padding: '10px'}}>
                    (*) Only accept image files less than 1mb in size. Up to 3 photo files.
                </h5>
        
                {/* Preview Images */}
                <div style={{display: 'flex', gap: 10, flexWrap: 'wrap', margin: '10px 0'}}>
                    {
                    files.map((file, index) => (
                        <HomeworkCard 
                            key={index} 
                            secureImageUrl={URL.createObjectURL(file)} 
                            onClick={() => handleDeleteLocalStateFile(index)} 
                        />
                    ))
                    }
                </div>
    
            </div>
  
            <ButtonSubmit value="Upload to Cloudinary" />
  
      </form>
    )
}

export default UploadForm