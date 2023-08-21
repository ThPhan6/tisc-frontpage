import { FC, useEffect } from 'react';

import { Col, Row } from 'antd';
import { history, useLocation } from 'umi';

import { confirmModal, useScreen } from '@/helper/common';
import { upsertLinkageOption } from '@/services';

import store, { useAppSelector } from '@/reducers';

import CustomButton from '@/components/Button';
import { EntryFormWrapper } from '@/components/EntryForm';
import { BodyText } from '@/components/Typography';

import { linkageOptionSelector, linkageSummarySelector, setLinkageState } from '../store';
import style from './Linkage.less';
import { LinkageConnection } from './linkage/LinkageConnection';
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

export const SelectOptionsLinkageForm: FC = () => {
  const { isTablet } = useScreen();

  const { state: preLinkageState } = useLocation();
  // const { pickedOptionIds, options } = preLinkageState as {
  //   pickedOptionIds: string[];
  //   options: BasisOptionForm[];
  // };

  const summary = useAppSelector(linkageSummarySelector);

  const options = useAppSelector(linkageOptionSelector);

  useEffect(() => {
    if (preLinkageState) {
      store.dispatch(
        setLinkageState({
          ...preLinkageState,
          connectionList: [],
          expandSubOptionIds: [],
        }),
      );
    }
  }, [preLinkageState]);

  const handleClearAll = () => {
    store.dispatch(
      setLinkageState({
        chosenOptionIds: [],
        connectionList: [],
        rootSubItemId: '',
        rootMainOptionId: '',
        rootSubItemProductId: '',
      }),
    );
  };

  const handleCancel = () => {
    store.dispatch(
      setLinkageState({
        chosenOptionIds: [],
        connectionList: [],
        originConnectionList: [],
        expandSubOptionIds: [],
        rootSubItemId: '',
        rootMainOptionId: '',
        rootSubItemProductId: '',
      }),
    );

    /// set data option selected is null, go back to pre-select page
    history.push({ state: null });

    confirmModal({
      title: 'Do you want to keep pre select?',
      content: 'This action cannot be undo',
      onCancel: () => {
        store.dispatch(
          setLinkageState({
            pickedOptionIds: [],
          }),
        );
      },
    });
  };

  return (
    <EntryFormWrapper
      title="DATASET LINKAGE"
      customClass={style.formContainer}
      cancelLabel="Prev"
      handleCancel={handleCancel}
      handleSubmit={upsertLinkageOption}
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
        {/* top header */}
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

      <Row style={{ height: 'calc(100% - 48px)' }}>
        {/* main content */}
        <Col span={18}>
          <div className={style.contentWrapper} style={{ height: '100%' }}>
            <div className={style.content}>
              <div className={style.main}>
                {options.map((mainOpt, mainOptIdx) => (
                  <LinkageOptionDataset key={mainOptIdx} mainOption={mainOpt} />
                ))}
              </div>
            </div>
          </div>
        </Col>

        {/* connection list */}
        <LinkageConnection />
      </Row>
    </EntryFormWrapper>
  );
};
