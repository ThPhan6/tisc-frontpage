import { forEach, isEmpty, startCase } from 'lodash';

import { FinishScheduleResponse } from './types';

export const useGetFinishScheduleSelected = (finish_schedules: FinishScheduleResponse[]) => {
  const finishSchedulesData = finish_schedules?.map((el) => ({
    roomId: el.room_id_text,
    floor: el.floor,
    base: el.base.ceiling || el.base.floor,
    front_wall: el.front_wall,
    left_wall: el.left_wall,
    back_wall: el.back_wall,
    right_wall: el.right_wall,
    ceiling: el.ceiling,
    door: el.door.frame || el.door.panel,
    cabinet: el.cabinet.carcass || el.cabinet.door,
  }));

  /// get room's info chosen
  let finishScheduleTexts: string[] = [];
  const finishScheduleLabel: string[] = [];

  finishSchedulesData.forEach((el) => {
    finishScheduleTexts = [];
    let finishSchedulesChosen = '';
    forEach(el, (value, key) => {
      if (value === true) {
        finishScheduleTexts.push(startCase(key));
      }
    });

    if (!isEmpty(finishScheduleTexts)) {
      finishSchedulesChosen += `${el.roomId}: ${finishScheduleTexts.join(', ')};`;
      finishScheduleLabel.push(finishSchedulesChosen);
    }
  });

  return finishScheduleLabel;
};
