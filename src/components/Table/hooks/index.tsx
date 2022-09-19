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

const removeAllCollGroup = () => {
  const allCollGroup = document.querySelectorAll('colgroup');
  allCollGroup.forEach((el) => el.remove());
};

const syncColWidthFollowingTheDeepestDataRow = (
  level: number,
  curCellStyle: Element,
  rightColumnExcluded: number = 2,
) => {
  const expandedColumns = document.querySelectorAll('tr[class$="custom-expanded"] td');

  let nestedSubColumns = document.querySelectorAll(
    `tr[class*="ant-table-expanded-row"]:not([style*="display: none;"]):first-child tbody tr[class$="custom-expanded-level-${
      level + 1
    }"]:first-child td`,
  );
  if (nestedSubColumns.length === 0) {
    nestedSubColumns = document.querySelectorAll(
      `tr[class*="ant-table-expanded-row"]:not([style*="display: none;"]) tbody tr[class$="custom-expanded-level-${
        level + 1
      }"]:first-child td`,
    );
  }

  if (!expandedColumns || expandedColumns.length < 4) {
    return;
  }

  setTimeout(() => {
    let cellWidthStyles = '';
    expandedColumns.forEach((_dataCell, index) => {
      const newCellWidth = nestedSubColumns?.[index]?.clientWidth;

      // Avoid resize expandable column cells and last col cells (Count and Account column) and one auto width column
      if (
        index < level ||
        index > expandedColumns.length - 1 - rightColumnExcluded - 1 ||
        !newCellWidth
      ) {
        return;
      }

      // Update style for each column from this data row to their relevant column of expandable column
      // Remember to add enter key
      cellWidthStyles += `
      tr[data-row-key] td:nth-child(${index + 1}) { width: ${newCellWidth}px }`;
    });
    curCellStyle.innerHTML += cellWidthStyles;
  }, 300);
};

const openFullWidthCellByLevel = (level: number, style: Element, width: number) =>
  (style.innerHTML = `tr[data-row-key] td:nth-child(${level}) { width: ${width}px; }`);

const updateStyleStatus = (
  level: number,
  cellStyles: HTMLStyleElement[],
  currentCellName: string,
  cellIndex: number,
) => {
  const notExpandingStyleIndex = cellStyles.findIndex(
    (cellStl) => cellStl.className.includes('expanding') === false,
  );

  cellStyles.forEach((cellStl, stlIndex) => {
    if (stlIndex <= level - 2) {
      return;
    }

    const nameParts = cellStl.id.split('_');
    const styleCellIndex = Number(nameParts[nameParts.length - 1]);

    const cellStyleFromOtherFirstColId =
      cellStl.id.includes(currentCellName) === false || styleCellIndex !== cellIndex;

    // Disable style from level to all its sub levels below (stlIndex >= notExpandingStyleIndex)
    const cellIsNotExpanding =
      cellStl.id.includes(currentCellName) &&
      notExpandingStyleIndex !== -1 &&
      stlIndex >= notExpandingStyleIndex;

    cellStl.media = cellStyleFromOtherFirstColId || cellIsNotExpanding ? 'not-all' : '';
  });
};

