import nodemailer from "nodemailer";

export class EmailService {
  public static async sendEmailAsync (receiverMail: string|undefined, subject: string, content: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: receiverMail ?? process.env.MAIL_USERNAME,
      subject: subject,
      text: content,
    });
  }
}