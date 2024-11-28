import { useEffect } from 'react';

import { PATH } from '@/constants/path';
import { Switch } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';

import { useNavigationHandler } from '@/helper/hook';

import { resetState, setOpenModal } from '@/features/Import/reducers';
import store from '@/reducers';

import CustomButton from '@/components/Button';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText } from '@/components/Typography';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable.less';

import { ImportExportModal } from '@/features/Import';

interface PriceAndInventoryTableHeaderProps {
  isEditMode: boolean;
  onToggleSwitch: () => void;
  onSave: (type: 'import' | 'export', isSaved?: boolean) => void;
}

const PriceAndInventoryTableHeader = ({
  isEditMode,
  onToggleSwitch,
  onSave,
}: PriceAndInventoryTableHeaderProps) => {
  const navigate = useNavigationHandler();
  const location = useLocation<{
    categoryId: string;
    brandId: string;
  }>();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');

  const handleOpenModal = (isOpen: boolean) => () => {
    store.dispatch(resetState());
    store.dispatch(setOpenModal(isOpen));
  };

  useEffect(() => {
    return () => {
      handleOpenModal(false);
    };
  }, []);

  return (
    <>
      <TableHeader
        title={
          <article className={styles.category_table_header}>
            <div
              className="d-flex items-center cursor-pointer"
              onClick={navigate({
                path: PATH.brandPricesInventories,
              })}
            >
              <BodyText
                fontFamily="Roboto"
                level={5}
                customClass={styles.category_table_header_title}
              >
                HOME
              </BodyText>
              <HomeIcon />
            </div>
            <BodyText
              fontFamily="Roboto"
              level={5}
              customClass={styles.category_table_header_category}
            >
              {category}
            </BodyText>
          </article>
        }
        rightAction={
          <div className={styles.category_table_header_action}>
            <Switch
              checked={isEditMode}
              onChange={onToggleSwitch}
              size="default"
              checkedChildren="SAVE & CLOSE"
              unCheckedChildren="QUICK EDIT"
              className={`${styles.category_table_header_btn_switch} ${
                isEditMode
                  ? styles.category_table_header_btn_switch_on
                  : styles.category_table_header_btn_switch_off
              }`}
            />
            <CustomButton
              size="small"
              variant="primary"
              disabled={isEditMode}
              buttonClass={`${styles.category_table_header_action_btn_import} ${
                isEditMode ? 'disabled' : ''
              }`}
            >
              <BodyText
                fontFamily="Roboto"
                level={6}
                style={{ color: `${isEditMode ? '#808080' : '#000'}` }}
                customClass={`${styles.category_table_header_action_btn_import_text}`}
                onClick={handleOpenModal(true)}
              >
                IMPORT/EXPORT
              </BodyText>
            </CustomButton>

            <CustomPlusButton
              size={24}
              disabled={isEditMode}
              onClick={navigate({
                path: PATH.brandPricesInventoriesForm,
                query: { categories: category },
                state: {
                  categoryId: location.state?.categoryId,
                  brandId: location.state?.brandId,
                },
              })}
            />
          </div>
        }
      />

      <ImportExportModal onCancel={handleOpenModal(false)} onSave={onSave} />
    </>
  );
};

export default PriceAndInventoryTableHeader;
