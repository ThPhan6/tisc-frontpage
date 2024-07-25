export const DEFAULT_MAIN_OPTION_ID = '33a0bbe3-38fd-4cd1-995f-31a801f4018b';
export const DEFAULT_SUB_PRESET_ID = '34292db4-79e8-44d5-84b8-2efe9f44be1f';

export const DEFAULT_IDS = [DEFAULT_MAIN_OPTION_ID, DEFAULT_SUB_PRESET_ID];

export const getDefaultIDOfBasic = (id: string) => {
  return DEFAULT_IDS.find((el) => el === id);
};
