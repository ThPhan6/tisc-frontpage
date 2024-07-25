import { FC, useEffect } from 'react';

import { Col, Row } from 'antd';
import { history, useLocation } from 'umi';

import { confirmModal, useScreen } from '@/helper/common';
import { upsertLinkageOption } from '@/services';

import store, { useAppSelector } from '@/reducers';

import { EntryFormWrapper } from '@/components/EntryForm';

import { linkageOptionSelector, setLinkageState } from '../store';
import style from './Linkage.less';
import { LinkageConnection } from './linkage/LinkageConnection';
import { LinkageOptionDataset } from './linkage/LinkageOptionDataset';
import { LinkageSummary } from './linkage/LinkageSummary';

export const SelectOptionsLinkageForm: FC = () => {
  const { isTablet } = useScreen();

  const { state: preLinkageState } = useLocation();

  const options = useAppSelector(linkageOptionSelector);

  useEffect(() => {
    if (preLinkageState) {
      store.dispatch(
        setLinkageState({
          ...preLinkageState,
          connectionList: [],
          // expandSubOptionIds: [],
        }),
      );
    }
  }, [preLinkageState]);

  const handleCancel = () => {
    store.dispatch(
      setLinkageState({
        chosenOptionIds: [],
        connectionList: [],
        originConnectionList: [],
        // expandSubOptionIds: [],
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
      title="COMPONENT LINKAGE"
      customClass={style.formContainer}
      cancelLabel="Prev"
      handleCancel={handleCancel}
      handleSubmit={upsertLinkageOption}
      lg={24}
      span={24}
      contentStyles={{
        height: isTablet ? 'calc(var(--vh) * 100 - 168px)' : 'calc(var(--vh) * 100 - 192px)',
        padding: 0,
        overflow: 'unset',
      }}
      customStyles={{ margin: 0 }}
    >
      <LinkageSummary />

      <Row style={{ height: 'calc(100% - 48px)' }}>
        {/* main content */}
        <Col span={18} style={{ height: '100%' }}>
          <div
            className={style.contentWrapper}
            style={{ height: '100%', width: '100%', overflow: 'auto' }}
          >
            <div
              className={style.content}
              style={{
                width: '100%',
                display: 'flex',
              }}
            >
              <div className={style.main}>
                <div
                  style={{
                    paddingRight: 16,
                    paddingBottom: 16,
                    width: 'fit-content',
                    height: 'fit-content',
                    display: 'flex',
                  }}
                >
                  {options.map((mainOpt, mainOptIdx) => (
                    <LinkageOptionDataset key={mainOptIdx} mainOption={mainOpt} />
                  ))}
                </div>
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
