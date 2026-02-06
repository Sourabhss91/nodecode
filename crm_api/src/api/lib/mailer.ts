import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { env } from '../../infrastructure/env'

  /**
     * nodemailer sent mail
     * @param {string}
  */
export async function MailSent  (data:any) {
    try {
    const hostname = env.EMAIL_HOST
    const username = env.EMAIL_USERNAME;
    const password = env.EMAIL_PASSWORD;
  
    const transporter = nodemailer.createTransport({
        service: hostname,
        auth: {
            user: username,
            pass: password
        }
    });

    const info = await transporter.sendMail({
        from: '"kommuno.com" <info@kommuno.com>',
        to: data['to'],
        subject: data['subject'],
        html: data['message'],
        headers: { 'x-myheader': 'header' }
    });
    
    console.log("Message sent: %s", info.response);

} catch (error) {
    console.log(error)
    return error;
}
}