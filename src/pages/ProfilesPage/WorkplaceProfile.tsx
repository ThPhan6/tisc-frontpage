import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { Title } from '@/components/Typography';
import { useCustomInitialState } from '@/helper/hook';
import styles from './styles/WorkplaceProfile.less';

export const WorkplaceProfile = () => {
  const { initialState } = useCustomInitialState();
  return (
    <div className={styles['workplace-container']}>
      <div className={styles.header}>
        <Title level={7}>WORKPLACE PROFILE</Title>
      </div>
      <div className={styles.content}>
        <FormGroup label="Full Name" layout="vertical" formClass={styles.form}>
          <CustomInput
            readOnly
            borderBottomColor="mono-medium"
            value={`${initialState?.currentUser?.firstname} ${initialState?.currentUser?.lastname}`}
          />
        </FormGroup>
        <FormGroup label="Work Location" layout="vertical" formClass={styles.form}>
          <CustomInput
            readOnly
            borderBottomColor="mono-medium"
            value={initialState?.currentUser?.location}
          />
        </FormGroup>
        <FormGroup label="Position / Role" layout="vertical" formClass={styles.form}>
          <CustomInput
            readOnly
            borderBottomColor="mono-medium"
            value={initialState?.currentUser?.position}
          />
        </FormGroup>
        <FormGroup label="Work Email" layout="vertical" formClass={styles.form}>
          <CustomInput
            readOnly
            borderBottomColor="mono-medium"
            value={initialState?.currentUser?.email}
          />
        </FormGroup>
        <FormGroup label="Work Phone" layout="vertical" formClass={styles.form}>
          <CustomInput readOnly borderBottomColor="mono-medium" />
        </FormGroup>
        <FormGroup label="Work Mobile" layout="vertical" formClass={styles.form}>
          <CustomInput readOnly borderBottomColor="mono-medium" />
        </FormGroup>
      </div>
    </div>
  );
};
