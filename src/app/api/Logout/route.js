import { cookies } from 'next/headers'

export async function GET(request) {
    try {
        console.log("entered")
        const res = cookies().delete('token');
        console.log(res)
        return new Response('Cookie deleted', {
            status: 200,
            headers: {
                'Set-Cookie': 'token=deleted; Max-Age=0'
            }
        })
    } catch (error) {
        return new Response('Error deleting cookie', {
            status: 500
        })
    }
}
