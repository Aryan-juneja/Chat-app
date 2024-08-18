import userModel from "@/models/user.model";
import dbConnect from "@/utils/dbConnection";
import { parse } from 'cookie';

export async function POST(req) {
  try {
    await dbConnect();
    const { otp } = await req.json();
    
    // Parse the cookies from the request headers
    const cookies = parse(req.headers.get('cookie') || '');
    const verifyCode = cookies['verify-code'];

    console.log('Stored Verification Code:', verifyCode);
    console.log('User Provided OTP:', otp);

    // Check if the verification code exists
    if (!verifyCode) {
      return new Response(JSON.stringify({ message: "Error accessing code" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify if the OTP matches the stored verification code
    if (otp !== verifyCode) {
      return new Response(JSON.stringify({ message: "OTP is incorrect" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Set headers to delete the cookie after successful verification
    const headers = new Headers({
      "Content-Type": "application/json",
      "Set-Cookie": `verify-code=deleted; HttpOnly; Path=/; Max-Age=0;`,
    });

    return new Response(JSON.stringify({ message: "OTP verified successfully" }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error in POST /api/verify-otp:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
