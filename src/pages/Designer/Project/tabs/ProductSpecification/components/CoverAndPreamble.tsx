import { FC, useState } from 'react';

import { Switch } from 'antd';

import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { MainTitle } from '@/components/Typography';

import styles from '../index.less';

interface CoverAndPreambleProps {
  data: any;
}

const CoverAndPreamble: FC<CoverAndPreambleProps> = ({ data }) => {
  const [coverPage, setCoverPage] = useState<boolean>(false);
  const onChangeCoverPage = (checked: boolean) => {
    setCoverPage(checked);
  };

  return (
    <div className={styles.standard}>
      <div className={styles.customTitle}>
        <MainTitle level={3}>Cover Page</MainTitle>
        <Switch
          checkedChildren="Yes"
          unCheckedChildren="No"
          defaultChecked={coverPage}
          className={styles.switch}
          onChange={onChangeCoverPage}
        />
      </div>

      <CollapseRadioList
        options={data.templates.cover.map((cover: any) => {
          return {
            label: cover.name,
            value: cover.value,
          };
        })}
        placeholder={data.name}
        containerClass={styles.marginBottom}
      />
    </div>
  );
};

export default CoverAndPreamble;
