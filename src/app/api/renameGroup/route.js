import chatModel from "@/models/chats.model";
import dbConnect from "@/utils/dbConnection";

export async function POST(request){
    const {name,grpId} = await request.json();
    if (!name || !grpId) {
        return new Response(JSON.stringify({ message: "Please fill all the fields" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const db = await dbConnect();
        const response =await chatModel.findByIdAndUpdate({_id:grpId},{chatName:name},{new:true}).populate("users", "-password")
        .populate("groupAdmin", "-password");
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