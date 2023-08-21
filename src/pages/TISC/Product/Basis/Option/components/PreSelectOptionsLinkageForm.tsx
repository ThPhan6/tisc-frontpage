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

import CustomButton from '@/components/Button';
import { EntryFormWrapper } from '@/components/EntryForm';
import { BodyText } from '@/components/Typography';

import { preSelectLinkageSummarySelector, resetLinkageState, setLinkageState } from '../store';
import style from './Linkage.less';
import { LinkageOptionDataset } from './linkage/LinkageOptionDataset';

const titleProps = {
  fontFamily: 'Roboto',
  level: 4,
  style: { marginRight: 8 },
} as any;

const quantityProps = {
  fontFamily: 'Roboto',
  level: 4,
  style: { fontWeight: 500 },
} as any;

export const PreSelectOptionsLinkageForm: FC = () => {
  const dispatch = useDispatch();
  const optionId = useGetParamId();

  const { isTablet } = useScreen();

  const summary = useAppSelector(preSelectLinkageSummarySelector);

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
            options: newData as any,
          }),
        );
      }
    });
  }, [optionId]);

  const handleClearAll = () => {
    dispatch(setLinkageState({ pickedOptionIds: [] }));
  };

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
      state: pick(store.getState().linkage, 'options', 'pickedOptionIds'),
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
      <div className={style.borderBottom}>
        <div className={style.topHeader}>
          <BodyText fontFamily="Roboto" level={4}>
            Group Name :
          </BodyText>
          <div className="flex-start">
            {summary.map((el, index) => {
              const key = Object.keys(el)[0];
              const value = Object.values(el)[0];

              return (
                <div key={index} className="flex-start" style={{ marginLeft: 24 }}>
                  <BodyText {...titleProps}>{key}</BodyText>
                  <BodyText {...quantityProps}>{value}</BodyText>
                </div>
              );
            })}

            <CustomButton size="small" buttonClass={style.clearAllBtn} onClick={handleClearAll}>
              <BodyText fontFamily="Roboto" level={6}>
                Clear all
              </BodyText>
            </CustomButton>
          </div>
        </div>
      </div>
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
