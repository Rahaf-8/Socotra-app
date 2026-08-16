const internationalNumber = /^\+[1-9]\d{7,14}$/;

export function normalizeWhatsappNumber(value: string | null | undefined) {
  if (!value) return null;
  const normalized = value.trim().replace(/[\s()-]/g, "");
  return internationalNumber.test(normalized) ? normalized.slice(1) : null;
}

export function buildWhatsappUrl(value: string | null | undefined, message: string) {
  const number = normalizeWhatsappNumber(value);
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null;
}

export function buildMailtoUrl(email: string, subject: string) {
  const normalized = email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    ? `mailto:${encodeURIComponent(normalized)}?subject=${encodeURIComponent(subject)}`
    : null;
}
