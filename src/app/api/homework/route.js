import { NextResponse } from "next/server";
import cloudinary from 'cloudinary'
import connect from "@/utils/db";
import PenguinHomework from "@/models/PenguinHomework";



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const GET = async (request) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");
    const userRole = url.searchParams.get("role");
    const searchParams = url.searchParams.get("searchParams");
    const reqLimit = url.searchParams.get("limit");

    // console.log('GET', `${url}, ${userId}, ${userRole}`);
    try {
        await connect();
        const sort = '-_id';
        let limit = (reqLimit > 0) ? reqLimit : 0;
        if (reqLimit === null || reqLimit === undefined) {
            limit = 5;
        }
        const next = searchParams || null;

        // if its me or admin, search result should be all entries that are NOT rtsao or admin
        // if its the normal student name, then give me entries with the student name
   
        const allHmForUser = await PenguinHomework.find({
            _id: next ?  // is there a next?
                sort === '_id' ? { $gt: next } : { $lt: next } // if next, do this
              : { $exists: true }, // else, do this
            userId: userRole === "admin" ? { $ne: userId }  :  userId
          }).limit(limit).sort(sort)

        const next_cursor = allHmForUser[limit - 1]?._id.toString() || null; 
        return new NextResponse(JSON.stringify({allHmForUser, next_cursor}), { status: 200 });
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
        return new NextResponse(JSON.stringify(res), { status: 200 });
    } catch (err) {
        console.log('error', error);
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
            console.log(`data deleted in mongo for: ${deletedDoc.publicId}`);
            const res = await cloudinary.v2.uploader.destroy(publicId);
            if (res.result === 'ok') {
                console.log(`image deleted in cloudinary for: ${deletedDoc.publicId}`)
                return new NextResponse(JSON.stringify({ msg: `Your Homework ${deletedDoc.title || ""} has been deleted`}), { status: 200 });
            }
            else return new NextResponse(JSON.stringify({ msg: `Eror in deleting your Homework ${deletedDoc.title || ""}`}), { status: 500 });
        } else {
            console.log(`Can't delete in mongo: ${deletedDoc.publicId}`);
            return new NextResponse(JSON.stringify({ msg: `Eror in deleting your Homework ${deletedDoc.title || ""}`}), { status: 500 });
        }
            
    } catch (err) {
        console.log('err', err);
        return new NextResponse(`Database Error: ${err}`, { status: 500 });
    }
}