import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request) => {
    // the fetch is called from dashboard/auth/register/page.jsx
    // we need to look at the json format of the body, and retrieve name/email/password
  const { name, email, password } = await request.json();
  console.log(name, email);
  await connect();

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser = new User({ name, email, password: hashedPassword });
  try {
    await newUser.save();
    return new NextResponse(JSON.stringify({ msg: `${name} has been registered with id ${email}`, name, id: email}), { status: 201 });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};
