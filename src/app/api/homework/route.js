import { NextResponse } from "next/server";
import cloudinary from 'cloudinary'
import connect from "@/utils/db";
import PenguinHomework from "@/models/PenguinHomework";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// export const GET = async (request) => {
//     const url = new URL(request.url);
//     const name = url.searchParams.get("name");
//     try {
//         await connect();

//         const filter = (name === 'rtsao' || name === 'admin') ? { name: {$ne: name} } : { name };
        
//         const allHmForUser = await PenguinHomework.find(filter).sort('-createdAt');

//         return new NextResponse(JSON.stringify(allHmForUser), { status: 200 });
//     } catch (err) {
//         return new NextResponse("Database Error", { status: 500 });
//     }
// };

export const GET = async (request) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const searchParams = url.searchParams.get("searchParams");

    try {
        await connect();

        const sort = '-_id';
        const limit = 10;
        const next = searchParams?.next || null;

        // fix this, we don't want to get all homework.

        // if its me or admin, search result should be all entries that are NOT rtsao or admin
        // if its the normal student name, then give me entries with the student name
        const nameFilter = (name === 'rtsao' || name === 'admin') ?  {$ne: name}  :  name;

        const allHmForUser = await PenguinHomework.find({
            _id: next
              ? sort === '_id'
                ? { $gt: next } : { $lt: next }
              : { $exists: true },
            name: nameFilter
          }).limit(limit).sort(sort)

        // const filter = (name === 'rtsao' || name === 'admin') ? { name: {$ne: name} } : { name };
        // const allHmForUser = await PenguinHomework.find(filter).sort('-createdAt');

        return new NextResponse(JSON.stringify(allHmForUser), { status: 200 });
    } catch (err) {
        console.log('GET - err', err);
        return new NextResponse("Database Error", { status: 500 });
    }
};

export const PUT = async(request) => {
    const body = await request.json();
    const { slug, publicId, link } = body;
    try {
        await connect();
        const res = await PenguinHomework.findOneAndUpdate({ publicId }, { slug,improvementsURL: link });
        console.log('PUT res: ', res);
        return new NextResponse(JSON.stringify(res), { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
}

export const DELETE = async (request) => {
    const body = await request.json();
    const { publicId } = body;
    try {
        await connect();
        const deletedDoc = await PenguinHomework.findOneAndDelete({publicId});
        if (deletedDoc && deletedDoc.publicId) {
            const res = await cloudinary.v2.uploader.destroy(publicId);
            console.log('res---->', res);
            if (res.result === 'ok') return new NextResponse(`Your Homework (id ${deletedDoc.publicId}) has been deleted`, { status: 200 });
            else return new NextResponse(`Error in deleting Homework (id ${deletedDoc.publicId})`, { status: 500 });
        }
            
    } catch (err) {
        console.log('err', err);
        return new NextResponse(`Database Error: ${err}`, { status: 500 });
    }
}