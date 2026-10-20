export default function getPhoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return "tel:" + (digits.startsWith("0") ? "+38" + digits : digits);
}
