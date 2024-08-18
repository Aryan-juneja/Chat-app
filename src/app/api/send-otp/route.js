import userModel from "@/models/user.model";
import dbConnect from "@/utils/dbConnection";
import { sendVerificationEmail } from "@/utils/PasswordChange";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();
    console.log(email);
    const user = await userModel.findOne({ email });
    console.log(user);

    if (!user) {
      return new Response(JSON.stringify({ message: "Email is not registered yet" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(verifyCode);
    const emailResponse = await sendVerificationEmail(email, verifyCode);
    console.log(emailResponse);

    if (emailResponse.status !== 201) {
      return new Response(JSON.stringify({ message: "Error sending OTP" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Set the cookie manually using the Set-Cookie header
    const headers = new Headers({
      "Content-Type": "application/json",
      "Set-Cookie": `verify-code=${verifyCode}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7};
       ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    });

    return new Response(JSON.stringify({ message: "Verification code sent successfully" }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error in POST /api/send-otp:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
