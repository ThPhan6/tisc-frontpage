import { TableHeader } from '@/components/Table/TableHeader';
import { useState } from 'react';
import { SubOptionValueProps } from './types';
import styles from './styles/CreateOptionPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import { OptionEntryForm } from './components/OptionsEntryForm';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';

const CreateOptionPage = () => {
  const [optionValue, setOptionValue] = useState<{
    id?: string;
    name: string;
    subs: SubOptionValueProps[];
  }>({
    name: '',
    subs: [],
  });

  const handleCancel = () => {
    pushTo(PATH.options);
  };

  const handleCreateOption = () => {
    console.log('comming soon');
  };

  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'OPTION'}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container_content}>
        <OptionEntryForm
          optionValue={optionValue}
          setOptionValue={setOptionValue}
          onCancel={handleCancel}
          onSubmit={handleCreateOption}
        />
      </div>
    </div>
  );
};

export default CreateOptionPage;
