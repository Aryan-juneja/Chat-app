import chatModel from "@/models/chats.model";
import dbConnect from "@/utils/dbConnection";

export async function POST(request) {
    try {
        const { users, name, userId } = await request.json();

        // Check for required fields
        if (!users || !name) {
            return new Response(JSON.stringify({ message: "Please fill all the fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Create a new array to avoid mutating the original users array
        const Users = [...users, userId];

        // Ensure there are at least three users including the group admin
        if (Users.length < 3) {
            return new Response(JSON.stringify({ message: "At least two users are needed" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        await dbConnect();

        // Create the group chat
        const newChat = await chatModel.create({
            chatName: name,
            isGroupChat: true,
            users: Users,
            groupAdmin: userId,
        });

        // Populate necessary fields
        const fullChat = await chatModel.findById(newChat._id)
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        return new Response(JSON.stringify(fullChat), {
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
