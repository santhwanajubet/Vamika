export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^[6-9]\d{9}$/;
export const PINCODE_RE = /^\d{6}$/;

export function validateCheckout(address) {
  const errors = {};
  if (!address.fullName.trim()) errors.fullName = 'Name is required';
  else if (address.fullName.trim().length < 2) errors.fullName = 'Name is too short';

  if (!address.phone.trim()) errors.phone = 'Phone is required';
  else if (!PHONE_RE.test(address.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number';

  if (!address.line1.trim()) errors.line1 = 'Address is required';
  else if (address.line1.trim().length < 5) errors.line1 = 'Enter a complete address';

  if (!address.city.trim()) errors.city = 'City is required';
  if (!address.state.trim()) errors.state = 'State is required';

  if (!address.zipCode.trim()) errors.zipCode = 'PIN code is required';
  else if (!PINCODE_RE.test(address.zipCode.trim())) errors.zipCode = 'Enter a valid 6-digit PIN code';

  if (!address.country.trim()) errors.country = 'Country is required';
  return errors;
}

export function validateRegister(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  else if (form.name.trim().length < 2) errors.name = 'Name is too short';

  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email';

  if (!form.password) errors.password = 'Password is required';
  else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
}

export function validateLogin(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'Enter a valid email';

  if (!form.password) errors.password = 'Password is required';
  return errors;
}

export function validateAccount(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  else if (form.name.trim().length < 2) errors.name = 'Name is too short';

  if (form.phone && !PHONE_RE.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number';
  return errors;
}

export function validateCoupon(form) {
  const errors = {};
  if (!form.code.trim()) errors.code = 'Code is required';
  if (!form.value || Number(form.value) <= 0) errors.value = 'Enter a valid value';
  if (form.validFrom && form.validUntil && new Date(form.validFrom) > new Date(form.validUntil)) {
    errors.validUntil = 'End date must be after start date';
  }
  return errors;
}

export function validateAddress(form) {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = 'Name is required';
  else if (form.fullName.trim().length < 2) errors.fullName = 'Name is too short';

  if (!form.phone.trim()) errors.phone = 'Phone is required';
  else if (!PHONE_RE.test(form.phone.trim())) errors.phone = 'Enter a valid 10-digit phone number';

  if (!form.line1.trim()) errors.line1 = 'Address is required';
  else if (form.line1.trim().length < 5) errors.line1 = 'Enter a complete address';

  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.state.trim()) errors.state = 'State is required';

  if (!form.zipCode.trim()) errors.zipCode = 'PIN code is required';
  else if (!PINCODE_RE.test(form.zipCode.trim())) errors.zipCode = 'Enter a valid 6-digit PIN code';

  return errors;
}

export function validateProduct(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.price || Number(form.price) <= 0) errors.price = 'Price must be greater than 0';
  if (form.offerPrice && Number(form.offerPrice) >= Number(form.price)) {
    errors.offerPrice = 'Offer price must be less than regular price';
  }
  if (!form.category) errors.category = 'Select a category';
  form.variants.forEach((v, i) => {
    if (!v.sku.trim()) errors[`variant_${i}_sku`] = 'SKU is required';
    if (Number(v.stock) < 0) errors[`variant_${i}_stock`] = 'Stock cannot be negative';
  });
  return errors;
}
