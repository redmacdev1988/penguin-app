"use server"

import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary'
import os from 'os' // no need to install through npm
import fs from 'fs/promises'
import path from 'path'
import PenguinHomework from '@/models/PenguinHomework';
import { revalidatePath } from 'next/cache';
import connect from "@/utils/db";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function saveHomeworkToLocal(formData) {
    const hmPhotoFiles = formData.getAll('files');
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
    ));
    return await Promise.all(multiplePhotoBuffersPromises)
}

// todo make sure folder matches names
async function uploadHomeworkToCloudinary(newFiles, user) {
    alert(user.name);
    const multipleHmPhotosPromise = newFiles.map(file =>  {
        alert(file.filePath)
            return cloudinary.v2.uploader.upload(file.filepath, { folder: `${user.name}-${user.email}` })
        }
    );
    alert(multipleHmPhotosPromise.length);
    return await Promise.all(multipleHmPhotosPromise)
}

export async function uploadHomework(formData, user) {
    const title = formData.get('title')
    const desc = formData.get('desc');

    try {
        
        const hmPhotoFiles = await saveHomeworkToLocal(formData); // ok
        const bValidArr = hmPhotoFiles && Array.isArray(hmPhotoFiles) && hmPhotoFiles.length > 0; // ok

        // return JSON.stringify({ msg: 'apload success! 22:58', length: bValidArr ? hmPhotoFiles.length : -1});

        if (bValidArr) {
            console.log('Homework saved to local √');

            const homeworkPhotos = await uploadHomeworkToCloudinary(hmPhotoFiles, user);
            const bValidHmPhotos = homeworkPhotos && Array.isArray(homeworkPhotos) && homeworkPhotos.length > 0;

            return JSON.stringify({ msg: 'cloudinary success! 02:07', length: bValidHmPhotos ? homeworkPhotos.length : -1, user});

            /*
            if (homeworkPhotos && Array.isArray(homeworkPhotos) && homeworkPhotos.length > 0) {
                console.log('uploaded to Cloudinary √');

                // Delete photo files in temp folder after successful upload!
                hmPhotoFiles.map(file => fs.unlink(file.filepath))
        
                const homeworkModelArr = homeworkPhotos.map(hmObj => {
                    const newHomework = new PenguinHomework({
                        publicId: hmObj.public_id, 
                        secureUrl: hmObj.secure_url,
                        name: user.name,
                        slug: "",
                        title,
                        desc
                    })
                    return newHomework;
                });
                
                await connect();
                console.log('uploadHomework - db connected √');
                const dbOpResponse = await PenguinHomework.insertMany(homeworkModelArr);
                if (dbOpResponse && Array.isArray(dbOpResponse) && dbOpResponse.length > 0) {
                    console.log('uploadHomework - uploaded to Mongodb √');
                    revalidatePath("/homework/page");
                    // return JSON.stringify({ msg: 'Upload Success!', title, desc});

                } else {
                    throw Error ({ message: `Uh oh, error in writing ${homeworkModelArr.length} homework images to mongodb` });
                }
            } else {
                console.log(`X Could not upload to Cloudinary`);
            }
            */
        } else {
            const errorMsg = 'Error at saveHomeworkToLocal - Could not save homework to local';
            console.log('uploadActions', errorMsg);
            return JSON.stringify({ msg: errorMsg});
        }    

        // return JSON.stringify({msg:'hello'}); // works!
        // return JSON.stringify({ msg: 'Upload Success!', title, desc});
    } catch (error) { 
        return { errMsg: error } 
    }
}


export async function revalidate(path){
    revalidatePath(path)
}