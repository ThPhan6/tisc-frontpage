import { useEffect, useState } from 'react';

import type { ColumnType } from 'antd/lib/table';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as SortIcon } from '@/assets/icons/sort-icon.svg';

import { snakeCase } from 'lodash';

import type { TableColumnItem } from '../types';

import { BodyText, Title } from '@/components/Typography';

import styles from '../styles/table.less';

type Expanded = number | undefined | string;

export const useCustomTable = (columns: TableColumnItem<any>[]) => {
  const [expanded, setExpanded] = useState<Expanded>();
  const renderExpandedColumn = (value: any, record: any, noExpand?: boolean) => {
    if (!value) {
      return null;
    }

    const expandedKey = `${record.id}`;
    const isExpanding = expandedKey === expanded;
    const DropDownIcon = isExpanding ? DropupIcon : DropdownIcon;

    if (noExpand) {
      return <div />;
    }

    return (
      <div
        onClick={() =>
          setExpanded((prevState) => (expandedKey === prevState ? undefined : expandedKey))
        }
        className={styles.expandedCell}>
        <span className={isExpanding ? styles.expandedColumn : ''}>{value}</span>
        <DropDownIcon width="18" height="18" />
      </div>
    );
  };

  const formatTitleColumn = (column: TableColumnItem<any>) => {
    return () => {
      return (
        <div
          className={styles.titleTable}
          style={{
            justifyContent:
              column.align === 'center'
                ? 'center'
                : column.align === 'right'
                ? 'flex-end'
                : undefined,
          }}>
          {column.lightHeading ? (
            <BodyText fontFamily="Roboto" level={5}>
              {column.title}
            </BodyText>
          ) : (
            <Title level={8}>{column.title}</Title>
          )}
          {column.sorter ? <SortIcon /> : null}
        </div>
      );
    };
  };

  const formatColumns = (): ColumnType<any>[] => {
    return columns.map((column) => {
      const noBoxShadow = column.noBoxShadow ? 'no-box-shadow' : '';
      const cellClassName = {
        props: {
          className: `${noBoxShadow}`,
        },
      };

      return {
        ...column,
        title: formatTitleColumn(column),
        render: (value: any, record: any, index: any) => {
          if (column.isExpandable) {
            const noExpand =
              column.noExpandIfEmptyData && record[column.noExpandIfEmptyData] === undefined
                ? true
                : false;
            return {
              ...cellClassName,
              children: renderExpandedColumn(
                column.render?.(value, record, index) || value,
                record,
                noExpand,
              ),
            };
          }

          return {
            ...cellClassName,
            children: column.render?.(value, record, index) || value,
          };
        },
      };
    });
  };

  return {
    expanded,
    columns: formatColumns(),
  };
};

const EXPANDED_DELAY = 50; // ms
const RETRY_INTERVAL = 100; // ms
const OTHER_ELEMENTS_WIDTH = 50; // two padding and arrow icon width

