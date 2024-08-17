import chatModel from "@/models/chats.model";
import messageModel from "@/models/messages.model";
import userModel from "@/models/user.model";
import dbConnect from "@/utils/dbConnection";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { senderId, content, chatId } = await request.json();

    // Validate the required fields
    if (!senderId || !content || !chatId) {
        return NextResponse.json({ message: "All fields are required" }, { status: 401 });
    }

    try {
        await dbConnect(); // Ensure the database connection

        const message = {
            sender: senderId,
            content: content,
            chat: chatId,
            readBy: []
        };

        let response = await messageModel.create(message)

        if (!response) {
            return NextResponse.json({ message: "Error creating message" }, { status: 401 });
        }
        console.log(response._doc)
        // Populate the response only if it's defined
        let res =await messageModel.findById(response._doc._id).populate("sender", "name email pic").populate("chat")
        console.log(res)
        // Ensure that the chat is populated before populating users
        if (res.chat) {
            res = await userModel.populate(res, {
                path: "chat.users",
                select: "name email pic"
            });
        } else {
            return NextResponse.json({ message: "Chat not found during population" }, { status: 404 });
        }

        // Update the latest message in the chat
        await chatModel.findByIdAndUpdate(chatId, { latestMessage: res });
        
        return NextResponse.json(res, { status: 201 });
    } catch (error) {
        console.error("Error in message creation:", error); // Log the error for debugging
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
