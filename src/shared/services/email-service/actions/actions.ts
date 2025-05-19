"use server"


import {createServerAction} from "@/shared/utilities/create-server-action";
import {EmailService} from "@/shared/services/email-service/email-service";

export const sendEmailAction = createServerAction<void>(async (receiverMail: string, subject: string, content: string) => {
  await EmailService.sendEmailAsync(receiverMail, subject, content);
});
