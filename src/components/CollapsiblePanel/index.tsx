import { ReactNode, memo, useState } from 'react';

import { Dropdown, Menu } from 'antd';

import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { PartnerContactStatus } from '@/types';

import { FilterKeys } from '@/pages/Brand/Adminstration/Partners';

import styles from './index.less';

export interface CollapsiblePanelItem {
  id: number;
  title: string;
  headingDropdown?: { label: ReactNode; headingOnClick: () => void };
  labels?: { id: string; label: ReactNode; labelAction: () => void }[];
}

interface CollapsiblePanelProps {
  filters?: Partial<Record<FilterKeys, string | number>>;
  onRemoveFilter?: (key: FilterKeys, value?: string | PartnerContactStatus) => () => void;
  disabled?: boolean;
  panels: CollapsiblePanelItem[];
}

const CollapsiblePanel = ({
  disabled = false,
  panels,
  filters,
  onRemoveFilter,
}: CollapsiblePanelProps) => {
  const [openPanelIndex, setOpenPanelIndex] = useState<number | null>(null);

  const handleToggleDropdown =
    (index: number) => (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (disabled) return;
      event.preventDefault();
      setOpenPanelIndex(index);
    };

  const handleVisibleChange = (index: number) => () => {
    if (disabled) return;
    setOpenPanelIndex(openPanelIndex === index ? null : index);
  };

  const handleAction = (action: () => void) => () => {
    action();
    setOpenPanelIndex(null);
  };

  const handleOnRemoveFilter =
    (key: FilterKeys) => (event: React.MouseEvent<SVGElement, MouseEvent>) => {
      event.stopPropagation();
      if (onRemoveFilter) onRemoveFilter(key)();
    };

  const isCursorPointer = () => (!disabled ? 'pointer' : 'not-allowed');

  return (
    <>
      {panels.map((panel, index) => {
        const key =
          panel.title === 'Activation'
            ? 'status'
            : (`${panel.title.toLowerCase()}_id` as FilterKeys);
        const filterId = filters?.[key];
        const selectedLabel = panel.labels?.find(
          (label) => label.id === filterId?.toString(),
        )?.label;

        return (
          <Dropdown
            key={panel.id}
            trigger={['click']}
            placement="topRight"
            visible={openPanelIndex === index}
            onVisibleChange={handleVisibleChange(index)}
            className={`${styles.collapsiblePanel}`}
            overlay={
              <Menu className={styles.collapsiblePanelMenu}>
                <Menu.Item
                  style={{ padding: 0, marginBottom: 0 }}
                  onClick={handleAction(panel.headingDropdown?.headingOnClick ?? (() => {}))}
                >
                  {panel.headingDropdown ? (
                    <span className={`${styles.collapsiblePanelContentHeading} text-uppercase`}>
                      {panel.headingDropdown.label}
                    </span>
                  ) : null}
                </Menu.Item>

                <div className={styles.collapsiblePanelMenuHeadingContainer}>
                  {panel?.labels?.map(({ id, label, labelAction }) => (
                    <Menu.Item
                      key={id}
                      style={{ margin: '0', background: '#fff' }}
                      className={styles.collapsiblePanelMenuHeading}
                      onClick={handleAction(labelAction)}
                    >
                      <span
                        className={`${styles.collapsiblePanelMenuHeadingLabel} text-capitalize`}
                      >
                        {label}
                      </span>
                    </Menu.Item>
                  ))}
                </div>
              </Menu>
            }
          >
            <section
              onClick={handleToggleDropdown(index)}
              className="d-flex items-center"
              style={{ cursor: `${isCursorPointer()}` }}
            >
              <h2
                className={`${styles.collapsiblePanelTitle} ${
                  disabled ? 'grey' : 'pure-black'
                } text-capitalize`}
              >
                {panel.title}
              </h2>

              <span
                className={`${styles.collapsiblePanelIcon} ${disabled ? 'grey' : 'pure-black'}`}
              >
                {openPanelIndex === index ? (
                  <DropupIcon className="size-16" />
                ) : (
                  <DropdownIcon className="size-16" />
                )}
              </span>

              <div className={styles.collapsiblePanelView}>
                {selectedLabel ? (
                  <article className="d-flex items-center">
                    <h2 className={`ellipsis ${styles.collapsibleFilterLabel} my-0`}>
                      {selectedLabel}
                    </h2>
                    <RemoveIcon className="ml-8 pure-black" onClick={handleOnRemoveFilter(key)} />
                  </article>
                ) : (
                  'view'
                )}
              </div>
            </section>
          </Dropdown>
        );
      })}
    </>
  );
};

export default memo(CollapsiblePanel);