const injectScriptToExpandableCellByLevel = (
  level: number,
  totalNestedLevel: number,
  cellStyles: HTMLStyleElement[],
  firstCellName?: string,
  rightColumnExcluded?: number,
) => {
  // Get expandable column cells by level
  const expandableCells = document.querySelectorAll(
    `tr[data-row-key] td:nth-child(${level}) div[class^='expandedCell']`,
  );

  if (expandableCells.length === 0) {
    return;
  }

  const onExpandableCellClick = (cell: Element, cellIndex: number) => {
    const expandableCell = cell?.parentElement;
    if (!expandableCell) {
      return;
    }

    // Get first collumn cell name to use as an id for its sub level cols
    const cellName = level === 1 ? snakeCase(cell.querySelector('span span')?.innerHTML || '') : '';

    const currentCellName = cellName || firstCellName || '';

    const curCellStyle = cellStyles[level - 1];

    removeAllCollGroup();

    const isExpanding = cell.querySelector('span[class^="expandedColumn"]') ? true : false;

    // Clear style before inject
    curCellStyle.innerHTML = '';

    // Use className to check expanding status
    curCellStyle.className = isExpanding ? 'expanding' : '';

    // When click to close
    if (isExpanding === false) {
      // Disable style for sub children styles
      cellStyles.forEach((cellStl, stlIndex) => {
        if (stlIndex > level - 2) {
          cellStl.media = 'not-all';
        }
      });
    } else {
      // When click to open
      // Update clicking cell width & Check disable style for the nested level

      // Set id following the first level cell name
      curCellStyle.id = currentCellName + '_' + level + '_' + cellIndex;

      // Open full width for expandable cell
      setTimeout(() => {
        openFullWidthCellByLevel(level, curCellStyle, expandableCell.clientWidth);
      }, EXPANDED_DELAY);

      // When re-open a col level, checking if its sub levels have closed status
      updateStyleStatus(level, cellStyles, currentCellName, cellIndex);
    }

    // still have children
    if (level < totalNestedLevel) {
      // Recursive call this function for the next level + 1
      injectScriptToExpandableCellByLevel(
        level + 1,
        totalNestedLevel,
        cellStyles,
        currentCellName,
        rightColumnExcluded,
      );
    }

    const expandableSubCell = document.querySelector(
      `tr[class*="ant-table-expanded-row"]:not([style*="display: none;"]) tbody tr[class$="custom-expanded-level-${
        level + 1
      }"]:first-child div[class^="expandedCell"]`,
    );

    if (!expandableSubCell) {
      // This is the data row, don't have sub level anymore
      // Update style for each column from this data row to their relevant column of expandable column

      return syncColWidthFollowingTheDeepestDataRow(level, curCellStyle, rightColumnExcluded);
    }

    // Open full width for sub-level expandable cell
    setTimeout(() => {
      const expandableSubFullCell = expandableSubCell.parentElement;
      if (expandableSubFullCell?.clientWidth) {
        openFullWidthCellByLevel(level + 1, curCellStyle, expandableSubFullCell.clientWidth);
      }
    }, 300);
  };

  expandableCells.forEach((cell: Element, cellIndex: number) => {
    // Get parentElement for full width
    // Handle when click on expandable cell (by level)

    const deplayOnExpandableCellClick = () =>
      setTimeout(() => onExpandableCellClick(cell, cellIndex), EXPANDED_DELAY);

    cell.removeEventListener('click', deplayOnExpandableCellClick);
    cell.addEventListener('click', deplayOnExpandableCellClick);
  });
};

export const useAutoExpandNestedTableColumn = (
  totalNestedLevel: number,
  options?: {
    autoWidthColIndex?: number; // Start from 0
    rightColumnExcluded?: number;
  },
) => {
  const rightColumnExcluded = options?.rightColumnExcluded || 2;
  useEffect(() => {
    const defaultStyle = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(defaultStyle);

    const cellStyles = new Array(3).fill(null).map(() => {
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

      let colStyles = '';
      const firstRow = document.querySelector('tr[data-row-key]');
      const allCells = firstRow?.querySelectorAll('td');
      allCells?.forEach((cell, index) => {
        const newWidth =
          index === allCells.length - 1 - rightColumnExcluded ? 'auto' : cell.clientWidth + 'px';
        colStyles += `tr[data-row-key] td:nth-child(${index + 1}) { width: ${newWidth}; }
        `;
      });
      defaultStyle.innerHTML = colStyles;

      injectScriptToExpandableCellByLevel(
        1,
        totalNestedLevel,
        cellStyles,
        undefined,
        rightColumnExcluded,
      );
    };

    setTimeout(injectClickToAdjustTableCellWidth, RETRY_INTERVAL);

    return function removeStyles() {
      defaultStyle.remove();
      cellStyles.forEach((stl) => stl.remove());
    };
  }, []);
  return null;
};
