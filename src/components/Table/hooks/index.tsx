import { useEffect, useState } from 'react';
import { Title, BodyText } from '@/components/Typography';
import { ReactComponent as SortIcon } from '@/assets/icons/sort-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import styles from '../styles/table.less';
import type { ColumnType } from 'antd/lib/table';
import type { TableColumnItem } from '../types';

type Expanded = number | undefined | string;

export const useCustomTable = (columns: TableColumnItem<any>[]) => {
  const [expanded, setExpanded] = useState<Expanded>();
  const renderExpandedColumn = (value: any, record: any) => {
    if (!value) {
      return null;
    }

    const expandedKey = `${record.id}`;
    const isExpanding = expandedKey === expanded;
    const DropDownIcon = isExpanding ? DropupIcon : DropdownIcon;

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
            return {
              ...cellClassName,
              children: column.render
                ? renderExpandedColumn(column.render(value, record, index), record)
                : renderExpandedColumn(value, record),
            };
          }

          return {
            ...cellClassName,
            children: column.render ? column.render(value, record, index) : value,
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
const style = document.createElement('style');
style.id = 'lvl1';
const styleLvl2 = document.createElement('style');
styleLvl2.id = 'lvl2';

const onCellLvl2Click = (expandableCellLvl2: Element) => {
  const isExpanding = expandableCellLvl2.querySelector('span[class^="expandedColumn"]')
    ? true
    : false;

  try {
    // try remove before re-add
    // styleLvl2.remove();
  } catch (err) {}

  if (isExpanding === false) {
    return;
  }

  // Insert styles
  const newWidth = expandableCellLvl2.clientWidth;
  // console.log('newWidth', newWidth);
  styleLvl2.innerHTML = `.ant-table-expanded-row.ant-table-expanded-row-level-1:not([style*="display: none;"]) tr[class*="ant-table-row-level"] td:nth-child(2),
    .ant-table-row-level-0.custom-expanded td:nth-child(2) { width: ${newWidth}px; }`;
};

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }
const onLvl1CellClick = async (expandableCellLvl1: Element, colWidthLvl2?: number) => {
  // try reset styles
  // style.remove();
  // styleLvl2.remove();
  style.innerHTML = '';
  styleLvl2.innerHTML = '';
  // await sleep(2000);
  const newWidth = expandableCellLvl1.clientWidth;

  // console.log('expandableCellLvl1', { expandableCellLvl1 });
  style.innerHTML = `.ant-table-expanded-row.ant-table-expanded-row-level-1:not([style*="display: none;"]) tr[class*="ant-table-row-level"] td:first-child { width: ${newWidth}px; }`;

  const expandedColumns = document.querySelectorAll('tr[class*="custom-expanded"] td');
  const nestedSubColumns = document.querySelectorAll(
    'tr[class*="ant-table-expanded-row"]:not([style*="display: none;"]) tbody tr:not([class*="custom-expanded-level-"]):first-child td',
  );

  if (expandedColumns && expandedColumns.length >= 4) {
    // let totalWidthDiff = 0;
    expandedColumns.forEach((dataCell, index) => {
      // Avoid resize first cell, last cells (Count and Account column)
      if ([0, expandedColumns.length - 1, expandedColumns.length - 2].includes(index)) {
        return;
      }
      // totalWidthDiff += nestedSubColumns?.[index]?.clientWidth - dataCell.clientWidth;
      // console.log('widthDiff', nestedSubColumns?.[index]?.clientWidth - dataCell.clientWidth);
      // console.log('totalWidthDiff', totalWidthDiff);
      // const isLastResizeableCell = index === expandedColumns.length - 3;
      const newCellWidth = nestedSubColumns?.[index]?.clientWidth;
      // console.log('newCellWidth', newCellWidth);
      if (newCellWidth) {
        style.innerHTML += ` tr[class*="custom-expanded"] td:nth-child(${
          index + 1
        }) { width: ${newCellWidth}px }`;
      }
      // dataCell.style.width = isExpanding ? `${nestedSubColumns?.[index]?.clientWidth}px` : 'auto';
    });
  }

  if (!colWidthLvl2) {
    return;
  }

  const expandableCellsLvl2 = document.querySelectorAll(
    'tr.ant-table-row-level-0.custom-expanded-level-2 td:nth-child(2)',
  );
  // console.log('expandableCellsLvl2', { expandableCellsLvl2 });
  if (expandableCellsLvl2.length === 0) {
    return;
  }

  expandableCellsLvl2.forEach((expandableCellLvl2) => {
    if (!expandableCellLvl2) {
      return;
    }
    const spanTxtElLvl2 = expandableCellLvl2.querySelector("div[class^='expandedCell'] span span");
    // const expandedColumnEl = expandableCellLvl2.querySelector('span[class^=expandedColumn]');
    // if (expandedColumnEl) {
    //   expandedColumnEl.className = '';
    // }
    onCellLvl2Click(expandableCellLvl2);

    if (spanTxtElLvl2) {
      const textMaxwidth = colWidthLvl2 - OTHER_ELEMENTS_WIDTH;
      spanTxtElLvl2.style['max-width'] = `${textMaxwidth}px`;
    }

    expandableCellLvl2.addEventListener('click', () => {
      setTimeout(() => onCellLvl2Click(expandableCellLvl2), EXPANDED_DELAY);
    });
  });
};

export const useAutoExpandNestedTableColumn = (colWidthLvl1: number, colWidthLvl2?: number) => {
  useEffect(() => {
    style.innerHTML = '';
    styleLvl2.innerHTML = '';
    document.getElementsByTagName('head')[0].appendChild(style);
    document.getElementsByTagName('head')[0].appendChild(styleLvl2);

    const injectClickToAdjustTableCellWidth = () => {
      const expandableCellsLvl1 = document.querySelectorAll(
        'tr.ant-table-row-level-0 td:first-child',
      );
      // console.log('expandableCellsLvl1', expandableCellsLvl1);

      // Recall until injected
      if (expandableCellsLvl1.length === 0) {
        setTimeout(injectClickToAdjustTableCellWidth, RETRY_INTERVAL);
        return;
      }

      expandableCellsLvl1.forEach((expandableCellLvl1) => {
        if (!expandableCellLvl1) {
          return;
        }
        // Insert styles for first columns
        const spanTxtElLvl1 = expandableCellLvl1.querySelector(
          "div[class^='expandedCell'] span span",
        );
        if (spanTxtElLvl1) {
          const textMaxwidth = colWidthLvl1 - OTHER_ELEMENTS_WIDTH;
          spanTxtElLvl1.style['max-width'] = `${textMaxwidth}px`;
        }

        const clickableEl = expandableCellLvl1.querySelector("div[class^='expandedCell']");

        clickableEl?.addEventListener('click', () => {
          setTimeout(() => onLvl1CellClick(expandableCellLvl1, colWidthLvl2), EXPANDED_DELAY);
        });
      });
    };

    setTimeout(injectClickToAdjustTableCellWidth, RETRY_INTERVAL);

    return () => {
      style.remove();
      styleLvl2.remove();
    };
  }, []);
  return null;
};
