import { NextResponse } from "next/server";

export async function POST (req:Request) {
    try {
        let nodemailer = require('nodemailer');
        const {name , email, message} = await req.json();
        const transporter = nodemailer.createTransport({
            port: process.env.SMTP_PORT,
            host: process.env.SMTP_HOST,
            auth: {
                user: process.env.SMTP_USER as string,
                pass: process.env.SMTP_PASS as string,
            },
            secure: true,
        });

        const mailData = {
            from: {
                name:'Portfolio',
                address: process.env.SMTP_USER as string,
            },
            to: process.env.SMTP_USER as string,
            subject: `Contacted through Portfolio by ${name}`,
            html: `
                <p>Name :  ${name} </p>
                <p>Email : ${email} </p>
                <p>Message : ${message}</p>
            `,
        };

        await transporter.sendMail(mailData, function (err:string, info :string) {
            if (err) {
                return NextResponse.json(
                    { success: false, message: 'Failed to send email. Please try again later.' },
                    {status : 400},
                    );
            } else {
                return NextResponse.json(
                    { success: true, message: 'Email sent successfully!' },
                    {status:200},
                    );
            }
        });

    }catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: 'Failed to send email. Please try again later.' },
            {status:500}
            );
    }
}