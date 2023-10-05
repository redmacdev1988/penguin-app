

// todo

import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Tutorial from "@/models/Tutorial";

// for specific tutorials, we do GET only.


export const GET = async (request, { params }) => {
    debugger
    const { slug } = params;
    console.log('GET one tutorial, slug: ', slug);
    await connect();
    const tutorial = await Tutorial.findOne({slug});
    if (tutorial) {
        return new NextResponse(JSON.stringify(tutorial), { status: 200 });
    } else {
        console.log(' DID NOT FIND ');
        return new NextResponse("Database Error", { status: 500 });
    }
  };
