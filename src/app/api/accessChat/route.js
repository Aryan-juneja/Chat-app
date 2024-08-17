import chatModel from "@/models/chats.model";
import dbConnect from "@/utils/dbConnection";

export async function POST(request) {
    try {
        const { userid, senderid } = await request.json();
        console.log(userid, senderid)
        const db = await dbConnect();

        // Check if the chat already exists
        const existingChat = await chatModel.findOne({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: senderid } } },
                { users: { $elemMatch: { $eq: userid } } },
            ],
        }).populate('users',"-password").populate('latestMessage');

        if (existingChat) {
            return new Response(JSON.stringify(existingChat), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }

        // Create a new chat if none exists
        const newChat = await chatModel.create({
            isGroupChat: false,
            users: [userid, senderid],
            chatName: "sender",
        });

        const newChatDetails = await chatModel.findOne({ _id: newChat._id }).populate(
            "users",
            "-password"
          );

        return new Response(JSON.stringify(newChatDetails), {
            headers: { "Content-Type": "application/json" },
            status: 201,
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
