import userModel from "@/models/user.model";
import dbConnect from "@/utils/dbConnection";
import bcrypt from 'bcryptjs'
export async function POST(req) {
  try {
    await dbConnect();
    const { email,password } = await req.json();
    console.log(email,password);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return new Response(JSON.stringify({ message: "Email is not registered yet" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log(user._id)
    const updatedResponse =await userModel.findByIdAndUpdate(user._id,{
        $set: { password: hashedPassword }
    },{new:true})
    console.log(updatedResponse)
    if (!updatedResponse) {
      return new Response(JSON.stringify({ message: "Error reseting password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    console.log("here")
    return new Response(JSON.stringify({ message: "password reset successfully" }), {
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
