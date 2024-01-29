import { isEmpty } from 'lodash';

import { ProductInformationData } from '../dimension-weight/types';

import CustomCollapse from '@/components/Collapse';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

interface productInformationProps {
  data: ProductInformationData;
  onChange?: (data: ProductInformationData) => void;
  editable: boolean;
  isShow: boolean;
  activeCollapse: string | string[];
  onChangeCollapse: any;
  collapseStyles: boolean;
  noPadding?: boolean;
}
export const ProductInformation = (props: productInformationProps) => {
  const {
    data,
    isShow,
    onChange,
    editable,
    activeCollapse,
    onChangeCollapse,
    collapseStyles,
    noPadding,
  } = props;
  let dataToShow = data;
  if (!data) {
    dataToShow = { product_name: '', product_id: '' };
  }
  let show = isShow;
  if (!editable && isEmpty(dataToShow.product_id) && isEmpty(dataToShow.product_name)) {
    show = false;
  }
  return show ? (
    <div className={styles.productInformationContainer}>
      <CustomCollapse
        activeKey={activeCollapse}
        onChange={(key) => {
          if (onChangeCollapse) {
            onChangeCollapse?.(key);
          }
        }}
        showActiveBoxShadow={collapseStyles}
        expandingHeaderFontStyle="bold"
        noBorder={!collapseStyles}
        customHeaderClass={`${noPadding ? styles.noPadding : ''}`}
        header={
          <RobotoBodyText
            level={6}
            style={{ paddingBottom: 8, paddingTop: 8, paddingLeft: collapseStyles ? 16 : 0 }}
          >
            Product Information
          </RobotoBodyText>
        }
      >
        <div>
          <FormGroup
            label="Product name"
            layout="horizontal"
            labelFontSize={4}
            noColon
            customClass={styles.customFormGroup}
          >
            <CustomTextArea
              maxWords={50}
              placeholder={editable ? 'type product name here' : ''}
              value={dataToShow.product_name}
              onChange={(e) => {
                if (onChange) onChange({ ...dataToShow, product_name: e.target.value });
              }}
              customClass={`${styles.customTextArea}  ${editable ? '' : styles.viewInfo}`}
              readOnly={editable === false}
              autoResize
            />
          </FormGroup>

          <InputGroup
            horizontal
            customClass={styles.customInputGroup}
            fontLevel={4}
            containerClass={editable ? `` : styles.viewInfo}
            placeholder={editable ? 'type product ID here' : ''}
            hasPadding
            label="Product ID"
            readOnly={!editable}
            value={dataToShow.product_id}
            inputTitle={dataToShow.product_id}
            onChange={(e) => {
              if (onChange) onChange({ ...dataToShow, product_id: e.target.value });
            }}
          />
        </div>
      </CustomCollapse>
    </div>
  ) : null;
};
