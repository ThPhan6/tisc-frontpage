import React, { useContext, useEffect, useState } from 'react';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';

import { useAttributeLocation } from '../hooks/location';
import { getProductAttributeContentType } from '@/services';
import { isEmpty, isUndefined, lowerCase } from 'lodash';

import type { RadioValue } from '@/components/CustomRadio/types';
import type { TabItem } from '@/components/Tabs/types';
import type {
  AttributeContentType,
  AttributeSubForm,
  BasisConvention,
  BasisPresetOption,
  BasisText,
} from '@/types';
import { BasisPresetTypeString, EAttributeContentType } from '@/types';

import CustomButton from '@/components/Button';
import { CustomRadio } from '@/components/CustomRadio';
import { EmptyOne } from '@/components/Empty';
import { CustomModal } from '@/components/Modal';
import { CustomTabs } from '@/components/Tabs';

import styles from '../styles/contentTypeModal.less';
import { SPECIFICATION_TYPE } from '../utils';
import { AttributeEntryFormContext } from './AttributeEntryForm';
import { ContentOptionTypeDetail, ContentTypeDetail, formatBasisText } from './util';

interface ContentTypeOptionProps {
  data: BasisConvention[] | BasisPresetOption[] | BasisText[];
  type: EAttributeContentType;
  selectedOption: AttributeSubForm;
  setSelectedOption: (selected: AttributeSubForm) => void;
  // index: number;
}

const ContentTypeOption: React.FC<ContentTypeOptionProps> = ({
  data = [],
  type,
  selectedOption,
  setSelectedOption,
}) => {
  const optionType =
    type === EAttributeContentType.options ||
    type === EAttributeContentType.presets ||
    type === EAttributeContentType.feature_presets;

  if (!data.length) {
    return <EmptyOne isCenter />;
  }

  /// basis TEXT
  if (type === 'texts') {
    const onChangeBasisText = (basisId: string) => {
      const basistexts = [...data] as BasisText[];
      const selected = basistexts.find((item) => {
        return item.id === basisId;
      });
      if (selected) {
        setSelectedOption({
          basis_id: basisId,
          content_type: type,
          description: selected.name,
        } as any);
      }
    };

    return (
      <div /* style={{ paddingRight: 16 }} */>
        <CustomRadio
          options={formatBasisText(data)}
          value={selectedOption.basis_id}
          onChange={(radioValue) => onChangeBasisText(String(radioValue.value))}
          isRadioList
        />
      </div>
    );
  }

  const onChangeConversion = (basisId: string) => {
    const conversions = [...data] as BasisConvention[];
    conversions.forEach((conversion) => {
      const selected = conversion.subs.find((sub) => {
        return sub.id === basisId;
      });
      if (selected) {
        setSelectedOption({
          basis_id: basisId,
          content_type: type,
          description_1: selected.name_1,
          description_2: selected.name_2,
        } as any);
      }
    });
  };

  const onChangeOption = (basisId: string) => {
    const optionData = [...data] as BasisPresetOption[];
    optionData.forEach((option) => {
      option.subs?.forEach((subItem) => {
        const selected = subItem.subs?.find((sub) => {
          return sub.id === basisId;
        });

        if (!selected) {
          return;
        }

        if (type === EAttributeContentType.options) {
          setSelectedOption({
            basis_id: basisId,
            content_type: type,
            description: selected.name,
          } as any);

          return;
        }

        /// type for check tab active
        if (
          type === EAttributeContentType.presets ||
          type === EAttributeContentType.feature_presets
        ) {
          setSelectedOption({
            basis_id: basisId,
            /// content_type is always <preset>
            content_type: EAttributeContentType.presets,
            description: selected.name,
            /// add additional type to differentiate preset
            additional_type:
              type === EAttributeContentType.presets
                ? BasisPresetTypeString.general
                : BasisPresetTypeString.feature,
          } as any);

          return;
        }
      });
    });
  };

  const onChange = (radioValue: RadioValue) => {
    if (type === EAttributeContentType.conversions) {
      onChangeConversion(String(radioValue.value));
      return;
    }

    if (optionType) {
      onChangeOption(String(radioValue.value));
      return;
    }

    return;
  };

  const newData = [...data].filter((item: any) => !isEmpty(item.subs));

  if (optionType) {
    return (
      <ContentOptionTypeDetail
        onChange={onChange}
        value={selectedOption.basis_id}
        options={newData as BasisPresetOption[]}
      />
    );
  }

  /// type conversions
  return (
    <ContentTypeDetail
      onChange={onChange}
      options={newData as BasisPresetOption[]}
      type={type}
      // options={renderOptions(option.subs)}
      value={selectedOption.basis_id}
    />
  );
};

