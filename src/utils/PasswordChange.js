import nodemailer from 'nodemailer'
export async function sendVerificationEmail(email,verifycode){
    console.log(email);
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use other services like 'hotmail', 'yahoo', etc.
            port: 465,
            auth: {
                user: process.env.EMAIL_KEY, // Your email address
                pass: process.env.EMAIL_PASSWORD_KEY // Your email password or app-specific password
            },
        }); 
        const mailOptions = {
            from: 'theprofessorsergio8@gmail.com', // sender address
            to: email, // list of receivers
            subject: ' Verification Code', // Subject line
            html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
                <title>Verification Code</title>
                <style>
                  @font-face {
                    font-family: 'Roboto';
                    font-style: normal;
                    font-weight: 400;
                    mso-font-alt: 'Verdana';
                    src: url('https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2') format('woff2');
                  }
          
                  * {
                    font-family: 'Roboto', Verdana;
                  }
                </style>
              </head>
              <body>
                <div>
                  <h2>Hello, Dear Customer,</h2>
                  <p>Thank you for registering. Please use the following verification code to forgot your password:</p>
                  <p>${verifycode}</p>
                  <p>If you did not request this code, please ignore this email.</p>
                </div>
              </body>
              </html>
            `,
          };
          const mailResponse = await transporter.sendMail(mailOptions);
          console.log(mailResponse)
          return new Response(JSON.stringify({ message: "Email send successfully" }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });;
    } catch (error) {
        console.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email.' };
    }
}





