import { isNull, isUndefined } from 'lodash';

import { DragEndResultProps } from '@/components/Drag';

export const getNewDataAfterDragging = (props: { data: any[]; result: DragEndResultProps }) => {
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

  const current = data[sourceDataIndex];
  const next = data[destinationDataIndex];
  const target = current.subs[source.index];

  // remove from original
  const sourceData = current.subs.filter((sub: any) => sub.id !== draggableId);

  // insert into next
  const destinationData = next.subs.concat(target);

  const finalData = data.map((el) => {
    if (el.id === source.droppableId) {
      return { ...el, subs: sourceData };
    }

    if (el.id === destination.droppableId) {
      return { ...el, subs: destinationData };
    }

    return el;
  });

  return finalData;
};
