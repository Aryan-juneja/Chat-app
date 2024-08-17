import chatModel from "@/models/chats.model";
import messageModel from "@/models/messages.model";
import userModel from "@/models/user.model";
   // Import the Message model
import dbConnect from "@/utils/dbConnection";

export async function POST(request) {
    try {
        // Log the raw body of the request for debugging
        const rawBody = await request.text();
        console.log('Raw request body:', rawBody);
        
        // Parse the JSON from the raw body
        const { _id } = JSON.parse(rawBody);

        const db = await dbConnect();

        if (!_id) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        console.log(_id);

        // Fetch chats for the user
        let response = await chatModel.find(
            { users: { $elemMatch: { $eq: _id } } }
        )
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 });

        console.log(response);

        // Populate the latest message sender details
        response = await userModel.populate(response, {
            path: 'latestMessage.sender',
            select: 'name pic email',
        });

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in POST request:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
