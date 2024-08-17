import dbConnect from "@/utils/dbConnection";
import userModel from "@/models/user.model";
import bcrypt from 'bcryptjs';
import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { NextResponse } from 'next/server';
import generateToken from "@/lib/generateToken";

export async function POST(request) {
    try {
        const { name, email, password, pic } = await request.json();
        console.log(name, email, password, pic);

        // Connect to the database
        await dbConnect();

        // Check if all fields are provided
        if ([name, email, password].some((field) => !field?.trim())) {
            return NextResponse.json(new apiResponse(400, null, "All fields are required"), { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            pic: pic || ""
        });

        if (!user) {
            throw new apiError(400, "Error creating user");
        }

        // Generate a token
        const token =await  generateToken(user._id);
        console.log(token)
        // Create a response with a cookie
        const response = NextResponse.json(new apiResponse(201, {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token, // Include token in response body
        }, "User created successfully"), { status: 201 });

        // Set the token in a cookie
        response.cookies.set('token', token, {
            httpOnly: true, // Ensures the cookie is only accessible via HTTP (not JavaScript)
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 60 * 60 * 24 * 7, // Cookie expires in 7 days
            path: '/' // Cookie is available site-wide
        });

        return response;

    } catch (error) {
        // Handle errors
        return NextResponse.json(new apiResponse(error.status || 500, null, error.message || "Error creating user"), { status: error.status || 500 });
    }
}
