export function strongPassword(value) {
  // const pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const pattern = /^.{8,}$/;
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

export const appConfig = {
  pwaInstalled: "tennis-scoresheet-pwa-installed",
  pwaInstallPromptTimesKey: "tennis-scoresheet-ios-ask-pwa",
  pwaInstallPromptTimes: 3,
  pwaNotificationSubDeniedKey: "tennis-scoresheet-ask-notify-denied",
  pwaNotificationSubKeyOnThisDevice: "tennis-scoresheet-notification-subscribed"
};
