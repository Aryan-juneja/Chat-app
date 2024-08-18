import dbConnect from "@/utils/dbConnection";
import userModel from "@/models/user.model";
import { apiError } from "@/lib/apiError";
import { apiResponse } from "@/lib/apiResponse";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { name, pic, id } = await request.json();

        // Connect to the database
        await dbConnect();

        // Validate required fields
        if (!name?.trim() || !pic?.trim() || !id?.trim()) {
            return NextResponse.json(new apiResponse(400, null, "All fields are required"), { status: 400 });
        }

        // Update user details
        const user = await userModel.findByIdAndUpdate(id, { name, pic }, { new: true });

        if (!user) {
            throw new apiError(400, "Error updating user");
        }

        // Return success response
        return NextResponse.json(new apiResponse(201, {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
        }, "User updated successfully"), { status: 201 });

    } catch (error) {
        // Handle errors
        return NextResponse.json(new apiResponse(error.status || 500, null, error.message || "Error updating user"), { status: error.status || 500 });
    }
}
