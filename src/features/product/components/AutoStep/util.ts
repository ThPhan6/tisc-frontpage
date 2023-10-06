import { LinkedOptionProps, OptionReplicateResponse } from '../../types/autoStep';

// set picked data when open auto-step
export const getPickedOptionGroup = (options: OptionReplicateResponse[]) => {
  const b: LinkedOptionProps[] = [];

  if (!options?.length) {
    return b;
  }

  options.forEach((el) => {
    const index = b.findIndex((c) => c.id === el.sub_id);

    if (index > -1) {
      b[index].subs = b[index].subs.concat(el);
    } else {
      b.push({
        id: el.sub_id,
        name: el.sub_name,
        subs: [el],
      });
    }
  });

  return b;
};

export const getIDFromPreOption = (preOption: string | undefined) => {
  let optionId = '';
  let preOptionId = '';

  if (!preOption) {
    return { optionId, preOptionId };
  }

  const curPreOptionIds = preOption?.split(',');

  optionId = curPreOptionIds?.[curPreOptionIds.length - 1];
  preOptionId = curPreOptionIds?.slice(0, curPreOptionIds.length - 1).join(',');

  return { optionId, preOptionId };
};
