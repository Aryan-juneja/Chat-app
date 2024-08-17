import chatModel from "@/models/chats.model";
import dbConnect from "@/utils/dbConnection";

export async function POST(request) {
    try {
        const { userId, chatId } = await request.json();

        // Check for required fields
        if (!userId || !chatId) {
            return new Response(JSON.stringify({ message: "Please fill all the fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        await dbConnect();

        // Remove the user from the chat
        const response = await chatModel.findByIdAndUpdate(
            chatId,
            { $pull: { users: userId } },
            { new: true }
        )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

        // Handle case where the chat is not found
        if (!response) {
            return new Response(JSON.stringify({ message: "Chat not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