const injectScriptToExpandableCellByLevel = (
  level: number,
  cellStyles: HTMLStyleElement[],
  expandColWidths: number[],
  firstCellName?: string,
) => {
  const expandableCells = document.querySelectorAll(
    `tr[data-row-key] td:nth-child(${level}) div[class^='expandedCell']`,
  );

  if (expandableCells.length === 0) {
    return;
  }

  expandableCells.forEach((cell) => {
    const expandableCell = cell?.parentElement;
    if (!expandableCell) {
      return;
    }
    let cellName = '';
    if (level === 1) {
      cellName = snakeCase(cell.querySelector('span span')?.innerHTML || '');
    }
    const currentCellName = cellName || firstCellName || '';

    const onExpandableCellClick = () => {
      const isExpanding = cell.querySelector('span[class^="expandedColumn"]') ? true : false;

      cellStyles[level - 1].innerHTML = '';
      cellStyles[level - 1].className = isExpanding ? 'expanding' : '';

      if (isExpanding === false) {
        cellStyles.forEach((cellStl, stlIndex) => {
          if (stlIndex > level - 2) {
            cellStl.media = 'not-all';
          }
        });
      } else {
        cellStyles[level - 1].id = currentCellName + '_' + level;
        cellStyles[
          level - 1
        ].innerHTML = `tr[data-row-key] td:nth-child(${level}) { width: ${expandableCell.clientWidth}px; }`;

        const notExpandingStyleIndex = cellStyles.findIndex(
          (cellStl) => cellStl.className.includes('expanding') === false,
        );

        cellStyles.forEach((cellStl, stlIndex) => {
          if (stlIndex <= level - 2) {
            return;
          }

          cellStl.media =
            cellStl.id.includes(cellName) === false ||
            (cellStl.id.includes(cellName) &&
              notExpandingStyleIndex !== -1 &&
              stlIndex >= notExpandingStyleIndex)
              ? 'not-all'
              : '';
        });
      }

      // still have children
      if (expandColWidths[level]) {
        injectScriptToExpandableCellByLevel(
          level + 1,
          cellStyles,
          expandColWidths,
          currentCellName,
        );
      }

      const haveExpandSub = document.querySelector(
        `tr[class*="ant-table-expanded-row"]:not([style*="display: none;"]) tbody tr[class$="custom-expanded-level-${
          level + 1
        }"]:first-child div[class^="expandedCell"]`,
      );

      if (haveExpandSub) {
        return;
      }

      const expandedColumns = document.querySelectorAll('tr[class$="custom-expanded"] td');

      const nestedSubColumns = document.querySelectorAll(
        `tr[class*="ant-table-expanded-row"]:not([style*="display: none;"]) tbody tr[class$="custom-expanded-level-${
          level + 1
        }"]:first-child td`,
      );

      if (!expandedColumns || expandedColumns.length < 4) {
        return;
      }

      expandedColumns.forEach((_dataCell, index) => {
        const newCellWidth = nestedSubColumns?.[index]?.clientWidth;

        // Avoid resize expandable column cells and last col cells (Count and Account column)
        if (index < level || index > expandedColumns.length - 3 || !newCellWidth) {
          return;
        }

        cellStyles[level - 1].innerHTML += ` tr[data-row-key] td:nth-child(${
          index + 1
        }) { width: ${newCellWidth}px }`;
      });
    };

    cell.addEventListener('click', () => {
      setTimeout(onExpandableCellClick, EXPANDED_DELAY);
    });
  });
};

export const useAutoExpandNestedTableColumn = (expandColWidths: number[]) => {
  useEffect(() => {
    const defaultStyle = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(defaultStyle);
    let colStyles = '';
    expandColWidths.forEach((colWidth, colIndex) => {
      colStyles += `tr[data-row-key] td:nth-child(${
        colIndex + 1
      }) div[class^='expandedCell'] span span { max-width: ${colWidth - OTHER_ELEMENTS_WIDTH}px; }
      `;
    });
    defaultStyle.innerHTML = colStyles;

    const cellStyles = expandColWidths.map(() => {
      const celstyles = document.createElement('style');
      document.getElementsByTagName('head')[0].appendChild(celstyles);
      return celstyles;
    });

    const injectClickToAdjustTableCellWidth = () => {
      const expandableCellsLvl1 = document.querySelectorAll(
        'tr.ant-table-row-level-0 td:first-child',
      );

      // Recall until injected
      if (expandableCellsLvl1.length === 0) {
        setTimeout(injectClickToAdjustTableCellWidth, RETRY_INTERVAL);
        return;
      }

      injectScriptToExpandableCellByLevel(1, cellStyles, expandColWidths);
    };

    setTimeout(injectClickToAdjustTableCellWidth, RETRY_INTERVAL);

    return function removeStyles() {
      defaultStyle.remove();
      cellStyles.forEach((stl) => stl.remove());
    };
  }, []);
  return null;
};
