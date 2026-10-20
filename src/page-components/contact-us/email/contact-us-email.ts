import escapeHtml from "@/shared/utilities/escape-html";
import {IContactUsMessage} from "../types/type";

interface IContactUsEmail {
  subject: string;
  text: string;
  html: string;
}

const formatDate = (date: Date) => date.toLocaleString("uk-UA", {timeZone: "Europe/Kyiv"});

export function buildContactUsEmail(message: Required<Omit<IContactUsMessage, "website">>, sentAt: Date): IContactUsEmail {
  const subject = message.subject ?
    `Повідомлення з сайту: ${message.subject}` :
    `Повідомлення з сайту від ${message.name}`;

  const text = [
    "Нове повідомлення з форми зворотного зв'язку на сайті кафедри.",
    "",
    `Ім'я: ${message.name}`,
    `Пошта: ${message.email}`,
    `Тема: ${message.subject || "—"}`,
    `Надіслано: ${formatDate(sentAt)}`,
    "",
    message.message,
    "",
    "Щоб відповісти, натисніть «Відповісти»: лист піде автору повідомлення.",
  ].join("\n");

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:4px 0;color:#111827">${value}</td>
    </tr>`;

  const html = `<!doctype html>
<html lang="uk">
  <body style="margin:0;padding:24px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:8px">
      <tr>
        <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb">
          <div style="font-size:18px;font-weight:bold;color:#1d4f6e">Нове повідомлення з сайту</div>
          <div style="color:#6b7280">Форма зворотного зв'язку кафедри інформаційних систем та технологій</div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px">
          <table role="presentation" cellpadding="0" cellspacing="0">
            ${row("Ім'я", escapeHtml(message.name))}
            ${row("Пошта", `<a href="mailto:${escapeHtml(message.email)}" style="color:#1677ff">${escapeHtml(message.email)}</a>`)}
            ${row("Тема", escapeHtml(message.subject || "—"))}
            ${row("Надіслано", escapeHtml(formatDate(sentAt)))}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 16px">
          <div style="padding:16px;background:#f9fafb;border-radius:6px;color:#111827;white-space:pre-wrap">${escapeHtml(message.message)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 24px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px">
          Щоб відповісти, натисніть «Відповісти»: лист піде автору повідомлення.
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {subject, text, html};
}
