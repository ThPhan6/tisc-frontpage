import { useState } from 'react';

import { Dropdown, Menu } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import styles from './index.less';

interface CollapsiblePanelItem {
  id: number;
  title?: string;
  headingDropdown?: string;
  labels: { id: number; label: string }[];
}

interface CollapsiblePanelProps {
  panels: CollapsiblePanelItem[];
}

const CollapsiblePanel = ({ panels }: CollapsiblePanelProps) => {
  const [openPanelIndex, setOpenPanelIndex] = useState<number | null>(null);

  const handleToggleDropdown = (index: number) => () =>
    setOpenPanelIndex(openPanelIndex === index ? null : index);

  return (
    <>
      {panels?.map((panel, index) => (
        <div className={styles.collapsiblePanel} key={panel.id}>
          <div className={styles.collapsiblePanelHeader} onClick={handleToggleDropdown(index)}>
            {panel.title && <span className={styles.collapsiblePanelTitle}>{panel.title}</span>}

            <span className={styles.collapsiblePanelIcon}>
              {openPanelIndex === index ? <DropupIcon /> : <DropdownIcon />}
            </span>
          </div>

          {openPanelIndex === index && (
            <div className={styles.collapsiblePanelContent}>
              <Dropdown trigger={['click']} placement="topRight">
                <Menu>
                  <Menu.Item style={{ padding: 0, marginBottom: 0 }}>
                    {panel.headingDropdown ? (
                      <span className={styles.collapsiblePanelContentHeading}>
                        {panel.headingDropdown}
                      </span>
                    ) : null}
                  </Menu.Item>

                  {panel?.labels?.map((item) => (
                    <Menu.Item
                      key={item.id}
                      style={{ margin: '0' }}
                      className={styles.collapsiblePanelMenuHeading}
                    >
                      {item.label}
                    </Menu.Item>
                  ))}
                </Menu>
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
