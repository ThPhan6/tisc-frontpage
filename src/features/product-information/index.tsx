import { isEmpty } from 'lodash';

import { ProductInformationData } from '../dimension-weight/types';

import InputGroup from '@/components/EntryForm/InputGroup';
import { RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

interface productInformationProps {
  data: ProductInformationData;
  onChange?: (data: ProductInformationData) => void;
  editable: boolean;
  isShow: boolean;
}
export const ProductInformation = (props: productInformationProps) => {
  const { data, isShow, onChange, editable } = props;
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
      <RobotoBodyText level={6} style={{ paddingBottom: 8 }}>
        Product Information
      </RobotoBodyText>
      <hr
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          margin: 0,
          borderTop: 0,
          borderBottom: '1px solid #cdcdcd',
        }}
      />
      <div style={{ paddingTop: 10 }}>
        <InputGroup
          horizontal
          fontLevel={4}
          containerClass={editable ? `` : styles.viewInfo}
          placeholder={editable ? 'type product name here' : ''}
          hasPadding
          label="Product name"
          readOnly={!editable}
          value={dataToShow.product_name}
          inputTitle={dataToShow.product_name}
          onChange={(e) => {
            if (onChange) onChange({ ...dataToShow, product_name: e.target.value });
          }}
        />
        <InputGroup
          horizontal
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
    </div>
  ) : null;
};