const DEFAULT_CONTENT_TYPE: AttributeSubForm = {
  basis_id: '',
  name: '',
  description: '',
};

interface ContentTypeModalProps {}

const ContentTypeModal: React.FC<ContentTypeModalProps> = (props) => {
  const {} = props;

  const { attributeLocation } = useAttributeLocation();
  const type = attributeLocation.TYPE;

  const {
    openContentTypeModal: visible,
    setOpenContentTypeModal: setVisible,
    setContentTypeSelected,
    contentTypeSelected: subAttribute,
    setAttributeSelected,
  } = useContext(AttributeEntryFormContext);

  const listTab: TabItem[] = [
    /// key of contentType
    { tab: 'TEXT', key: EAttributeContentType.texts },
    { tab: 'CONVERSIONS', key: EAttributeContentType.conversions },
    {
      tab: 'GENERAL PRESETS',
      key: EAttributeContentType.presets,
      disable: type === SPECIFICATION_TYPE,
    },
    {
      tab: 'FEATURE PRESETS',
      key: EAttributeContentType.feature_presets,
      disable: type === SPECIFICATION_TYPE,
    },
    { tab: 'COMPONENTS', key: EAttributeContentType.options, disable: type !== SPECIFICATION_TYPE },
  ];

  /// default selected option
  const [selectedOption, setSelectedOption] = useState<AttributeSubForm>(
    subAttribute ?? DEFAULT_CONTENT_TYPE,
  );
  /// set active tab
  let selectedTab = listTab[0];

  const [activeTab, setActiveTab] = useState<EAttributeContentType>(
    selectedTab.key as EAttributeContentType,
  );

  // for content type data
  const [contentType, setContentType] = useState<AttributeContentType>({
    conversions: [],
    options: [],
    presets: [],
    texts: [],
    feature_presets: [],
  });

  // load data content type
  useEffect(() => {
    getProductAttributeContentType().then((contentTypeData) => {
      if (contentTypeData) {
        setContentType(contentTypeData);
      }
    });
  }, []);

  useEffect(() => {
    setSelectedOption(subAttribute ?? DEFAULT_CONTENT_TYPE);

    if (!isUndefined(subAttribute?.content_type)) {
      const selected = listTab.find((item) => {
        if (subAttribute.content_type?.toLowerCase() === 'presets') {
          return (item.key =
            subAttribute.additional_type?.toLowerCase() === 'general presets'
              ? EAttributeContentType.presets
              : EAttributeContentType.feature_presets);
        }

        return item.key.indexOf(lowerCase(subAttribute.content_type)) >= 0;
      });

      if (selected) {
        selectedTab = selected;
      }
    }

    setActiveTab(selectedTab.key as EAttributeContentType);
  }, [subAttribute]);

  const handleSubmit = () => {
    if (!subAttribute || !selectedOption) {
      /// reset content type selected
      setContentTypeSelected?.(DEFAULT_CONTENT_TYPE);
      // close modal
      setVisible(false);
      return;
    }

    /// save attribute selected to update data on form
    setAttributeSelected?.({ ...subAttribute, ...selectedOption });

    /// reset content type selected
    setContentTypeSelected?.(DEFAULT_CONTENT_TYPE);
    // close modal
    setVisible(false);
  };

  return (
    <CustomModal
      title="SELECT CONTENT TYPE"
      centered
      visible={visible}
      onCancel={() => setVisible(false)}
      secondaryModal
      noHeaderBorder={false}
      width={'60%'}
      className={styles.contentTypeModalWrapper}
      closeIcon={<CloseIcon />}
      footer={
        <div className={styles.contentTypeFooter}>
          <CustomButton
            size="small"
            buttonClass={styles.contentTypeSubmitBtn}
            onClick={handleSubmit}
            properties="rounded"
          >
            Done
          </CustomButton>
        </div>
      }
    >
      <div>
        <CustomTabs
          listTab={listTab}
          tabPosition="top"
          tabDisplay="space"
          onChange={(tabActived) => {
            setActiveTab(tabActived as EAttributeContentType);
          }}
          activeKey={activeTab}
        />
        <div
          className={`${styles.contentTypeModalBody} ${
            activeTab === EAttributeContentType.texts ? styles.contentTypeText : ''
          } ${
            activeTab === EAttributeContentType.options ||
            activeTab === EAttributeContentType.presets ||
            activeTab === EAttributeContentType.feature_presets
              ? styles.contentTypeOption
              : ''
          }`}
        >
          <ContentTypeOption
            type={activeTab}
            data={contentType ? contentType[activeTab] : []}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default ContentTypeModal;
