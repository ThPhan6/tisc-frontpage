// import { useState } from 'react';
import { Tooltip } from 'antd';
import { useBoolean } from '@/helper/hook';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { Title, RobotoBodyText } from '@/components/Typography';
import CustomCollapse from '@/components/Collapse';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import type { RadioValue } from '@/components/CustomRadio/types';
// import type { CheckboxValue } from '@/components/CustomCheckbox/types';
// import {
//   AttributeOption,
//   ProductAttributeLine,
// } from '@/features/product/components/ProductAttributeComponent/AttributeComponent';
import type { FC } from 'react';

import styles from './styles/specification-tab.less';

interface SpecificationTabProps {}

const ReferToDesignLabel = () => {
  const TooltipText = () => {
    return (
      <RobotoBodyText level={6} customClass={styles.referTooltipText}>
        Select this option if you can not find the listed options or the variants are different from
        your design specification.
      </RobotoBodyText>
    );
  };

  return (
    <Title level={9} customClass={styles.referText}>
      <span>Refer to Design Document</span>
      <Tooltip placement="bottom" title={<TooltipText />} overlayClassName={styles.referTooltip}>
        <WarningIcon />
      </Tooltip>
    </Title>
  );
};

const SpecificationHeader = () => {
  return (
    <div className={styles.specificationHeaderItem}>
      <CustomCheckbox options={[{ label: 'Format & Thickness', value: 1 }]} />
    </div>
  );
};

const SpecificationTab: FC<SpecificationTabProps> = () => {
  const referToDesign = useBoolean(false);

  const ReferToDesignRadio: RadioValue = {
    value: 1,
    label: <ReferToDesignLabel />,
  };

  return (
    <div className={styles.specificationTab}>
      <CustomRadio
        options={[ReferToDesignRadio]}
        isRadioList
        value={referToDesign.value ? 1 : 0}
        onChange={(changedData) => referToDesign.setValue(changedData.value === 0)}
      />
      <div>
        <CustomCollapse
          defaultActiveKey={['1']}
          className={styles.specificationItem}
          header={<SpecificationHeader />}
        ></CustomCollapse>
      </div>
    </div>
  );
};
export default SpecificationTab;

// <ProductAttributeLine name="AVCD" />
// <AttributeOption
//   title={'123123'}
//   attributeName="ABCDE"
//   options={[{id: '124124', 'option_code': 'SP1'}]}
// />
