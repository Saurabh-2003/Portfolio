import { contactSchema } from "@/utils/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const nodemailer = require('nodemailer');
        const body = await req.json();

        const result = contactSchema.safeParse(body);
        let zodErrors = {};
        if (!result.success) {
            result.error.issues.forEach((issue) => {
                zodErrors = {...zodErrors, [issue.path[0]]:issue.message}
            });
            return NextResponse.json({ errors: zodErrors }, { status: 400 }); // Return 400 for validation errors
        }

        const { name, email, message } = body;
        const transporter = nodemailer.createTransport({
            port: process.env.SMTP_PORT || 465, // Default SMTP port if not provided
            host: process.env.SMTP_HOST,
            auth: {
                user: process.env.SMTP_USER as string,
                pass: process.env.SMTP_PASS as string,
            },
            secure: true,
        });

        const mailData = {
            from: {
                name: 'Portfolio',
                address: process.env.SMTP_USER as string,
            },
            to: process.env.SMTP_USER as string,
            subject: `Contacted through Portfolio by ${name}`,
            html: `
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Message: ${message}</p>
            `,
        };

        await transporter.sendMail(mailData);
        
        return NextResponse.json({ success: true, message: 'Email sent successfully!' }, { status: 200 });

    } catch (error) {
        console.error('Error sending email:', error); // Log the error for debugging
        return NextResponse.json({ success: false, message: 'Failed to send email. Please try again later.' }, { status: 500 });
    }
}
