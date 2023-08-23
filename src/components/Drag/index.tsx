import { FC } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export interface DragEndResultProps {
  combine: any;
  destination: { index: number; droppableId: string } | null;
  draggableId: string;
  mode: 'FLUID';
  reason: 'DROP';
  source: { index: number; droppableId: string } | null;
  type: 'DEFAULT';
}

const reorder = (data: any, startIndex: number, endIndex: number) => {
  const result = Array.from(data);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const getNewDataAfterReordering = (result: any, data: any) => {
  if (!result?.destination || result?.destination?.index === result?.source?.index) {
    return data;
  }

  const newData = reorder(data, result.source.index, result.destination.index);

  return newData;
};

export const DragDropContainer: FC<{ onDragEnd: (result: any, provided?: any) => void }> = ({
  children,
  onDragEnd,
}) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId={'droppable'}>
      {(provided: any) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);
