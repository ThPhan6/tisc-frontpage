import { PATH } from '@/constants/path';
import { Switch } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as HomeIcon } from '@/assets/icons/home.svg';

import { useNavigationHandler } from '@/helper/hook';

import { ModalType } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText } from '@/components/Typography';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Templates/PriceAndInventoryTable.less';

interface PriceAndInventoryTableHeaderProps {
  isEditMode: boolean;
  onToggleSwitch: () => void;
  onToggleModal: (type: ModalType) => () => void;
}

const PriceAndInventoryTableHeader = ({
  isEditMode,
  onToggleSwitch,
  onToggleModal,
}: PriceAndInventoryTableHeaderProps) => {
  const navigate = useNavigationHandler();
  const location = useLocation<{
    categoryId: string;
    brandId: string;
  }>();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('categories');

  return (
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
            unCheckedChildren="EDIT NOW"
            className={`${styles.category_table_header_btn_switch} ${
              isEditMode
                ? styles.category_table_header_btn_switch_on
                : styles.category_table_header_btn_switch_off
            }`}
          />
          {/* <CustomButton
            size="small"
            variant="primary"
            buttonClass={`${styles.category_table_header_action_btn_import} ${
              isEditMode ? 'disabled' : ''
            }`}
            disabled={isEditMode}
          >
            <BodyText
              fontFamily="Roboto"
              level={6}
              style={{ color: `${isEditMode ? '#808080' : '#000'}` }}
              customClass={`${styles.category_table_header_action_btn_import_text}`}
              onClick={onToggleModal('Import/Export')}
            >
              IMPORT/EXPORT
            </BodyText>
          </CustomButton> */}
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
  );
};

export default PriceAndInventoryTableHeader;
