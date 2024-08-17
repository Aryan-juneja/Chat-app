import mongoose,{Schema} from 'mongoose'

const messagesSchema =new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
},{timestamps:true})


const messageModel =mongoose.models.Message || mongoose.model("Message",messagesSchema);
export default messageModel