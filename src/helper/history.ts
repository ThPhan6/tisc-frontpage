import { history } from 'umi';

export const pushTo = (path: string) => {
  history.push(path);
};
