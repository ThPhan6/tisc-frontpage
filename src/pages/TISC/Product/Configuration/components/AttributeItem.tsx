import React, { useState } from 'react';
// import {useBoolean} from '@/helper/hook';
import { MainTitle } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import InputGroup from '@/components/EntryForm/InputGroup';
// import { CustomInput } from '@/components/Form/CustomInput';
// import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
// import { ReactComponent as ActionRightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';
import { Collapse } from 'antd';
import styles from '../styles/details.less';
// import {createCollection, getCollectionByBrandId} from '@/services';
// import type {IBrandDetail, ICollection} from '@/types';

const AttributeItem: React.FC = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Collapse
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
        expandIconPosition="right"
      >
        <Collapse.Panel
          key="1"
          className={styles.productAttributeItem}
          header={
            <InputGroup
              horizontal
              fontLevel={4}
              label={<ScrollIcon />}
              placeholder="type title"
              noWrap
            />
          }
        >
          <div className="attribute-select-group" onClick={() => setVisible(true)}>
            <MainTitle level={4} customClass="group-heading-text">
              Select General Attributes
            </MainTitle>
            <SingleRightIcon className="single-right-icon" />
            <DeleteIcon className="delete-icon" />
          </div>
          <div className={styles.attributeSubItem}>
            <InputGroup
              horizontal
              fontLevel={4}
              label="Title Thickness"
              placeholder="type title"
              // rightIcon={<ActionRightLeftIcon />}
              deleteIcon
              noWrap
            />
          </div>
        </Collapse.Panel>
      </Collapse>

      <Popover title="SELECT GENERAL ATTRIBUTES" visible={visible} setVisible={setVisible} />
    </>
  );
};

export default AttributeItem;
