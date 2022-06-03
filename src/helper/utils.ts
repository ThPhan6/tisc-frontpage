import { history } from '@/.umi/core/history';
import { PATH } from '@/constants/path';

export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()+=~`{}|/:;'"<>[,.-])[A-Za-z\d@$!%*?&_#^()+=~`{}|/:;'"<>[,.-]{8,}$/;
export const REGEX_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateEmail = (email: string) => {
  return REGEX_EMAIL.test(email);
};

export const validatePassword = (password: string) => {
  return REGEX_PASSWORD.test(password);
};

export const redirectAfterLogin = async () => {
  if (!history) return;
  const { query } = history.location;
  const { redirect } = query as { redirect: string };
  history.push(redirect || PATH.homePage);
};
