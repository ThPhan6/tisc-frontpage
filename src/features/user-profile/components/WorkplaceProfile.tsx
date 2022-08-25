import { getFullName } from '@/helper/utils';

import { useAppSelector } from '@/reducers';

import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { Title } from '@/components/Typography';

import styles from './WorkplaceProfile.less';

export const WorkplaceProfile = () => {
  const user = useAppSelector((state) => state.user.user);
  return (
    <div className={styles['workplace-container']}>
      <div className={styles.header}>
        <Title level={7}>WORKPLACE PROFILE</Title>
      </div>
      <div className={styles.content}>
        <FormGroup label="Full Name" layout="vertical" formClass={styles.form}>
          <CustomInput readOnly borderBottomColor="mono-medium" value={getFullName(user)} />
        </FormGroup>
        <FormGroup label="Work Location" layout="vertical" formClass={styles.form}>
          <CustomInput
            readOnly
            borderBottomColor="mono-medium"
            value={user?.work_location ?? 'N/A'}
          />
        </FormGroup>
        <FormGroup label="Position / Role" layout="vertical" formClass={styles.form}>
          <CustomInput readOnly borderBottomColor="mono-medium" value={user?.position ?? 'N/A'} />
        </FormGroup>
        <FormGroup label="Work Email" layout="vertical" formClass={styles.form}>
          <CustomInput readOnly borderBottomColor="mono-medium" value={user?.email ?? 'N/A'} />
        </FormGroup>
        <FormGroup label="Work Phone" layout="vertical" formClass={styles.form}>
          <CustomInput readOnly borderBottomColor="mono-medium" value={user?.phone ?? 'N/A'} />
        </FormGroup>
        <FormGroup label="Work Mobile" layout="vertical" formClass={styles.form}>
          <CustomInput readOnly borderBottomColor="mono-medium" value={user?.mobile ?? 'N/A'} />
        </FormGroup>
      </div>
    </div>
  );
};
