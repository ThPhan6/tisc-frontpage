import { ChangeEvent, ReactNode, memo, useCallback, useEffect, useState } from 'react';

import { Input } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as MagnifyingGlassIcon } from '@/assets/icons/ic-search.svg';
import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';

import { formatCurrencyNumber } from '@/helper/utils';
import { getSummary } from '@/services';
import { debounce } from 'lodash';

import { useAppSelector } from '@/reducers';

import styles from '@/components/InventoryHeader/InventoryHeader.less';
import CurrencyModal from '@/components/Modal/CurrencyModal';
import { BodyText } from '@/components/Typography';

export interface DataItem {
  id: string;
  label: string;
  value: string | number;
  rightAction?: ReactNode;
}

interface InventoryHeaderProps {
  onSearch?: (value: string) => void;
  onSaveCurrency?: (currency: string) => void;
  hideSearch?: boolean;
}

const InventoryHeader = ({ onSearch, onSaveCurrency, hideSearch }: InventoryHeaderProps) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const { summaryFinancialRecords, currencySelected } = useAppSelector((state) => state.summary);

  const location = useLocation<{ categoryId: string; brandId: string }>();

  useEffect(() => {
    const brandId = location.state?.brandId;
    if (brandId) {
      const fetchSummary = async () => await getSummary(brandId);
      fetchSummary();
    }
  }, [location.state?.brandId]);

  const handleToggleModal = (status: boolean) => () => setIsShowModal(status);

  const data: DataItem[] = [
    {
      id: '1',
      value: currencySelected,
      label: 'BASE CURRENCY',
      rightAction: <SingleRightFormIcon className="cursor-pointer" width={16} height={16} />,
    },
    {
      id: '2',
      value: summaryFinancialRecords.total_product,
      label: 'TOTAL PRODUCT RECORDS',
    },
    {
      id: '3',
      value: formatCurrencyNumber(Number(summaryFinancialRecords.total_stock || 0), undefined, {
        maximumFractionDigits: 2,
      }),
      label: 'TOTAL STOCK VALUE',
    },
  ];

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch?.(value);
    }, 300),
    [onSearch],
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    debouncedSearch(event.target.value);

  return (
    <div className={styles.inventory_header}>
      <section className={styles.inventory_header_content}>
        {data.map((item) => (
          <div key={item.id} className={styles.inventory_header_content_wrapper}>
            <BodyText customClass={styles.inventory_header_value} fontFamily="Roboto" level={6}>
              {item.value}
            </BodyText>
            <div
              className={`d-flex items-center gap-8 ${item.id === '1' ? 'cursor-pointer' : ''}`}
              onClick={item.id === '1' ? handleToggleModal(true) : undefined}
            >
              <BodyText customClass={styles.inventory_header_label} fontFamily="Roboto" level={6}>
                {item.label}
              </BodyText>
              {item.rightAction && item.rightAction}
            </div>
          </div>
        ))}
      </section>
      {!hideSearch && (
        <div className={styles.inventory_header_search_container}>
          <Input placeholder="Search" disabled={!onSearch} onChange={handleSearchChange} />
          <div className="d-flex items-center" style={{ opacity: !onSearch ? 0.5 : 1 }}>
            <BodyText fontFamily="Roboto" level={6} customClass="mr-16 pl-12">
              Product ID / SKU
            </BodyText>
            <MagnifyingGlassIcon />
          </div>
        </div>
      )}

      <CurrencyModal
        onCancel={handleToggleModal(false)}
        open={isShowModal}
        title="SELECT CURRENCY"
        onSave={onSaveCurrency}
      />
    </div>
  );
};

export default memo(InventoryHeader);
