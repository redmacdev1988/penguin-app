

// todo

import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Tutorial from "@/models/Tutorial";

// wordpress api serves as the backend for our tutorials.
// this is simply to cache the content of each tutorial

export const POST = async (request) => {
    console.log('\n√ BBbBBBBBBBBBB: ', request.url);
    const body = await request.json();
    const { content: arrayOfContents } = body;
    console.log(' ------ array of tutorials ------- ', arrayOfContents.length);

    let error;

    arrayOfContents.map( async (element, index) => {

        const {id, title, content, categories, slug } = element;
        // console.log('----------------------------------------------');
        // console.log('id is: ', id);
        // console.log('title: ', title.rendered);
        // console.log('content: ', content.rendered);
        // console.log('categories: ', categories);
        // console.log('===================================================');

        const newTutorial = new Tutorial({
            tutorialId: id,
            title: title.rendered,
            slug,
            content: content.rendered,
            categories
        });

        try {
            await connect();
            const bUserExist = await Tutorial.exists({ tutorialId: id });
            if (!bUserExist) {
                await newTutorial.save();
                console.log(`tutorial with id ${id} successfully saved!`);
            } else {
                // update it.
                console.log(`sorry, tutorial ${id} already exists. So lets update it the content only.`);
                await Tutorial.findOneAndUpdate({tutorialId: id}, {content: content.rendered});
            }
        } catch (err) {
            console.log('error', err);
            error = err;
        }
    })

    return error ? new NextResponse("Database Error", { status: 500 }) : new NextResponse("Tutorials have been cached.", { status: 201 })
};
