


import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Tutorial from "@/models/Tutorial";

// wordpress api serves as the backend for our tutorials.
// this is simply to cache the content of each tutorial

export const DELETE = async (request) => {

    try {
      await connect();
      await Tutorial.deleteMany({});
      return new NextResponse("All tutorials have been deleted", { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  };


export const POST = async (request) => {
    const body = await request.json();
    const { content: arrayOfContents } = body;
    if (!arrayOfContents) {
      console.log('no array of contents in body', body);
      return;
    }

    let error;

    const tutorialArr = arrayOfContents.map((element, index) => {
        const {id, title, content, categories, slug } = element;
        return {
            tutorialId: id,
            title: title.rendered,
            slug,
            content: content.rendered,
            categories
        };
    });

    await connect();
    Tutorial.insertMany(tutorialArr).then(function() {
    }).catch(function(error){
        console.log(error)
    });

    return error ? new NextResponse("Database Error", { status: 500 }) : new NextResponse("Tutorials have been cached.", { status: 201 })
};
