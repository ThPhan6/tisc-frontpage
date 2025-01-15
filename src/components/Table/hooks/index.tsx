import { useEffect, useState } from 'react';

import type { ColumnType } from 'antd/lib/table';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as SortIcon } from '@/assets/icons/sort-icon.svg';

import { repeat } from 'lodash';

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
        className={styles.expandedCell}
      >
        <span className={isExpanding ? styles.expandedColumn : ''}>{value}</span>
        <DropDownIcon width="18" height="18" />
      </div>
    );
  };

  const getColumnJustifyContent = (columnAlign?: 'center' | 'right' | 'left') => {
    if (columnAlign === 'center') return 'center';

    return columnAlign === 'right' ? 'flex-end' : undefined;
  };

  const formatTitleColumn = (column: TableColumnItem<any>) => {
    return () => {
      return (
        <div
          className={styles.titleTable}
          style={{
            justifyContent: getColumnJustifyContent(column.align),
          }}
        >
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

          const node = column.render?.(value, record, index) || value;

          return {
            ...cellClassName,
            children:
              typeof node === 'object' ? (
                node
              ) : (
                <span data-text={typeof node === 'string' ? node : ''}>{node}</span>
              ),
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
let injectedCell = '';

const removeAllCollGroup = () => {
  const allCollGroup = document.querySelectorAll('colgroup');
  allCollGroup.forEach((el) => el.remove());
};

const syncColWidthFollowingTheDeepestDataRow = (
  level: number,
  curCellStyle: Element,
  excludedColumns: number[],
) => {
  const headers = document.querySelectorAll('thead tr th') as any;
  headers.forEach((item: any) => {
    item.style.width = '';
  });
  const expandedColumns = document.querySelectorAll('tr[class$="custom-expanded"] td');

  const nestedSubRows = document.querySelectorAll(
    `tr[class*="ant-table-expanded-row"]:not([style*="display: none;"])`,
  );
  // First row will work for case with Entire Project row (table with multiple level of nesting)
  const firstRowSubColumns = nestedSubRows[0]?.querySelectorAll(
    `tbody tr[class$="custom-expanded-level-${level + 1}"]:first-child td`,
  );
  // Last row will work most time
  const lastRowSubColumns = nestedSubRows[nestedSubRows?.length - 1]?.querySelectorAll(
    `tbody tr[class$="custom-expanded-level-${level + 1}"]:first-child td`,
  );
  // // console.log(lastRowSubColumns);
  // setTimeout(() => {
  //   let temp: number[] = [];
  //   lastRowSubColumns?.forEach((item) => {
  //     temp.push(item.clientWidth);
  //   });
  //   temp = temp.filter((item) => item !== 0);

  //   console.log(temp);

  //   console.log(headers);
  //   temp.forEach((item, index) => {
  //     const headerEl = headers[index];
  //     headerEl.style.width = `${item}px`;
  //   });
  //   if (temp.length === 0) {
  //     headers.forEach((item: any) => {
  //       item.style.width = '';
  //     });
  //   }
  // }, 100);

  if (!firstRowSubColumns || !lastRowSubColumns || !expandedColumns || expandedColumns.length < 4) {
    return;
  }

  setTimeout(() => {
    let cellWidthStyles = '';
    curCellStyle.innerHTML = '';

    expandedColumns.forEach((_dataCell, index) => {
      const newCellWidth = excludedColumns.includes(index)
        ? 'auto'
        : (typeof lastRowSubColumns?.[index]?.clientWidth === 'number'
            ? lastRowSubColumns?.[index]?.clientWidth
            : firstRowSubColumns?.[index]?.clientWidth) + 'px';

      // Update style for each column from this data row to their relevant column of expandable column
      // Remember to add enter key
      if (!newCellWidth || newCellWidth === '0px') {
        return;
      }
      cellWidthStyles += `
      tr[data-row-key] td:nth-child(${
        index + 1
      }), tr.ant-table-row.ant-table-row-level-0 td:nth-child(${
        index + 1
      }) { width: ${newCellWidth} }`;
    });
    curCellStyle.innerHTML += cellWidthStyles;
  }, 100);
};

const openFullWidthCellByLevel = (
  level: number,
  style: Element,
  width: number,
  stack?: boolean,
) => {
  const newStyle = `tr[data-row-key] td:nth-child(${level}), tr.ant-table-row.ant-table-row-level-0 td:nth-child(${level}) { width: ${width}px; }`;
  if (stack) {
    style.innerHTML += newStyle;
  } else {
    style.innerHTML = newStyle;
  }
};

const updateStyleStatus = (
  level: number,
  cellStyles: HTMLStyleElement[],
  currentCellName: string,
) => {
  const notExpandingStyleIndex = cellStyles.findIndex(
    (cellStl) => cellStl.className.includes('expanding') === false,
  );
  cellStyles.forEach((cellStl, stlIndex) => {
    if (stlIndex <= level - 2) {
      return;
    }

    // disable not expanding style start from notExpandingStyleIndex
    cellStl.media =
      cellStl.id.includes(currentCellName) === false ||
      (notExpandingStyleIndex !== -1 && stlIndex >= notExpandingStyleIndex)
        ? 'not-all'
        : '';
  });
};

const getSubExpandableCell = (level: number) => {
  let subCellSelector = 'tr[class*="ant-table-expanded-row"]:not([style*="display: none;"]) ';
  if (level > 1) {
    subCellSelector = repeat(subCellSelector, level);
  }
  subCellSelector += `tbody tr[class$="custom-expanded-level-${
    level + 1
  }"]:first-child div[class^="expandedCell"]`;
  return document.querySelector(subCellSelector);
};

const getExpandableCell = (level: number) => {
  if (level === 1) {
    return document.querySelectorAll(
      `tr[data-row-key] td:nth-child(${level}) div[class^="expandedCell"]`,
    );
  }

  return document.querySelectorAll(
    repeat('tr[class*="ant-table-expanded-row"]:not([style*="display: none;"]) ', level - 1) +
      `tr[data-row-key] td:nth-child(${level}) div[class^='expandedCell']`,
  );
};

const setHeaderWidth = (level: number) => {
  const headers = document.querySelectorAll('thead tr th') as any;
  headers.forEach((item: any) => {
    item.style.width = '';
  });

  const nestedSubRows = document.querySelectorAll(
    `tr[class*="ant-table-expanded-row"]:not([style*="display: none;"])`,
  );
  const lastRowSubColumns = nestedSubRows[nestedSubRows?.length - 1]?.querySelectorAll(
    `tbody tr[class$="custom-expanded-level-${level + 1}"]:first-child td`,
  );
  // console.log(lastRowSubColumns);
  setTimeout(() => {
    let temp: number[] = [];
    lastRowSubColumns?.forEach((item) => {
      temp.push(item.clientWidth);
    });
    temp = temp.filter((item) => item !== 0);

    temp.forEach((item, index) => {
      const headerEl = headers[index];
      headerEl.style.width = `${item}px`;
    });
    if (temp.length === 0) {
      headers.forEach((item: any) => {
        item.style.width = '';
      });
    }
  }, 100);
};
const injectScriptToExpandableCellByLevel = (
  level: number,
  totalNestedLevel: number,
  cellStyles: HTMLStyleElement[],
  styleId: string,
  excludedColumns: number[],
) => {
  // Get expandable column cells by level
  const expandableCells = getExpandableCell(level);

  if (expandableCells.length === 0) {
    return;
  }

  const onExpandableCellClick = (cell: Element, cellIndex: number) => {
    const expandableCell = cell?.parentElement;
    if (!expandableCell) {
      return;
    }

    const curCellStyle = cellStyles[level - 1];

    removeAllCollGroup();

    const isExpanding = cell.querySelector('span[class^="expandedColumn"]') ? true : false;

    // Clear style before inject
    curCellStyle.innerHTML = '';

    // Use className to check expanding status
    curCellStyle.className = isExpanding ? 'expanding' : '';

    const expandableSubCell = getSubExpandableCell(level);

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
      curCellStyle.id = styleId + '_' + cellIndex;

      // Open full width for expandable cell
      if (expandableSubCell) {
        setTimeout(() => {
          openFullWidthCellByLevel(level, curCellStyle, expandableCell.clientWidth);
        }, EXPANDED_DELAY * 2);
      }

      // When re-open a col level, checking if its sub levels have closed status
      updateStyleStatus(level, cellStyles, curCellStyle.id);

      // still have children
      if (level < totalNestedLevel) {
        // Recursive call this function for the next level + 1
        injectScriptToExpandableCellByLevel(
          level + 1,
          totalNestedLevel,
          cellStyles,
          curCellStyle.id,
          excludedColumns,
        );
      }
    }

    setHeaderWidth(level);
    if (!expandableSubCell) {
      // This is the data row, don't have sub level anymore
      // Update style for each column from this data row to their relevant column of expandable column

      return syncColWidthFollowingTheDeepestDataRow(level, curCellStyle, excludedColumns);
    }

    // Open full width for sub-level expandable cell
    setTimeout(() => {
      const expandableSubFullCell = expandableSubCell.parentElement;
      if (expandableSubFullCell?.clientWidth) {
        openFullWidthCellByLevel(level + 1, curCellStyle, expandableSubFullCell.clientWidth, true);
      }
    }, 300);
  };

  expandableCells.forEach((cell: Element, cellIndex: number) => {
    // Get parentElement for full width
    // Handle when click on expandable cell (by level)

    const cellIdx = (styleId ?? '').replace('style', '') + '_' + cellIndex + ' ';

    // Prevent add on click event again
    if (injectedCell.includes(cellIdx) === false) {
      injectedCell += cellIdx;
      cell.addEventListener('click', () => {
        return setTimeout(() => onExpandableCellClick(cell, cellIndex), EXPANDED_DELAY);
      });
    }
  });
};

export const useAutoExpandNestedTableColumn = (
  totalNestedLevel: number,
  excludedColumns: number[],
  forceReload?: any,
) => {
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
        const newWidth = excludedColumns.includes(index) ? 'auto' : cell.clientWidth + 'px';
        colStyles += `tr[data-row-key] td:nth-child(${
          index + 1
        }), tr.ant-table-row.ant-table-row-level-0 td:nth-child(${
          index + 1
        }) { width: ${newWidth}; min-width: ${newWidth}; }
        `;
      });
      defaultStyle.innerHTML = colStyles;

      injectScriptToExpandableCellByLevel(
        1,
        totalNestedLevel,
        cellStyles,
        'style',
        excludedColumns,
      );
    };

    setTimeout(injectClickToAdjustTableCellWidth, RETRY_INTERVAL);

    return function removeStyles() {
      defaultStyle.remove();
      cellStyles.forEach((stl) => stl.remove());
      injectedCell = '';
    };
  }, [forceReload]);
  return null;
};
