import { FC } from 'react';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { useDrag } from './useDrag';

interface ScrollBarProps {
  children: any;
}

const ScrollBar: FC<ScrollBarProps> = ({ children }) => {
  const { dragStart, dragStop, onWheel, handleDrag } = useDrag();

  if (children) {
    return (
      <div onMouseLeave={() => dragStop}>
        <ScrollMenu
          onWheel={onWheel}
          onMouseDown={() => dragStart}
          onMouseMove={handleDrag}
          onMouseUp={() => dragStop}
        >
          {children}
        </ScrollMenu>
      </div>
    );
  }

  return null;
};
export default ScrollBar;
