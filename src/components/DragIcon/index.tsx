import { FC, useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { ReactComponent as DragIcon } from '@/assets/icons/scroll-icon.svg';

const reorder = (data: any, startIndex: number, endIndex: number) => {
  const result = Array.from(data);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/// using this hook at parent component
export const useDragging = () => {
  const [isDragDisabled, setIsDragDisabled] = useState<boolean>(true);

  useEffect(() => {
    return () => {
      setIsDragDisabled(true);
    };
  }, []);

  const getNewDataAfterReordering = (result: any, data: any) => {
    if (!result?.destination) {
      return data;
    }

    if (result?.destination?.index === result?.source?.index) {
      return data;
    }

    const newData = reorder(data, result.source.index, result.destination.index);

    return newData;
  };

  const DragDropIcon: FC = () => (
    <DragIcon
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseMove={(e) => {
        e.stopPropagation();
        setIsDragDisabled?.(false);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setIsDragDisabled?.(true);
      }}
    />
  );

  const DragDropContainer: FC<{ onDragEnd: (result: any) => void }> = useCallback(
    ({ children, onDragEnd }) => (
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
    ),
    [],
  );

  return {
    DragDropContainer,
    DragDropIcon,
    getNewDataAfterReordering,
    isDragDisabled,
    setIsDragDisabled,
  };
};
