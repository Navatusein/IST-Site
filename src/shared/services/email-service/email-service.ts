import nodemailer, {Transporter} from "nodemailer";

export interface IMail {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  const port = Number(process.env.MAIL_PORT);

  transporter ??= nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port,
    secure: port == 465,
    pool: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  return transporter;
}

export class EmailService {
  public static async send(mail: IMail): Promise<void> {
    await getTransporter().sendMail({
      from: {name: process.env.MAIL_FROM_NAME || "Сайт кафедри ІСТ", address: process.env.MAIL_USERNAME},
      ...mail,
    });
  }

  public static getContactRecipients(): string[] {
    const recipients = (process.env.CONTACT_EMAIL_TO ?? "").split(",").map((x) => x.trim()).filter(Boolean);
    return recipients.length != 0 ? recipients : [process.env.MAIL_USERNAME];
  }
}
