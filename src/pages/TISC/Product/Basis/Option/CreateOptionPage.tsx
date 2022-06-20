import { TableHeader } from '@/components/Table/TableHeader';
import { useState } from 'react';
import { SubOptionValueProps } from './types';
import styles from './styles/CreateOptionPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import { OptionEntryForm } from './components/OptionsEntryForm';

const CreateOptionPage = () => {
  const [optionValue, setOptionValue] = useState<{
    id?: string;
    name: string;
    subs: SubOptionValueProps[];
  }>({
    name: '',
    subs: [],
  });

  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'OPTION'}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container_content}>
        <OptionEntryForm optionValue={optionValue} setOptionValue={setOptionValue} />
      </div>
    </div>
  );
};

export default CreateOptionPage;
