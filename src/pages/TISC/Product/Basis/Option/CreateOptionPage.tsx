import { TableHeader } from '@/components/Table/TableHeader';
// import { useState } from 'react';
import styles from './styles/CreateOptionPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import OptionEntryForm from './components/OptionsEntryForm';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { IBasisOptionForm } from './types';

const CreateOptionPage = () => {
  const handleCancel = () => {
    pushTo(PATH.options);
  };

  const handleCreateOption = (data: IBasisOptionForm) => {
    console.log('data submit', data);
  };

  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'OPTION'}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container_content}>
        <OptionEntryForm onCancel={handleCancel} onSubmit={handleCreateOption} />
      </div>
    </div>
  );
};

export default CreateOptionPage;
