"use server"

import {createServerAction} from "@/shared/utilities/create-server-action";
import {ServerActionError} from "@/shared/exceptions/server-action-error";
import {RateLimiter} from "@/shared/utilities/rate-limiter";
import {getClientIp} from "@/shared/utilities/get-client-ip";
import {EmailService} from "@/shared/services/email-service/email-service";
import {buildContactUsEmail} from "../email/contact-us-email";
import {CONTACT_US_LIMITS, IContactUsMessage} from "../types/type";

const contactUsRateLimiter = new RateLimiter(5, 60 * 60 * 1000);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const field = (value: unknown) => typeof value == "string" ? value.trim() : "";

export const sendContactUsMessageAction = createServerAction<void>(async (data: IContactUsMessage) => {
  if (field(data?.website))
    return;

  const message = {
    name: field(data?.name),
    email: field(data?.email),
    subject: field(data?.subject),
    message: field(data?.message),
  };

  if (!message.name || message.name.length > CONTACT_US_LIMITS.name)
    throw new ServerActionError("Вкажіть ім'я");

  if (!EMAIL_PATTERN.test(message.email) || message.email.length > CONTACT_US_LIMITS.email)
    throw new ServerActionError("Вкажіть коректну пошту");

  if (message.subject.length > CONTACT_US_LIMITS.subject)
    throw new ServerActionError("Тема задовга");

  if (message.message.length < CONTACT_US_LIMITS.messageMin || message.message.length > CONTACT_US_LIMITS.message)
    throw new ServerActionError(`Повідомлення має містити від ${CONTACT_US_LIMITS.messageMin} до ${CONTACT_US_LIMITS.message} символів`);

  const ip = await getClientIp();

  if (contactUsRateLimiter.isLimited(ip))
    throw new ServerActionError("Забагато повідомлень, спробуйте пізніше");

  contactUsRateLimiter.registerFailure(ip);

  const email = buildContactUsEmail(message, new Date());

  await EmailService.send({
    to: EmailService.getContactRecipients(),
    replyTo: message.email,
    ...email
  });
});
