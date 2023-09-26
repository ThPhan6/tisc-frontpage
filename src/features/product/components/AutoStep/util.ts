import { LinkedOptionProps, OptionReplicateResponse } from '../../types/autoStep';

// set picked data when open auto-step
export const getPickedOptionGroup = (options: OptionReplicateResponse[]) => {
  const b: LinkedOptionProps[] = [];

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
