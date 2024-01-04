import { useEffect, useState } from 'react';

import { Col } from 'antd';

import { ReactComponent as InactivePairIcon } from '@/assets/icons/inactive-pair-icon-16.svg';
import { ReactComponent as PairIcon } from '@/assets/icons/pair-icon-16.svg';
import { ReactComponent as UnPairIcon } from '@/assets/icons/unpair-icon-16.svg';

import { sortBy } from 'lodash';

import store, { useAppSelector } from '@/reducers';

import { BodyText } from '@/components/Typography';

import { LinkedOption, updateLinkedOptionStatus } from '../../store';
import style from '../Linkage.less';

const pairProps = { title: 'Paired' } as any;
const unPairProps = { title: 'Unpaired' } as any;
const inactiveProps = { title: 'Inactive' } as any;

export const LinkageConnection = () => {
  const [hasScroll, setHasScroll] = useState(false);
  const connectionList = useAppSelector((state) =>
    sortBy(state.linkage.connectionList, (o) => o.productId),
  );
  const rootSubItemProductId = useAppSelector((state) => state.linkage.rootSubItemProductId);
  const chosenOptionIds = useAppSelector((state) => state.linkage.chosenOptionIds);

  const handleChangeConnectionStatus = (item: LinkedOption) => () => {
    store.dispatch(updateLinkedOptionStatus(item));
  };
  const checkItem = document.getElementById('connectionList');

  useEffect(() => {
    if (checkItem) {
      const hasVerticalScrollbar = checkItem.scrollHeight > checkItem.clientHeight;
      setHasScroll(hasVerticalScrollbar);
    }
  }, [connectionList]);

  return (
    <Col span={6} className={style.borderLeft} style={{ height: '100%' }}>
      <div className="border-bottom-light" style={{ paddingRight: hasScroll ? 12 : 0 }}>
        <div className="flex-between" style={{ margin: '0 8px 8px', minHeight: 32 }}>
          <BodyText level={4}>Connection List</BodyText>
          <BodyText level={4}>Status</BodyText>
        </div>
      </div>
      <div id="connectionList" style={{ height: 'calc(100% - 48px)', overflow: 'auto' }}>
        {!connectionList.length ? (
          <BodyText
            level={6}
            fontFamily="Roboto"
            color="mono-color-medium"
            style={{ padding: '0 8px' }}
          >
            select the product from left
          </BodyText>
        ) : (
          connectionList.map((item, index) => {
            return (
              <div
                key={index}
                className="flex-between"
                style={{ padding: '0 17px 8px 8px', minHeight: 20 }}
              >
                <BodyText fontFamily="Roboto" level={6}>
                  {rootSubItemProductId} - {item.productId}
                </BodyText>

                {chosenOptionIds.includes(item.pairId) ? (
                  <div className="cursor-pointer" onClick={handleChangeConnectionStatus(item)}>
                    {item.isPair ? <PairIcon {...pairProps} /> : <UnPairIcon {...unPairProps} />}
                  </div>
                ) : (
                  <div>
                    <InactivePairIcon {...inactiveProps} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </Col>
  );
};
