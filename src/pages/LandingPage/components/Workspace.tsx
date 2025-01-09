import { FC, useState } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';

import { useLandingPageStyles } from './hook';
import { useCustomInitialState } from '@/helper/hook';

import { RadioValue } from '@/components/CustomRadio/types';
import { useAppSelector } from '@/reducers';
import { closeModal, modalPropsSelector } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import GroupRadioList from '@/components/CustomRadio/RadioList';
import { CustomModal } from '@/components/Modal';
import { MainTitle } from '@/components/Typography';

import styles from './Workspace.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

export const Workspace: FC = () => {
  const popupStylesProps = useLandingPageStyles();
  const { fetchUserInfo } = useCustomInitialState();
  const workspaces = useAppSelector(modalPropsSelector).workspaces || [];
  const [tokenSelected, setTokenSelected] = useState<RadioValue>();

  const Login = async () => {
    if (tokenSelected?.value) {
      closeModal();
      showPageLoading();
      localStorage.setItem('access_token', tokenSelected.value as string);
      message.success(MESSAGE_NOTIFICATION.LOGIN_SUCCESS);
      await fetchUserInfo(true);
      hidePageLoading();
    }
  };

  return (
    <CustomModal {...popupStylesProps}>
      <div className={styles.content}>
        <div className={styles.main}>
          <MainTitle level={2} style={{ paddingBottom: 32 }}>
            Select Below Account
          </MainTitle>

          <GroupRadioList
            data={workspaces.map((wk) => ({
              options: [{ label: wk.name, value: wk.id /* token */ }],
            }))}
            selected={tokenSelected}
            onChange={setTokenSelected}
          />

          <div className={styles.login}>
            <CustomButton onClick={Login} buttonClass={styles.submit}>
              Account Login
            </CustomButton>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
