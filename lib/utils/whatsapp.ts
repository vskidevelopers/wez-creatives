/**
 * Generates a WhatsApp deep link with an optionally encoded message.
 *
 * @param phone - The phone number in international format (e.g., "254712345678")
 * @param message - Optional prefilled message
 * @returns A valid wa.me URL
 */
export function getWhatsAppLink(phone: string, message?: string): string {
  // Remove any non-numeric characters to ensure clean international format
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const baseUrl = `https://wa.me/${cleanPhone}`;

  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }

  return baseUrl;
}
