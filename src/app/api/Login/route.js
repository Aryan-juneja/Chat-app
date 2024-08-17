import dbConnect from "@/utils/dbConnection";
import userModel from "@/models/user.model";
import bcrypt from 'bcryptjs';
import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { NextResponse } from 'next/server';
import generateToken from "@/lib/generateToken";
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const { email, password } = await request.json();
        console.log(email, password);

        // Connect to the database
        await dbConnect();

        // Check if all fields are provided
        if ([email, password].some((field) => !field?.trim())) {
            return NextResponse.json(new apiResponse(400, null, "All fields are required"), { status: 400 });
        }

        // Find the user
        const user = await userModel.findOne({ email }); // Use findOne for a single user
        console.log(user);

        if (!user) {
            throw new apiError(400, "Invalid Credentials");
        }

        // Compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(isPasswordMatch);
        if (!isPasswordMatch) {
            throw new apiError(400, "Invalid Credentials");
        }

        // Check for existing token
        const cookies = request.cookies;
        let token = cookies.get('token');
        console.log(token);

        if (!token) { // Check if token is absent or invalid/expired
            console.log("Generating new token");
            token = await generateToken(user._id);

            try {
                jwt.verify(token, process.env.JWT_SECRET); // Validate the new token
                console.log("Token is valid");
            } catch (err) {
                return NextResponse.json(new apiResponse(500, null, "Error generating token"), { status: 500 });
            }
        } else {
            try {
                jwt.verify(token.value, process.env.JWT_SECRET); // Validate the existing token
            } catch (err) {
                console.log("Invalid token, generating new one");
                token = await generateToken(user._id);
                try {
                    jwt.verify(token, process.env.JWT_SECRET); // Validate the new token
                } catch (err) {
                    return NextResponse.json(new apiResponse(500, null, "Error generating token"), { status: 500 });
                }
            }
        }

        // Create a response with a cookie
        console.log(token)
        console.log("Decoded token:", jwt.decode(token));
        const response = NextResponse.json(new apiResponse(201, {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token, // Include token in response body
        }, "User Logged In Successfully"), { status: 201 });

        // Set the cookie
        response.cookies.set('token', token, {
            httpOnly: true, // Ensures the cookie is only accessible via HTTP (not JavaScript)
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 60 * 60 * 24 * 7, // Cookie expires in 7 days
            path: '/' // Cookie is available site-wide
        });

        return response;
    } catch (error) {
        // Handle errors
        return NextResponse.json(new apiResponse(error.status || 500, null, error.message || "Error logging in user"), { status: error.status || 500 });
    }
}
