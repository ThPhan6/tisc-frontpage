import { isNull, isUndefined, sortBy } from 'lodash';

import { BasisOptionForm } from '@/types';

import { DragEndResultProps } from '@/components/Drag';

export const getNewDataAfterDragging = (props: {
  data: BasisOptionForm[];
  result: DragEndResultProps;
}) => {
  const { data, result } = props;

  const { draggableId, source, destination } = result;

  if (
    isNull(source) ||
    isUndefined(source?.droppableId) ||
    isNull(destination) ||
    isUndefined(destination?.droppableId) ||
    source.droppableId === destination.droppableId
  ) {
    return;
  }

  const sourceDataIndex = data.findIndex((el) => el.id === source.droppableId);
  const destinationDataIndex = data.findIndex((el) => el.id === destination.droppableId);

  if (
    isNull(sourceDataIndex) ||
    isUndefined(sourceDataIndex) ||
    isNull(destinationDataIndex) ||
    isUndefined(destinationDataIndex)
  ) {
    return;
  }

  const current = data[sourceDataIndex];
  const next = data[destinationDataIndex];
  const target = current?.subs?.[source.index];

  if (!current || !next || !target) {
    return;
  }

  // remove from original
  const sourceData = current.subs.filter((sub) => sub.id !== draggableId);

  // insert into next
  const destinationData = next.subs.concat(target);

  const newData: BasisOptionForm[] = data.map((el) => {
    if (el.id === source.droppableId) {
      return { ...el, subs: sourceData };
    }

    if (el.id === destination.droppableId) {
      return { ...el, subs: destinationData };
    }

    return el;
  });

  const finalData: BasisOptionForm[] = newData.map((el) => ({
    ...el,
    subs: sortBy(el.subs, 'name'),
  }));

  return finalData;
};
