import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { PATH } from '@/constants/path';
import { message } from 'antd';
import { history } from 'umi';

import { useScreen } from '@/helper/common';
import { useGetParamId } from '@/helper/hook';
import { getOneBasisOption } from '@/services';
import { pick } from 'lodash';

import store, { useAppSelector } from '@/reducers';

import { EntryFormWrapper } from '@/components/EntryForm';

import { setLinkageState } from '../store';
import style from './Linkage.less';
import { LinkageOptionDataset } from './linkage/LinkageOptionDataset';
import { LinkageSummary } from './linkage/LinkageSummary';

export const PreSelectOptionsLinkageForm: FC = () => {
  const dispatch = useDispatch();
  const optionId = useGetParamId();

  const { isTablet } = useScreen();

  const options = useAppSelector((state) => state.linkage.options);

  const notSelected = useAppSelector((state) => state.linkage.pickedOptionIds.length === 0);

  useEffect(() => {
    if (options.length) {
      return;
    }

    getOneBasisOption(optionId).then((res) => {
      if (res) {
        const newData = [...res.subs];

        dispatch(
          setLinkageState({
            groupName: res.name ?? 'N/A',
            options: newData as any,
          }),
        );
      }
    });
  }, [optionId]);

  const handleCancel = () => {
    history.push(PATH.options);
  };

  const handleSubmit = () => {
    if (notSelected) {
      message.error('Please select options');
      return;
    }
    /// save data to history state
    history.push({
      state: pick(store.getState().linkage, 'options', 'pickedOptionIds', 'groupName'),
    });
  };

  return (
    <EntryFormWrapper
      title="DATASET LINKAGE"
      customClass={style.formContainer}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      submitLabel="Next"
      lg={24}
      span={24}
      contentStyles={{
        height: isTablet ? 'calc(var(--vh) * 100 - 168px)' : 'calc(var(--vh) * 100 - 192px)',
        padding: 0,
        overflow: 'auto',
      }}
      customStyles={{ margin: 0 }}
    >
      <LinkageSummary />

      <div className={style.contentWrapper}>
        <div className={style.content}>
          <div className={style.main}>
            {options.map((mainOpt, mainOptIdx) => (
              <LinkageOptionDataset key={mainOptIdx} mainOption={mainOpt} />
            ))}
          </div>
        </div>
      </div>
    </EntryFormWrapper>
  );
};
