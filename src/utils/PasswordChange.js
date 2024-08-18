import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, verifycode) {
    console.log("Sending email to:", email);
    
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_KEY,
                pass: process.env.EMAIL_PASSWORD_KEY,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_KEY, // Sender address
            to: email, // Receiver address
            subject: 'Verification Code', // Subject line
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
                  <p>Thank you for registering. Please use the following verification code to reset your password:</p>
                  <p>${verifycode}</p>
                  <p>If you did not request this code, please ignore this email.</p>
                </div>
              </body>
              </html>
            `,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", mailResponse);
        return { success: true, message: 'Email sent successfully.' };
        
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, message: 'Failed to send verification email.' };
    }
}
