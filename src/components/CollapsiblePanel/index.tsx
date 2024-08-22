import { ReactNode, useState } from 'react';

import { Dropdown, Menu } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import styles from './index.less';

export interface CollapsiblePanelItem {
  id: number;
  title: string;
  headingDropdown?: { label: ReactNode; headingOnClick: () => void };
  labels?: { id: string; label: ReactNode; labelAction: () => void }[];
}

interface CollapsiblePanelProps {
  disabled?: boolean;
  panels: CollapsiblePanelItem[];
}

const CollapsiblePanel = ({ disabled = false, panels }: CollapsiblePanelProps) => {
  const [openPanelIndex, setOpenPanelIndex] = useState<number | null>(null);

  const handleToggleDropdown = (index: number) => () => {
    if (disabled) return;
    setOpenPanelIndex(openPanelIndex === index ? null : index);
  };

  const handleAction = (action: () => void) => () => {
    action();
    setOpenPanelIndex(null);
  };

  return (
    <>
      {panels?.map((panel, index) => (
        <div
          className={`${styles.collapsiblePanel} ${disabled ? 'cursor-disabled' : ''}`}
          key={panel.id}
        >
          <div className={styles.collapsiblePanelHeader} onClick={handleToggleDropdown(index)}>
            {panel.title && (
              <span className={`${styles.collapsiblePanelTitle} ${disabled ? 'grey' : ''}`}>
                {panel.title}
              </span>
            )}

            <span className={styles.collapsiblePanelIcon}>
              {openPanelIndex === index ? <DropupIcon /> : <DropdownIcon />}
            </span>
          </div>

          {openPanelIndex === index && (
            <div className={styles.collapsiblePanelContent}>
              <Dropdown
                trigger={['click']}
                placement="topRight"
                visible={openPanelIndex === index}
                onVisibleChange={handleToggleDropdown(index)}
                overlay={
                  <Menu className={styles.collapsiblePanelMenu}>
                    <Menu.Item
                      style={{ padding: 0, marginBottom: 0 }}
                      onClick={handleAction(panel.headingDropdown?.headingOnClick ?? (() => {}))}
                    >
                      {panel.headingDropdown ? (
                        <span className={styles.collapsiblePanelContentHeading}>
                          {panel.headingDropdown.label}
                        </span>
                      ) : null}
                    </Menu.Item>

                    {panel?.labels?.map(({ id, label, labelAction }) => (
                      <Menu.Item
                        key={id}
                        style={{ margin: '0' }}
                        className={styles.collapsiblePanelMenuHeading}
                        onClick={handleAction(labelAction)}
                      >
                        {label}
                      </Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <span />
              </Dropdown>
            </div>
          )}
          <span className={styles.collapsiblePanelView}>view</span>
        </div>
      ))}
    </>
  );
};

export default CollapsiblePanel;
