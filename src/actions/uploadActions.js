'use server'

import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary'
import os from 'os' // no need to install through npm
import fs from 'fs/promises'
import path from 'path'
import PenguinHomework from '@/models/PenguinHomework';
import { revalidatePath } from 'next/cache';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function saveHomeworkToLocal(formData) {
    
    const hmPhotoFiles = formData.getAll('files');
    // TODO make sure you get other stuff (hm title, body, description) from formData here.
    // formData.get('title')
    // formData.get('body')
    // formData.get('description')

    const multiplePhotoBuffersPromises = hmPhotoFiles.map(photo => (
        photo.arrayBuffer()
          .then(data => {
            const buffer = Buffer.from(data)
            const name = uuidv4()
            const ext = photo.type.split("/")[1]
    
            const tempdir = os.tmpdir();
            const uploadDir = path.join(tempdir, `/${name}.${ext}`) // work in Vercel
            fs.writeFile(uploadDir, buffer)
    
            return { filepath: uploadDir, filename: photo.name }
          })
      ))
      return await Promise.all(multiplePhotoBuffersPromises)
}

async function uploadHomeworkToCloudinary(newFiles) {
    console.log('uploadHomeworkToCloudinary - # of files to upload to cloudinary:', newFiles.length);
    const multipleHmPhotosPromise = newFiles.map(file => (
        cloudinary.v2.uploader.upload(file.filepath, { folder: 'nextjs_upload' })
    ));
    return await Promise.all(multipleHmPhotosPromise)
}

export async function uploadHomework(formData, author) {
    console.log(`* Upload Homework for user ${author}`);
    try {
        const hmPhotoFiles = await saveHomeworkToLocal(formData);

        const homeworkPhotos = await uploadHomeworkToCloudinary(hmPhotoFiles);
    
        if (homeworkPhotos && Array.isArray(homeworkPhotos) && homeworkPhotos.length) {
    
             // Delete photo files in temp folder after successful upload!
             hmPhotoFiles.map(file => fs.unlink(file.filepath))
    
            const homeworkModelArr = homeworkPhotos.map(hmObj => {
                const newHomework = new PenguinHomework({
                    publicId: hmObj.public_id, 
                    secureUrl: hmObj.secure_url,
                    name: author,
                    slug: ""
                    // todo: insert homework title
                    // todo: homework description
                })
                return newHomework;
            });
    
            console.log('# of homework Models: ', homeworkModelArr.length);
    
            await PenguinHomework.insertMany(homeworkModelArr);
            revalidatePath("/homework/page")
            return { msg: 'Upload Success!' }
        }
    } catch (error) { return { errMsg: error.message } }
}


export async function revalidate(path){
    revalidatePath(path)
}