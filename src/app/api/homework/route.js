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
    const name = url.searchParams.get("name");
    try {
        await connect();

        const filter = (name === 'rtsao' || name === 'admin') ? { name: {$ne: name} } : { name };
        
        const allHmForUser = await PenguinHomework.find(filter).sort('-createdAt');
        
        console.log('allHmForUser', allHmForUser);

        return new NextResponse(JSON.stringify(allHmForUser), { status: 200 });
    } catch (err) {
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