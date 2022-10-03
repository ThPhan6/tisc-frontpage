import { Switch } from 'antd';

import CustomButton from '@/components/Button';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { FormGroup } from '@/components/Form';

import styles from '../index.less';

const data = {
  name: 'Brands & Distributors List',
  subs: [
    {
      label: 'Brand/Distributor Summary',
      value: 'Brand/Distributor Summary',
    },
    {
      label: 'Brand Detail Listing',
      value: 'Brand Detail Listing',
    },
  ],
};

const Standard = () => {
  const renderRadioListData = () => (
    <CollapseRadioList
      options={data.subs.map((item) => {
        return {
          label: item.label,
          value: item.value,
        };
      })}
      placeholder={data.name}
      containerClass={styles.marginBottom}
    />
  );

  return (
    <div>
      <div className={styles.standard}>
        <FormGroup label="Cover Page Included" formClass={styles.customTitle}>
          <Switch
            checkedChildren="Yes"
            unCheckedChildren="No"
            defaultChecked
            className={styles.switch}
          />
        </FormGroup>
        {renderRadioListData()}
        {renderRadioListData()}
        {renderRadioListData()}
      </div>
      <div className={styles.actionButton}>
        <CustomButton size="small" properties="rounded">
          Preview
        </CustomButton>
      </div>
    </div>
  );
};

export default Standard;
