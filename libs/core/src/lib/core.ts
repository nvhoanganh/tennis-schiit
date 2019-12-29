export function strongPassword(value) {
  const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return value && pattern.test(value);
}

export function isValidEmail(value) {
  if (!value) return true;
  const pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return value && pattern.test(value);
}

export function isValidNumber(value) {
  if (!value) return false;
  const pattern = /^\d+$/;
  return value && pattern.test(value);
}
