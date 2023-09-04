import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Post from "@/models/Post";


export const GET = async (request) => {
    const url = new URL(request.url);
    // console.log('\n√ YOU ARE TRYING TO MAKE A (GET) REQUEST AT: ', request.url);
    const username = url.searchParams.get("username");
    try {
        await connect();
        const posts = await Post.find(username && { username });
        return new NextResponse(JSON.stringify(posts), { status: 200 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};

export const POST = async (request) => {
    // console.log('\n√ YOU ARE TRYING TO MAKE A (POST) REQUEST AT: ', request.url);
  
    const body = await request.json();
    const newPost = new Post(body);
    try {
        await connect();
        await newPost.save();
        return new NextResponse("Post has been created", { status: 201 });
    } catch (err) {
        return new NextResponse("Database Error", { status: 500 });
    }
};
