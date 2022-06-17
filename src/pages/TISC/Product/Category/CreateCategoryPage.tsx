import { TableHeader } from '@/components/Table/TableHeader';
import styles from './styles/CreateCategoryPage.less';
import { ReactComponent as PlusIcon } from '@/assets/icons/button-plus-disabled-icon.svg';
import { CategoryEntryForm } from './components/CategoryEntryForm';

const CreateCategoryPage = () => {
  return (
    <div className={styles.container}>
      <TableHeader
        customClass={styles.container__header}
        title={'CATEGORIES'}
        rightAction={<PlusIcon />}
      />
      <div className={styles.container__content}>
        <CategoryEntryForm />
      </div>
    </div>
  );
};

export default CreateCategoryPage;
