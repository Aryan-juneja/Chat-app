import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: { type: "String", required: true },
        email: { type: "String", unique: true, required: true },
        password: { type: "String", required: true },
        pic: {
          type: "String",
          default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        isAdmin: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
      { timestaps: true },{
    timestamps: true
})
const userModel =mongoose.models.User || mongoose.model("User",userSchema);
export default userModel