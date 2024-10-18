import { ReactNode } from 'react';

import { Input } from 'antd';

import { ReactComponent as MagnifyingGlassIcon } from '@/assets/icons/ic-search.svg';

import styles from '@/components/InventoryHeader/InventoryHeader.less';
import { BodyText } from '@/components/Typography';

export interface DataItem {
  id: string;
  label: string;
  value: string;
  rightAction?: ReactNode;
}

interface InventoryHeaderProps {
  data: DataItem[];
  onSearch: (value: string) => void;
}

const InventoryHeader = ({ data, onSearch }: InventoryHeaderProps) => {
  return (
    <div className={styles.inventory_header}>
      <section className={styles.inventory_header_content}>
        {data.map((item) => (
          <div key={item.id} className={styles.inventory_header_content_wrapper}>
            <BodyText customClass={styles.inventory_header_value} fontFamily="Roboto" level={6}>
              {item.value}
            </BodyText>
            <div className="d-flex items-center gap-8">
              <BodyText customClass={styles.inventory_header_label} fontFamily="Roboto" level={6}>
                {item.label}
              </BodyText>
              {item.rightAction && item.rightAction}
            </div>
          </div>
        ))}
      </section>

      <div className={styles.inventory_header_search_container}>
        <Input placeholder="Search" />
        <div className="d-flex items-center">
          <BodyText fontFamily="Roboto" level={6} customClass="mr-16 pl-12">
            Product ID / SKU
          </BodyText>
          <MagnifyingGlassIcon />
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;
