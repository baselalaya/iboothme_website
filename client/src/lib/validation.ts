export type LeadForm = {
  name: string;
  email: string;
  phone?: string;
};

export function validateRequired(value: string) {
  return value != null && value.trim().length > 0;
}

export function validateEmail(email: string) {
  if (!validateRequired(email)) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhoneOptional(phone?: string) {
  if (!phone) return true;
  const re = /^\+?[0-9()\-\s]{7,}$/;
  return re.test(phone);
}

export function validateLeadBasics(form: LeadForm): { ok: true } | { ok: false; message: string } {
  if (!validateRequired(form.name)) {
    return { ok: false, message: 'Please provide your name.' };
  }
  if (!validateEmail(form.email)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }
  if (!validatePhoneOptional(form.phone)) {
    return { ok: false, message: 'Please enter a valid phone number.' };
  }
  return { ok: true };
}

