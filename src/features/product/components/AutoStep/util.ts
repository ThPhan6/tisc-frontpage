import { sortObjectArray } from '@/helper/utils';
import { trimEnd } from 'lodash';

import { LinkedOptionProps, OptionReplicateResponse } from '../../types/autoStep';
import { OptionQuantityProps } from './../../types/autoStep';

// set picked data when open auto-step
export const mappingOptionGroups = (options: OptionReplicateResponse[] | OptionQuantityProps[]) => {
  const b: any[] = [];

  if (!options?.length) {
    return b;
  }

  options.forEach((el) => {
    const index = b.findIndex((c) => c.id === el.sub_id);

    if (index > -1) {
      b[index].subs = b[index].subs.concat(el);
    } else {
      b.unshift({
        id: el.sub_id,
        name: el.sub_name,
        subs: [el],
        picked: el.picked,
      });
    }
  });

  return sortObjectArray(
    b.map((el) => ({ ...el, subs: sortObjectArray(el.subs, 'value_1') })),
    'name',
  ) as LinkedOptionProps[];
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

export const getPreOptionName = (
  prevPreOptionName: string,
  curPreOptionName: { value_1: string; value_2?: string; unit_1?: string; unit_2?: string },
) => {
  const preOptionInfo = [
    prevPreOptionName,
    trimEnd(
      `${curPreOptionName.value_1} ${curPreOptionName.value_2} ${
        curPreOptionName.unit_1 || curPreOptionName.unit_2
          ? `- ${curPreOptionName.unit_1} ${curPreOptionName.unit_2}`
          : ''
      }`,
    ),
  ].filter(Boolean);

  const preOptionName = preOptionInfo.length ? preOptionInfo.join(', ') : '';

  return preOptionName;
};
