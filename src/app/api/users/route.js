
import connect from "@/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

// get all users
export const GET = async (request) => {
    try {
        await connect();
        const allUsers = await User.find({}, 'name role email');
        return new NextResponse(JSON.stringify({allUsers}), { status: 200 });
    } catch (err) {
        console.log('GET - err', err);
        return new NextResponse("Database Error", { status: 500 });
    }
};