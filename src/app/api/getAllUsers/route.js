// src/app/api/getAllUsers/route.js

import userModel from "@/models/user.model";
import dbConnect from "@/utils/dbConnection";

export async function GET(request) {
  await dbConnect();
  try {

    // Access the 'search' and 'id' query parameters from the URL
    const searchParams = new URL(request.url).searchParams;
    const searchQuery = searchParams.get('search') || '';
    const excludeId = searchParams.get('id')?.trim() || ''; // Trim whitespace/newline from the ID
    // Validate that excludeId is a valid ObjectId if necessary
    if (excludeId && !excludeId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid user ID');
    }

    // Execute the query to find matching users
    const users = await userModel.find({
      $and: [
        {
          $or: [
            { email: { $regex: searchQuery, $options: 'i' } },
            { name: { $regex: searchQuery, $options: 'i' } }
          ]
        },
        {
          _id: excludeId ? { $ne: excludeId } : { $exists: true } // Exclude the user with the given ID if present
        }
      ]
    });
    console.log('Users found:', users);

    return new Response(JSON.stringify(users), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
