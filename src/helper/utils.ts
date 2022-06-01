export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()+=~`{}|/:;'"<>[,.-])[A-Za-z\d@$!%*?&_#^()+=~`{}|/:;'"<>[,.-]{8,}$/;
export const REGEX_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const validateEmail = (email: string) => {
  return REGEX_EMAIL.test(email);
};
