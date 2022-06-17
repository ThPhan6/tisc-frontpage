import { TableHeader } from '@/components/Table/TableHeader';
import styles from './styles/CreateConversionPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import { ConversionsEntryForm } from './components/ConversionsEntryForm';

const CreateConversionPage = () => {
  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'CONVERSIONS'}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container__content}>
        <ConversionsEntryForm />
      </div>
    </div>
  );
};

export default CreateConversionPage;
