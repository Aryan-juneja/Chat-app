import messageModel from "@/models/messages.model";
import dbConnect from "@/utils/dbConnection";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request){
    const {userId,chatId} =await request.json()
    if(!userId || !chatId)
        return NextResponse.json({ message: "All fields are required" }, { status: 401 });
    try {
        const db = await dbConnect();
        const response =await messageModel.find({chat:chatId}).populate("sender", "name pic email")
        .populate("chat");
        if(!response){
            return NextResponse.json({ message: "No messages found" }, { status: 404 });
        }
        return NextResponse.json({response},{status:201})
    } catch (error) {
        return NextResponse.json({ message: "Error Finding Messages" }, { status: 404 });
    }
}