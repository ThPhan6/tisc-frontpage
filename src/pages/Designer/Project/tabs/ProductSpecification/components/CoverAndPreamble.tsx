import { FC, useState } from 'react';

import { Switch } from 'antd';

import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-icon.svg';

import { TemplatesItem } from '../type';

import CollapseCheckboxList from '@/components/CustomCheckbox/CollapseCheckboxList';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { MainTitle } from '@/components/Typography';

import styles from '../index.less';

interface CoverAndPreambleProps {
  coverAndPreamble: TemplatesItem[];
}

const CoverAndPreamble: FC<CoverAndPreambleProps> = ({ coverAndPreamble }) => {
  const [coverPage, setCoverPage] = useState<boolean>(false);
  const onChangeCoverPage = (checked: boolean) => {
    setCoverPage(checked);
  };
  const renderLabelHeader = (label: string) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: '24px',
        }}>
        {label}
        <FileSearchIcon />
      </div>
    );
  };
  return (
    <div className={styles.cover}>
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
      {coverPage ? (
        <FormGroup label="Document Title" required formClass={styles.customForm}>
          <CustomInput placeholder="e.g. Room Schedule (max.50.characters) " />
        </FormGroup>
      ) : (
        ''
      )}
      {coverAndPreamble.map((item) => (
        <CollapseCheckboxList
          options={item.items.map((cover) => {
            return {
              label: renderLabelHeader(cover.name),
              value: cover.id,
            };
          })}
          placeholder={item.name}
          containerClass={`${styles.customHeader} ${coverPage ? styles.customCollapse : ''}`}
          collapsible={coverPage ? undefined : 'disabled'}
        />
      ))}
    </div>
  );
};

export default CoverAndPreamble;
