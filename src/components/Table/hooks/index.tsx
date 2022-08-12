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
          // console.log(
          //   'record[column.noExpandIfEmptyData]',
          //   column.noExpandIfEmptyData,
          //   record[column.noExpandIfEmptyData],
          // );

          if (column.isExpandable) {
            const noExpand =
              column.noExpandIfEmptyData && record[column.noExpandIfEmptyData] === undefined
                ? true
                : false;
            // if (noExpand) {
            //   cellClassName.props.className = 'no-box-shadow';
            // }
            return {
              ...cellClassName,
              children: column.render
                ? renderExpandedColumn(column.render(value, record, index), record, noExpand)
                : renderExpandedColumn(value, record, noExpand),
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

const onCellLvl2Click = (expandableCellLvl2: Element, colWidthLvl3?: number) => {
  const isExpanding = expandableCellLvl2.querySelector('span[class^="expandedColumn"]')
    ? true
    : false;
  // console.log('isExpanding', isExpanding);

  if (isExpanding === false) {
    styleLvl2.innerHTML = '';
    return;
  }

  if (colWidthLvl3) {
    const expandableCellsLvl3 = document.querySelectorAll('tr[data-row-key] td:nth-child(3)');
    expandableCellsLvl3.forEach((expandableCellLvl3) => {
      if (!expandableCellLvl3) {
        return;
      }
      const spanTxtElLvl3 = expandableCellLvl3.querySelector(
        "div[class^='expandedCell'] span span",
      );
      // onCellLvl2Click(expandableCellLvl3);

      if (spanTxtElLvl3) {
        const textMaxwidth = colWidthLvl3 - OTHER_ELEMENTS_WIDTH;
        spanTxtElLvl3.style['max-width'] = `${textMaxwidth}px`;
      }

      // expandableCellLvl3.addEventListener('click', () => {
      //   setTimeout(() => onCellLvl2Click(expandableCellLvl3, colWidthLvl3), EXPANDED_DELAY);
      // });
    });
  }

  // Insert styles
  const newWidth = expandableCellLvl2.clientWidth;
  // console.log('newWidth', newWidth);

  styleLvl2.innerHTML = `tr[data-row-key] td:nth-child(2) { width: ${newWidth}px; }`;
};

const onLvl1CellClick = async (
  expandableCellLvl1: Element,
  colWidthLvl2?: number,
  colWidthLvl3?: number,
) => {
  // remove styles before re-add
  style.innerHTML = '';
  styleLvl2.innerHTML = '';

  const newWidth = expandableCellLvl1.clientWidth;

  style.innerHTML = `tr[data-row-key] td:first-child { width: ${newWidth}px; }`;

  const expandedColumns = document.querySelectorAll('tr[class*="custom-expanded"] td');
  const nestedSubColumns = document.querySelectorAll(
    'tr[class*="ant-table-expanded-row"]:not([style*="display: none;"]) tbody tr:not([class*="custom-expanded-level-"]):first-child td',
  );
  // console.log('expandedColumns', expandedColumns);

  if (expandedColumns && expandedColumns.length >= 4) {
    expandedColumns.forEach((dataCell, index) => {
      // Avoid resize first cell, last cells (Count and Account column)
      if ([0, expandedColumns.length - 1, expandedColumns.length - 2].includes(index)) {
        return;
      }
      const newCellWidth = nestedSubColumns?.[index]?.clientWidth;
      // console.log('newCellWidth', newCellWidth);

      if (newCellWidth) {
        style.innerHTML += ` tr[data-row-key] td:nth-child(${
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

    // onCellLvl2Click(expandableCellLvl2);

    if (spanTxtElLvl2) {
      const textMaxwidth = colWidthLvl2 - OTHER_ELEMENTS_WIDTH;
      spanTxtElLvl2.style['max-width'] = `${textMaxwidth}px`;
    }

    expandableCellLvl2.addEventListener('click', () => {
      setTimeout(() => onCellLvl2Click(expandableCellLvl2, colWidthLvl3), EXPANDED_DELAY);
    });
  });
};

export const useAutoExpandNestedTableColumn = (
  colWidthLvl1: number,
  colWidthLvl2?: number,
  colWidthLvl3?: number,
) => {
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
          setTimeout(
            () => onLvl1CellClick(expandableCellLvl1, colWidthLvl2, colWidthLvl3),
            EXPANDED_DELAY,
          );
        });
      });
    };

    setTimeout(injectClickToAdjustTableCellWidth, RETRY_INTERVAL);

    return () => {
      style.innerHTML = '';
      styleLvl2.innerHTML = '';
    };
  }, []);
  return null;
};
