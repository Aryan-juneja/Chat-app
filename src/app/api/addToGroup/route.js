import chatModel from "@/models/chats.model";
import dbConnect from "@/utils/dbConnection";

export async function POST(request){
    const {chatId,userId,loggedInUser}=await request.json();
    if (!chatId || !userId || !loggedInUser) {
        return new Response(JSON.stringify({ message: "Please fill all the fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const db = await dbConnect();
        const checkAdmin =await chatModel.findOne({_id:chatId})
        if(checkAdmin.groupAdmin !=loggedInUser){
            return new Response(JSON.stringify({ message: "You are not the admin of this chat" }),)
        }
        const response =await chatModel.findByIdAndUpdate({_id:chatId},{
            $push:{users:userId}
        },{new:true}).populate("users", "-password")
        .populate("groupAdmin", "-password");
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