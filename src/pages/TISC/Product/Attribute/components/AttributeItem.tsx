import { FC, useContext } from 'react';

import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';
import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';

import { useCheckBranchAttributeTab } from '../../BrandAttribute/hook';
import { lowerCase, startCase } from 'lodash';

import { AttributeSubForm, EAttributeContentType } from '@/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import { BranchTabKey } from '../../BrandAttribute/BranchHeader';
import styles from '../styles/attributeItem.less';
import { AttributeEntryFormContext } from './AttributeEntryForm';

interface AttributeItemProps {
  item: AttributeSubForm;
  onChangeItemName?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AttributeItem: FC<AttributeItemProps> = ({ item, onChangeItemName }) => {
  const { setContentTypeSelected, setOpenContentTypeModal } = useContext(AttributeEntryFormContext);

  const { currentTab } = useCheckBranchAttributeTab();

  const handleSelectContentType = () => {
    setContentTypeSelected?.(item);
    setOpenContentTypeModal(true);
  };

  const renderContentType = () => {
    if (item.content_type?.toLowerCase() === EAttributeContentType.texts) {
      return startCase('text');
    }

    if (item.content_type?.toLowerCase() === EAttributeContentType.options) {
      return startCase('component');
    }

    if (item.content_type?.toLowerCase() === EAttributeContentType.presets) {
      if (currentTab === BranchTabKey.general) {
        return startCase('General Presets');
      }

      return startCase('Feature Presets');
    }

    return startCase(item.content_type);
  };

  return (
    <div className={styles.attribute_container}>
      <div className={`flex-start`}>
        <div className={styles.form_input__element}>
          <CustomInput
            placeholder="type attribute name"
            value={item.name}
            name="name"
            className="attribute-input"
            onChange={onChangeItemName}
            autoWidth
            defaultWidth={180}
          />
        </div>

        <div className="flex-start flex-grow">
          <div
            className={`${styles.form_input__element} ${styles.form_input__cursor}`}
            onClick={handleSelectContentType}
          >
            <div className="group-content-type">
              <BodyText level={4}>Content Type </BodyText>
              <SingleRightFormIcon style={{ margin: '0 8px' }} />

              <BodyText
                level={5}
                fontFamily="Roboto"
                color={item.content_type ? 'mono-color' : 'mono-color-medium'}
              >
                {item.content_type ? (
                  <span className="basis-conversion-group text-capitalize">
                    {renderContentType()}
                  </span>
                ) : (
                  'select from the list'
                )}
              </BodyText>
            </div>
          </div>
          <div className={styles.form_input__element}>
            <div className="group-content-type">
              <BodyText level={4} style={{ whiteSpace: 'nowrap' }}>
                Description :
              </BodyText>
              <BodyText level={5} fontFamily="Roboto" customClass="group-type-placeholder">
                {lowerCase(item.content_type!).indexOf('conversion') >= 0 ? (
                  <span className="basis-conversion-group">
                    {item.description_1}
                    <SwapIcon />
                    {item.description_2}
                  </span>
                ) : (
                  <span className="basis-conversion-group">{item.description}</span>
                )}
              </BodyText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
